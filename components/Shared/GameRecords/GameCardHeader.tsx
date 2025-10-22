import React, { useState } from 'react';
import {
    VStack,
    HStack,
    Text,
    Box,
    useToast,
    useBreakpointValue,
} from '@chakra-ui/react';
import { getGameTypeString } from './utils';
import { useGameCard } from './useGameCard';
import { GameDetails, GameProgressStatus } from '../../hooks/useGameHistory';
import {
    formatBlindsWithSymbol,
    formatMicroDollarsWithCommas,
} from '../../utils/formatMoney';

import { FaPlay } from 'react-icons/fa';
import GameStatusIcon from '../../Modals/ProfileModal/GameStatusIcon/GameStatusIcon';
import { useHotkeyBlockingDisclosure } from '../../hooks/useHotkeyBlockingDisclosure';
import { Button } from '@chakra-ui/react';
import {
    convertCurrencyToDisplay,
    convertPNLCurrencyToDisplay,
} from '../../utils/convertCurrency';
import ShareGameButton from './ShareGameButton';
import { ShareGameModal } from './ShareGameModal';
import { handleShareClick } from './generateGameImage';
import { GiPokerHand } from 'react-icons/gi';
import { LogGameButton } from './LogGameButton';
import { LogGameModal } from './LogGameModal';
import { IGameData, UserDto } from '../../../../../packages/shared/shared.types';

