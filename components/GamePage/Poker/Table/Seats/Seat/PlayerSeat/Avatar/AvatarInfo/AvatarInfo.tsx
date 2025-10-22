import { Text, useBreakpointValue, VStack, Box } from '@chakra-ui/react';
import { Action } from '../../../../../../../../../client';
import { truncated } from '../../../../../../../../utils/getPlayerInfo';
import { usePlayerUsername } from '../../../../../../../../hooks/usePlayerUsername';
import { useMoneyDisplay } from '../../../../../../../../Shared/MoneyDisplay';
import { useEffect, useState, useRef } from 'react';
import useGameData from '../../../../../../../../hooks/useGameData';

// Temporary interface to fix type error
interface Player {
    player_id: string;
    amount: bigint;
    action?: Action;
    hand_win_odds?: number[];
    hand?: any[];
    bet_amount: bigint;
}

interface AvatarInfoProps {
    player: Player;
    isAway?: boolean;
    isShowdown?: boolean;
    isWinner?: boolean;
    amountWon?: bigint;
}

export const AvatarInfo = ({
    player,
    isAway,
    isShowdown,
    isWinner,
    amountWon,
}: AvatarInfoProps) => {
    const username = usePlayerUsername(player.player_id);
    const { gameSettings, bombPotEligible } = useGameData();
    const isDoubleBoardActive =
        gameSettings?.double_board === 0 ||
        (gameSettings?.double_board === 2 && !!bombPotEligible);

    const isFolded = player.action === Action.FOLD;
    const textColor =
        !isFolded && !isAway ? 'brand.accentWhite' : 'rgba(83, 89, 92, 0.82)';
    const textColorAmount = isFolded
        ? 'rgba(108, 125, 132, 0.8)'
        : 'rgb(162, 223, 252)';
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const moneyDisplay = useMoneyDisplay(
        player.amount,
        isFolded,
        true,
        player.bet_amount,
    );
    const amountWonDisplay = useMoneyDisplay(
        amountWon ?? 0n,
        isFolded,
        true,
        player.bet_amount,
    );

    const [displayName, setDisplayName] = useState<string>(truncated(username));
    const [isShowingWinOdds, setIsShowingWinOdds] = useState<boolean>(false);
    const [winOdds, setWinOdds] = useState<number>(0);
    const [winOddsDouble, setWinOddsDouble] = useState<[number, number] | null>(
        null,
    );
    const [showWinningAmount, setShowWinningAmount] = useState<boolean>(false);
    const [winningAmountOpacity, setWinningAmountOpacity] = useState<number>(1);
    const [storedWinningAmountDisplay, setStoredWinningAmountDisplay] =
        useState<string>('');
    const prevOddsRef = useRef<number | undefined>(undefined);
    const prevDoubleOddsRef = useRef<[number, number] | null>(null);
    const prevShowingOddsRef = useRef<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const winningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle winning amount display
    useEffect(() => {
        if (isWinner && amountWon && amountWon > 0n) {
            if (winningTimeoutRef.current)
                clearTimeout(winningTimeoutRef.current);
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
            setStoredWinningAmountDisplay(amountWonDisplay);
            setShowWinningAmount(true);
            setWinningAmountOpacity(1);
        } else if (showWinningAmount) {
            if (winningTimeoutRef.current)
                clearTimeout(winningTimeoutRef.current);
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
            setWinningAmountOpacity(0);
            fadeTimeoutRef.current = setTimeout(() => {
                setShowWinningAmount(false);
                setStoredWinningAmountDisplay('');
            }, 500);
        } else {
            if (winningTimeoutRef.current)
                clearTimeout(winningTimeoutRef.current);
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
            setShowWinningAmount(false);
            setWinningAmountOpacity(1);
            setStoredWinningAmountDisplay('');
        }

        return () => {
            if (winningTimeoutRef.current)
                clearTimeout(winningTimeoutRef.current);
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
        };
    }, [isWinner, amountWon, showWinningAmount, amountWonDisplay]);

    useEffect(() => {
        if (isShowdown) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setDisplayName(truncated(username));
            setIsShowingWinOdds(false);
            setWinOdds(0);
            setWinOddsDouble(null);
        } else {
            // New unified odds array: default [-1, -1]
            const oddsArr = Array.isArray(player.hand_win_odds)
                ? player.hand_win_odds!
                : [-1, -1];
            const odds0 = oddsArr[0] ?? -1;
            const odds1 = oddsArr[1] ?? -1;
            const hasFirst = odds0 >= 0;
            const hasSecond = odds1 >= 0;

            const showDouble = isDoubleBoardActive && hasFirst && hasSecond;
            const currentlyShowingOdds = hasFirst; // show at least single if index 0 exists

            const oddsChangedSingle =
                !showDouble &&
                currentlyShowingOdds &&
                prevShowingOddsRef.current &&
                prevOddsRef.current !== undefined &&
                odds0 !== prevOddsRef.current;

            if (showDouble) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setDisplayName(`${odds0}% | ${odds1}%`);
                setIsShowingWinOdds(true);
                setWinOddsDouble([odds0, odds1]);
                setWinOdds(0);
            } else if (oddsChangedSingle) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    setDisplayName(`${odds0}%`);
                    setIsShowingWinOdds(true);
                    setWinOdds(odds0);
                    setWinOddsDouble(null);
                }, 420);
            } else if (currentlyShowingOdds) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setDisplayName(`${odds0}%`);
                setIsShowingWinOdds(true);
                setWinOdds(odds0);
                setWinOddsDouble(null);
            } else {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setDisplayName(truncated(username));
                setIsShowingWinOdds(false);
                setWinOdds(0);
                setWinOddsDouble(null);
            }

            prevOddsRef.current = hasFirst ? odds0 : undefined;
            prevShowingOddsRef.current = currentlyShowingOdds;
            prevDoubleOddsRef.current = showDouble ? [odds0, odds1] : null;
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [player.hand_win_odds, username, isShowdown, isDoubleBoardActive]);

    const getWinOddsColor = (value: number) => {
        if (value < 15) return '#FF6666';
        if (value < 30) return '#FFBBBB';
        if (value < 50) return '#FFFFE0';
        if (value < 75) return '#ABEBC6';
        return '#2ECC71';
    };

    const getTextColor = () => {
        if (!isShowingWinOdds) return textColor;
        return getWinOddsColor(winOdds);
    };

    // Determine what to display in the amount section
    const getAmountDisplay = () => {
        if (isAway) return 'AWAY';
        if (showWinningAmount) return ''; // Hide player amount while showing winning amount
        return moneyDisplay;
    };

    const getAmountColor = () => {
        if (isAway) return 'brand.gray10';
        if (showWinningAmount) return 'transparent'; // Hide player amount text
        return textColorAmount;
    };

    return (
        <VStack
            py={isPortrait ? '0.25vmax' : '0.5vmin'}
            spacing={isPortrait ? '0.2875vmax' : '0.2875vmin'}
            h="100%"
            w="100%"
            borderRadius="full"
            justifyContent="center"
            position="relative"
        >
            {winOddsDouble ? (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="100%"
                    overflow="hidden"
                    whiteSpace="nowrap"
                >
                    <Text
                        color={getWinOddsColor(winOddsDouble[0])}
                        fontWeight="700"
                        fontSize={isPortrait ? '1.35vmax' : '1.45vmin'}
                        textAlign="center"
                        letterSpacing="-0.01px"
                    >
                        {`${winOddsDouble[0]}%`}
                    </Text>
                    <Text
                        color="brand.gray10"
                        opacity={0.6}
                        mx={isPortrait ? '0.3vmax' : '0.3vmin'}
                        fontWeight="700"
                        fontSize={isPortrait ? '1.35vmax' : '1.45vmin'}
                        letterSpacing="-0.01px"
                    >
                        |
                    </Text>
                    <Text
                        color={getWinOddsColor(winOddsDouble[1])}
                        fontWeight="700"
                        fontSize={isPortrait ? '1.35vmax' : '1.45vmin'}
                        textAlign="center"
                        letterSpacing="-0.01px"
                    >
                        {`${winOddsDouble[1]}%`}
                    </Text>
                </Box>
            ) : (
                <Text
                    color={getTextColor()}
                    fontWeight="700"
                    overflow="hidden"
                    fontSize={isPortrait ? '1.325vmax' : '1.4vmin'}
                    textAlign="center"
                    textOverflow="ellipsis"
                    w="100%"
                    whiteSpace="nowrap"
                    letterSpacing="-0.02px"
                >
                    {displayName}
                </Text>
            )}
            <Box
                h={isPortrait ? '1.25vmax' : '1.5vmin'}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Text
                    color={getAmountColor()}
                    fontWeight="800"
                    lineHeight={isPortrait ? '1.25vmax' : '1.5vmin'}
                    fontSize={isPortrait ? '1.35vmax' : '1.425vmin'}
                    textAlign="center"
                    letterSpacing="-0.01px"
                >
                    {getAmountDisplay()}
                </Text>
            </Box>
            {showWinningAmount && (
                <Box
                    position="absolute"
                    top="72%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    bg="#4A9A6D"
                    borderRadius="0.5rem"
                    py={isPortrait ? '0.28vmax' : '0.38vmin'}
                    px={isPortrait ? '0.5vmax' : '0.7vmin'}
                    opacity={winningAmountOpacity}
                    transition="opacity 0.5s ease-out"
                    zIndex={10}
                >
                    <Text
                        color="brand.textWhite"
                        fontWeight="800"
                        lineHeight={isPortrait ? '1.1vmax' : '1.3vmin'}
                        fontSize={isPortrait ? '1.175vmax' : '1.25vmin'}
                        textAlign="center"
                    >
                        +{storedWinningAmountDisplay}
                    </Text>
                </Box>
            )}
        </VStack>
    );
};

export default AvatarInfo;
