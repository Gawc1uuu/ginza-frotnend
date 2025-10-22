'use client';
import {
    VStack,
    Spacer,
    HStack,
    useBreakpointValue,
    Text,
    Box,
} from '@chakra-ui/react';
import { GameStat } from './GameStat';
import { useGameCard } from './useGameCard';
import { useGameAllPlayers } from '../../hooks/useGamePlayers';
import { GameDetails } from '../../hooks/useGameHistory';
import { GameCardHeader } from './GameCardHeader';
import { ShowPlayersSection } from './ShowPlayersSection';
import useViewer from '../../hooks/useViewer';
import { FaRegCopy } from 'react-icons/fa';
import { formatDateTime } from './utils';
import { getGameTypeString } from './utils';


const ActiveGameInfo = ({ game }: { game: GameDetails }) => {
    return (
        <HStack width="100%" justify="space-between">
            <HStack spacing="1rem">
                <GameStat label="Buy-in" value={game.buy_in} />
            </HStack>
        </HStack>
    );
};

const PastGameInfo = ({ game }: { game: GameDetails }) => {
    const positive = game.cashout >= game.buy_in;

    return (
        <HStack width="100%" justify="space-between">
            <HStack spacing="1rem">
                <GameStat label="Buy-in" value={game.buy_in} />
                <GameStat label="Cashout" value={game.cashout} />
                <GameStat label="Rewards" value={game.rake} />
                <GameStat
                    label="PnL"
                    value={game.cashout - game.buy_in}
                    statColor={positive ? 'green.300' : 'red.400'}
                    addSignage
                />
            </HStack>
        </HStack>
    );
};

const PortraitPastGameInfo = ({
    game,
}: {
    game: GameDetails;
    isOtherUser: boolean;
    user: any;
    smallBlind: number;
    bigBlind: number;
}) => {
    const positive = game.cashout >= game.buy_in;
    return (
        <HStack width="100%" justify="flex-start" spacing="1rem">
            <GameStat label="Buy-in" value={game.buy_in} />
            <GameStat label="Cashout" value={game.cashout} />
            <GameStat
                label="PnL"
                value={game.cashout - game.buy_in}
                statColor={positive ? 'green.300' : 'red.400'}
                addSignage
            />
        </HStack>
    );
};

export function GameCard({
    game,
    gameData,
    user,
}: {
    game: GameDetails;
        user: any;
    gameData?: any;
    loading: boolean;
}) {
    const { handleRejoinGame, smallBlind, bigBlind, gameMode } = useGameCard(
        game,
        gameData,
    );
    const players = [{ player_id: '123' }, { player_id: '456' }];
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const isOtherUser = user !== null && user.username !== 'testuser';
    const gameType = getGameTypeString(gameMode);
    const topBorderColor =
        gameType === "NL HOLD'EM"
            ? 'rgba(180, 85, 200, 0.85)'
            : gameType === 'POT-LIMIT OMAHA'
              ? 'rgba(80, 130, 255, 0.85)'
              : 'rgba(255,255,255,0.35)';
    const sideAccentColor =
        gameType === "NL HOLD'EM"
            ? 'rgba(64, 31, 71, 0.45)'
            : gameType === 'POT-LIMIT OMAHA'
              ? 'rgba(48, 73, 135, 0.45)'
              : 'rgba(255,255,255,0.12)';
    const cornerAccentColor =
        gameType === "NL HOLD'EM"
            ? 'rgba(146, 58, 168, 0.45)'
            : gameType === 'POT-LIMIT OMAHA'
              ? 'rgba(60, 100, 200, 0.45)'
              : 'rgba(255,255,255,0.12)';
    const bottomBorderColor = 'rgba(255,255,255,0.12)';

    return (
        <VStack
            width="100%"
            // bg="brand.modalGray"
            // bg="brand.primaryGray"
            // bg="linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.0) 100%), #0C0E18"
            // bg="linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.0) 100%), #0C0E18"
            bg="linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.0) 100%),rgb(8, 9, 14)"
            borderRadius="1rem"
            p="1rem"
            pb="2.25rem"
            borderWidth="0.25px"
            borderStyle="solid"
            borderTopWidth="0.75px"
            borderTopColor={topBorderColor}
            borderRightWidth="0"
            borderBottomColor={sideAccentColor}
            borderBottomWidth="0.01px"
            borderLeftColor={cornerAccentColor}
            sx={{
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '12px',
                    right: '12px',
                    height: 'px',
                    background: `linear-gradient(90deg, ${cornerAccentColor} 0%, ${topBorderColor} 15%, ${topBorderColor} 85%, ${cornerAccentColor} 100%)`,
                    zIndex: 1,
                },
            }}
            align="stretch"
            overflow="hidden"
            position="relative"
        >
            <GameCardHeader
                game={game}
                gameData={gameData}
                isOtherUser={isOtherUser}
                user={user}
                handleRejoinGame={handleRejoinGame}
            />

            <VStack
                width="100%"
                align="start"
                // bg="brand.gray45"
                bg="brand.primaryGray"
                borderRadius="16px"
                p="0.75rem"
                pl={isPortrait ? '1.5rem' : '1rem'}
                spacing="0.5rem"
            >
                {!gameData?.archived ? (
                    <ActiveGameInfo game={game} />
                ) : isPortrait ? (
                    <PortraitPastGameInfo
                        game={game}
                        user={user}
                        isOtherUser={isOtherUser}
                        smallBlind={smallBlind}
                        bigBlind={bigBlind}
                    />
                ) : (
                    <PastGameInfo game={game} />
                )}

                <ShowPlayersSection
                    playerIds={players?.map((p: any) => p.player_id)}
                />
            </VStack>

            <HStack
                width="100%"
                justify="space-between"
                position="absolute"
                bottom="0.5rem"
                pl="0.5rem"
                pr="2rem"
            >
                <Text
                    fontWeight="semibold"
                    fontSize="13px"
                    textAlign="left"
                    color="rgba(255, 255, 255, 0.60)"
                    noOfLines={1}
                >
                    {formatDateTime(game?.game_start_time)}
                </Text>
                <Spacer />
                <HStack spacing="0.5rem">
                    <Text
                        fontSize="13px"
                        fontWeight="semibold"
                        color="rgba(255, 255, 255, 0.60)"
                    >
                        Game ID: {game.game_id.slice(0, 4)}...
                        {game.game_id.slice(-4)}
                    </Text>
                    {(!isOtherUser) && (
                        <Box
                            as="span"
                            cursor="pointer"
                            _hover={{ color: 'white' }}
                            color="rgba(255, 255, 255, 0.60)"
                            onClick={() =>
                                navigator.clipboard.writeText(game.game_id)
                            }
                        >
                            <FaRegCopy size={14} />
                        </Box>
                    )}
                </HStack>
            </HStack>
        </VStack>
    );
}
