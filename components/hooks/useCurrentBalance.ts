import useViewer from './useViewer';
import { formatMicroDollars } from '../utils/formatMoney';
import { useWSQuery } from '../websocket/hooks/useWSQuery';

interface BalanceResult {
    rawBalance: bigint;
    formattedBalance: string;
    isLoading: boolean;
}

const roundDownToNearestCent = (amount: bigint): bigint => {
    return amount - (amount % 10000n);
};

export const useBalance = (accountId: string): any => {
    // const { data: balance } = useWSQuery<string>(
    //     WebsocketsQueries.getAccountBalance,
    //     {
    //         accountId,
    //     },
    //     accountId ? true : false,
    // );

    // const bigIntBalance = BigInt(balance ?? 0);
    // const formattedBalance: string = formatMicroDollars(
    //     Number(roundDownToNearestCent(bigIntBalance)),
    // );
    // return {
    //     rawBalance: bigIntBalance,
    //     formattedBalance,
    //     isLoading: balance === undefined,
    // };
};

export const useCurrentUserBalance = (): any => {
    // const { userId } = useViewer();

    // const balance = useBalance(userId ?? '');

    // return balance;
};
