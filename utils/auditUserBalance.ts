import { processGameHistory, Transaction } from '../components/hooks/useGameHistory';
import HttpClient from '../components/websocket/HttpClient';
import {
    HttpNamespaces,
    HttpQueries,
} from '../../../packages/shared/http.events';
import { UserDto } from '../../../packages/shared/shared.types';

/**
 * Performs a comprehensive audit of a user's balance by comparing their current balance
 * with the sum of all deposits, withdrawals, and game outcomes.
 *
 * @param client The Convex client to use for queries
 * @param userId The user's ID to audit
 * @returns A promise with the audit result containing expected balance and discrepancy
 */
export async function auditUserBalanceHttp(client: HttpClient, userId: string) {
    try {
        // // Fetch the user's current balance

        const currentBalance = await client.query(
            HttpNamespaces.LEDGER,
            HttpQueries.getAccountBalance,
            {
                accountId: userId,
            },
        );

        const transactions = await client.query<Transaction & { type: string; status: string; amount: string }[]>(
            HttpNamespaces.USER,
            HttpQueries.getTransactionsForUser,
            {
                userId: userId,
            },
        );

        const user = await client.query<UserDto>(
            HttpNamespaces.USER,
            HttpQueries.getUserByUserId,
            {
                userId: userId,
            },
        );

        const username = user?.username || 'Unknown User';

        const deposits = transactions.filter(
            (tx) => tx.type === 'DEPOSIT' && tx.status === 'COMPLETED',
        );
        const withdrawals = transactions.filter(
            (tx) => tx.type === 'WITHDRAWAL' && tx.status === 'COMPLETED',
        );

        const totalDeposits = deposits.reduce(
            (sum, deposit) => sum + BigInt(deposit.amount),
            0n,
        );
        const totalWithdrawals = withdrawals.reduce(
            (sum, withdrawal) => sum + BigInt(withdrawal.amount),
            0n,
        );

        const gameTransactions =
            (await client.query(
                HttpNamespaces.LEDGER,
                HttpQueries.getGameTransactionsForUser,
                {
                    userId: userId,
                },
            )) ?? [];

        const games = processGameHistory(gameTransactions);

        const totalBuyins = games.reduce(
            (acc, game) => acc + BigInt(game.buy_in),
            0n,
        );

        const totalCashouts = games.reduce(
            (acc, game) => acc + BigInt(game.cashout),
            0n,
        );

        const totalPnl = totalCashouts - totalBuyins;

        let hostRewards = 0n;
        try {

            const lifetimeRewards = await client.query(
                HttpNamespaces.LEDGER,
                HttpQueries.getLifetimeRewards,
                {
                    userId: userId,
                },
            );

            hostRewards = BigInt(lifetimeRewards || 0);
        } catch (rewardsError) {
            console.warn(
                'Could not fetch host rewards, continuing audit without rewards data:',
                rewardsError,
            );
        }

        // Fetch affiliate rewards
        let affiliateRewards = 0n;
        try {

            const lifetimeAffiliateRewards = await client.query(
                HttpNamespaces.LEDGER,
                HttpQueries.getLifetimeAffiliateRewardsForUser,
                {
                    accountId: userId,
                },
            );

            affiliateRewards = BigInt(lifetimeAffiliateRewards || 0);
        } catch (affiliateError) {
            console.warn(
                'Could not fetch affiliate rewards, continuing audit without affiliate reward data:',
                affiliateError,
            );
        }

        const expectedBalance =
            BigInt(totalDeposits) -
            BigInt(totalWithdrawals) +
            BigInt(totalPnl) +
            BigInt(hostRewards) +
            BigInt(affiliateRewards);
        const discrepancy = BigInt(currentBalance) - expectedBalance;

        return {
            userId,
            username,
            currentBalance,
            expectedBalance,
            discrepancy,
            details: {
                totalDeposits,
                totalWithdrawals,
                totalPnl,
                hostRewards,
                affiliateRewards, // Add affiliateRewards to details
            },
            result: Number(discrepancy) < 1 ? 'PASSED' : 'FAILED',
        };
    } catch (error) {
        console.error('Error during user balance audit:', error);
        throw new Error('Failed to complete user balance audit: ' + error);
    }
}

export async function logAuditResults(
    auditResult: Awaited<ReturnType<typeof auditUserBalanceHttp>>,
) {
    // TODO: add audit table later to track audit results / track failures/ flag suspicious accounts
    return auditResult;
}
