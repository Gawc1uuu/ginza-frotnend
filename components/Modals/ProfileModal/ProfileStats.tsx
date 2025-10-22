import React from 'react';
import {
    VStack,
    Box,
    HStack,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { GameDetails, GameProgressStatus } from '../../hooks/useGameHistory';
import { convertCurrencyToDisplay } from '../../utils/convertCurrency';
import { FaArrowTrendUp, FaChartLine } from 'react-icons/fa6';

const StatCard = ({
    title,
    value,
    icon,
    valueColor,
    bgOverride,
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
    valueColor?: string;
    bgOverride?: string;
}) => {
    const isPortrait = useBreakpointValue({
        base: true,
        md: true,
        lg: false,
        xl: false,
    });
    return (
        <Box
            border="none"
            background={
                bgOverride ??
                'linear-gradient(180deg, rgba(190, 204, 216, 0.15) 0%, rgba(24, 26, 32, 0.60) 100%), rgba(15, 17, 24, 0.70)'
            }
            borderRadius="1rem"
            p="16px"
            flex={1}
        >
            {isPortrait ? (
                <HStack spacing="0.75rem" align="center">
                    <Box bg="white" borderRadius="full" p="0.5rem">
                        {icon}
                    </Box>
                    <VStack spacing="0.15rem" align="start">
                        <Text
                            size="md"
                            color="rgba(220, 225, 232, 0.8)"
                            fontWeight="600"
                            opacity="1"
                        >
                            {title}
                        </Text>
                        <Text
                            fontSize="1.25rem"
                            fontWeight="700"
                            color={valueColor ?? 'brand.white80'}
                        >
                            {value}
                        </Text>
                    </VStack>
                </HStack>
            ) : (
                <VStack align="start" spacing="1.875rem">
                    <Box bg="white" borderRadius="full" p="0.5rem">
                        {icon}
                    </Box>
                    <VStack spacing="0.25rem" align="start">
                        <Text
                            size="md"
                            color="rgba(220, 225, 232, 0.8)"
                            fontWeight="600"
                            opacity="1"
                        >
                            {title}
                        </Text>
                        <Text
                            fontSize="1.25rem"
                            fontWeight="700"
                            color={valueColor ?? 'brand.white85'}
                        >
                            {value}
                        </Text>
                    </VStack>
                </VStack>
            )}
        </Box>
    );
};

export const ProfileStats = ({ games }: { games: GameDetails[] }) => {
    const totalBuyins = games.reduce(
        (acc, game) => acc + BigInt(game.buy_in),
        0n,
    );
    const totalCashouts = games.reduce(
        (acc, game) => acc + BigInt(game.cashout),
        0n,
    );
    const totalPnl = totalCashouts - totalBuyins;
    const totalPnlString = convertCurrencyToDisplay(totalPnl);
    const totalPnlDisplay =
        totalPnl < 0
            ? `-$${totalPnlString.slice(1)}`
            : totalPnlString === '0.00'
              ? `$${totalPnlString}`
              : `+$${totalPnlString}`;

    const pnlColor =
        totalPnl > 0n
            ? 'teal.300'
            : totalPnl < 0n
              ? 'pink.300'
              : 'brand.white85';

    // Darker top-right variation while keeping same top-left feel
    // const profitLossBg = "linear-gradient(to top right, rgba(18, 20, 28, 0.22) 0%, rgba(18, 20, 28, 0.00) 60%), linear-gradient(180deg, rgba(190, 204, 216, 0.15) 0%, rgba(20, 22, 28, 0.65) 100%), rgba(15, 17, 24, 0.72)";

    const profitLossBg =
        'linear-gradient(to top right, rgba(19, 22, 30, 0.61) 0%, rgba(29, 29, 39, 0.73) 60%), linear-gradient(180deg, rgba(190, 204, 216, 0.15) 0%, rgba(20, 22, 28, 0.65) 100%), rgba(15, 17, 24, 0.72)';
    return (
        <HStack
            align="start"
            flex={1}
            spacing={4}
            justifyContent="center"
            w="100%"
            h="100%"
        >
            <StatCard
                title="Games played"
                value={games.length.toString()}
                icon={<FaChartLine />}
                valueColor="brand.white80"
            />
            <StatCard
                title="Profit/Loss"
                value={totalPnlDisplay}
                icon={<FaArrowTrendUp />}
                valueColor={pnlColor}
                bgOverride={profitLossBg}
            />
        </HStack>
    );
};