export const GameCardHeader = ({
    game,
    gameData,
    isOtherUser,
    user,
    handleRejoinGame,
}: {
    game: GameDetails;
    gameData?: IGameData;
    isOtherUser: boolean;
    user: UserDto;
    handleRejoinGame: () => void;
}) => {
    const { smallBlind, bigBlind, gameMode, nonce } = useGameCard(
        game,
        gameData,
    );
    const { isOpen, onOpen, onClose } = useHotkeyBlockingDisclosure();
    const {
        isOpen: isLogOpen,
        onOpen: onLogOpen,
        onClose: onLogClose,
    } = useHotkeyBlockingDisclosure();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const toast = useToast();
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    const isCompleted = gameData?.gameData?.archived || gameData?.archived;


    const formatBlindsShort = (
        sb: number | bigint | undefined,
        bb: number | bigint | undefined,
    ) => {
        const fmt = (v: number | bigint | undefined) => {
            const n = Number(v ?? 0) / 1e6;
            return Number.isInteger(n)
                ? n.toString()
                : n.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                  });
        };
        return `${fmt(sb)}/${fmt(bb)}`;
    };

    const statusLabel = isCompleted ? 'COMPLETED' : 'IN PROGRESS';
    const statusColor = isCompleted
        ? 'rgba(86, 208, 157, 0.9)'
        : 'rgba(235, 205, 135, 0.92)';
    const chipTopColor = isCompleted
        ? 'rgba(46, 199, 141, 0.8)'
        : 'rgba(206, 178, 79, 0.8)';
    const chipSideColor = isCompleted
        ? 'rgba(8, 67, 43, 0.8)'
        : 'rgba(109, 81, 21, 0.77)';

    return (
        <>
            <VStack align="start" spacing={1} width="100%">
                <HStack justify="space-between" width="100%" align="start">
                    <VStack align="start">
                        {isPortrait ? (
                            <VStack align="start" spacing="0.5rem">
                                <HStack align="center">
                                    {getGameTypeString(gameMode) ===
                                        "NL HOLD'EM" && (
                                        <Box
                                            mr="8px"
                                            border="2.125px solid"
                                            borderColor="rgba(200,100,220,0.8)"
                                            borderRadius="full"
                                            w="32px"
                                            h="32px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <img
                                                src="/HoldemIcon.png"
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                }}
                                            />
                                        </Box>
                                    )}
                                    {getGameTypeString(gameMode) ===
                                        'POT-LIMIT OMAHA' && (
                                        <Box
                                            mr="8px"
                                            border="2px solid"
                                            borderColor="rgba(100,140,255,0.9)"
                                            borderRadius="full"
                                            w="32px"
                                            h="32px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <GiPokerHand
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    color: 'white',
                                                }}
                                            />
                                        </Box>
                                    )}
                                    <Text
                                        fontSize="1.125rem"
                                        fontWeight="800"
                                        textAlign="left"
                                        color={
                                            getGameTypeString(gameMode) ===
                                            "NL HOLD'EM"
                                                ? 'rgba(223, 165, 238, 0.9)'
                                                : 'blue.300'
                                        }
                                        mt="-0.35rem"
                                        ml="-0.25rem"
                                    >
                                        {getGameTypeString(gameMode) ===
                                        "NL HOLD'EM"
                                            ? 'NO-LIMIT HOLDEM'
                                            : getGameTypeString(gameMode)}
                                    </Text>
                                </HStack>
                                <HStack
                                    align="center"
                                    spacing="0.5rem"
                                    ml="42px"
                                    mt="-0.5rem"
                                >
                                    <Box
                                        px="8px"
                                        py="1.25px"
                                        bg="rgba(16, 16, 19, 0.95)"
                                        // bg="linear-gradient(180deg, rgba(64, 68, 83, 0.56) 45%, rgba(28, 28, 32, 0.85)0%)"
                                        border="0.1rem solid"
                                        // borderColor="rgba(240, 13, 13, 0.99))"
                                        borderColor={
                                            getGameTypeString(gameMode) ===
                                            "NL HOLD'EM"
                                                ? 'rgba(199, 127, 221, 0.97)'
                                                : 'rgba(100,140,255,0.9)'
                                        }
                                        // boxShadow="0px 0px 1px 0px rgba(255, 255, 255, 0.15)"
                                        borderRadius="0.5rem"
                                    >
                                        <Text
                                            color="rgba(255, 255, 255, 0.85)"
                                            fontWeight="700"
                                            fontSize="0.825rem"
                                        >
                                            {formatBlindsShort(
                                                smallBlind,
                                                bigBlind,
                                            )}
                                        </Text>
                                    </Box>
                                    <Box
                                        as="span"
                                        fontWeight="semibold"
                                        color="brand.accentWhite"
                                        borderWidth="0.5px"
                                        borderStyle="solid"
                                        borderTopColor={chipTopColor}
                                        borderRightColor={chipSideColor}
                                        borderBottomColor={chipSideColor}
                                        borderLeftColor={chipSideColor}
                                        borderRadius="0.55rem"
                                        px="7px"
                                        py="2.5px"
                                        // bg="rgba(16, 21, 21, 0.52)"
                                    >
                                        <Text
                                            color={statusColor}
                                            fontWeight={600}
                                            fontSize="0.7rem"
                                        >
                                            {statusLabel}
                                        </Text>
                                    </Box>
                                </HStack>
                            </VStack>
                        ) : (
                            <HStack align="center">
                                <Text
                                    fontSize="1.125rem"
                                    fontWeight="800"
                                    textAlign="left"
                                    display="flex"
                                    alignItems="center"
                                    color={
                                        getGameTypeString(gameMode) ===
                                        "NL HOLD'EM"
                                            ? 'rgba(223, 165, 238, 0.9)'
                                            : 'blue.300'
                                    }
                                >
                                    {getGameTypeString(gameMode) ===
                                        "NL HOLD'EM" && (
                                        <Box
                                            mr="8px"
                                            border="2px solid"
                                            borderColor="rgba(200,100,220,0.8)"
                                            borderRadius="full"
                                            w="32px"
                                            h="32px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <img
                                                src="/HoldemIcon.png"
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                }}
                                            />
                                        </Box>
                                    )}
                                    {getGameTypeString(gameMode) ===
                                        'POT-LIMIT OMAHA' && (
                                        <Box
                                            mr="8px"
                                            border="2px solid"
                                            borderColor="rgba(100,140,255,0.9)"
                                            borderRadius="full"
                                            w="32px"
                                            h="32px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <GiPokerHand
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    color: 'white',
                                                }}
                                            />
                                        </Box>
                                    )}
                                    {getGameTypeString(gameMode) ===
                                    "NL HOLD'EM"
                                        ? 'NO-LIMIT HOLDEM'
                                        : getGameTypeString(gameMode)}{' '}
                                    <Box
                                        ml="8px"
                                        px="8px"
                                        py="1.25px"
                                        bg="linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0) 100%)"
                                        border="0.5px solid"
                                        borderColor={
                                            getGameTypeString(gameMode) ===
                                            "NL HOLD'EM"
                                                ? 'rgba(200,100,220,0.8)'
                                                : 'rgba(100,140,255,0.9)'
                                        }
                                        borderRadius="0.65rem"
                                    >
                                        <Text
                                            color="rgba(255, 255, 255, 0.85)"
                                            fontWeight="700"
                                            fontSize="0.8rem"
                                        >
                                            {formatBlindsShort(
                                                smallBlind,
                                                bigBlind,
                                            )}
                                        </Text>
                                    </Box>
                                </Text>
                                <HStack ml={1}>
                                    <Box
                                        as="span"
                                        fontWeight="semibold"
                                        color="brand.accentWhite"
                                        borderWidth="0.5px"
                                        borderStyle="solid"
                                        borderTopColor={chipTopColor}
                                        borderRightColor={chipSideColor}
                                        borderBottomColor={chipSideColor}
                                        borderLeftColor={chipSideColor}
                                        borderRadius="0.65rem"
                                        px="7px"
                                        py="2.5px"
                                        bg="brand.primaryGray"
                                    >
                                        <Text
                                            color={statusColor}
                                            fontWeight={600}
                                            fontSize="0.7rem"
                                        >
                                            {statusLabel}
                                        </Text>
                                    </Box>
                                </HStack>
                            </HStack>
                        )}
                    </VStack>
                    {!isOtherUser && (
                        <HStack>
                            {!gameData?.archived ? (
                                <Button
                                    onClick={handleRejoinGame}
                                    variant="walletButton"
                                    textColor="brand.accentWhite"
                                    fontSize="12px"
                                    borderRadius="8px"
                                    width={isPortrait ? '36px' : '70px'}
                                    height="32px"
                                    px={2}
                                    py={1}
                                    boxShadow="2px 2px 3px 0px rgba(0, 0, 0, 0.50)"
                                >
                                    {isPortrait ? (
                                        <FaPlay size={16} />
                                    ) : (
                                        <>
                                            Rejoin{' '}
                                            <FaPlay
                                                size={10}
                                                style={{ marginLeft: '6px' }}
                                            />
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <>
                                    {isCompleted && (
                                        <LogGameButton
                                            onClick={onLogOpen}
                                            isPortrait={isPortrait}
                                            nonce={nonce}
                                            px={2}
                                            py={1}
                                            fontSize="12px"
                                        />
                                    )}
                                    <ShareGameButton
                                        onClick={() =>
                                            handleShareClick(
                                                game.game_id,
                                                game,
                                                user,
                                                smallBlind,
                                                bigBlind,
                                                setImageUrl,
                                                onOpen,
                                            )
                                        }
                                        isPortrait={isPortrait}
                                        px={2}
                                        py={1}
                                        fontSize="12px"
                                    />
                                    <ShareGameModal
                                        isOpen={isOpen}
                                        onClose={() => {
                                            onClose();
                                            setImageUrl(null);
                                        }}
                                        imageUrl={imageUrl}
                                        gameData={{
                                            gameId: game.game_id,
                                            username: user?.username || '',
                                            blinds: formatBlindsWithSymbol(
                                                smallBlind,
                                                bigBlind,
                                            ),
                                            buyIn: `$${convertCurrencyToDisplay(game.buy_in)}`,
                                            cashOut: `$${convertCurrencyToDisplay(game.cashout)}`,
                                            pnl: convertPNLCurrencyToDisplay(
                                                game.buy_in,
                                                game.cashout,
                                            ),
                                        }}
                                    />
                                </>
                            )}
                        </HStack>
                    )}
                </HStack>
                <HStack justify="space-between" width="100%">
                    <HStack>
                        <Box
                            as="button"
                            onClick={() => {
                                navigator.clipboard
                                    .writeText(game.game_id)
                                    .then(() => {
                                        toast({
                                            title: 'Copied to clipboard',
                                            description:
                                                'Game ID copied to clipboard',
                                            status: 'success',
                                            duration: 3000,
                                            isClosable: true,
                                        });
                                    });
                            }}
                            cursor="pointer"
                            _hover={{ opacity: 0.8 }}
                        ></Box>
                    </HStack>
                </HStack>
            </VStack>

            {/* Log Modal */}
            <LogGameModal
                isOpen={isLogOpen}
                onClose={onLogClose}
                gameId={game.game_id}
            />
        </>
    );
};
