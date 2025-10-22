import { Text, Box, HStack, Image } from '@chakra-ui/react';
import React from 'react';

import { HandName, LogType } from '../../../../../client';
import { formatMoneyStringWithCommas } from '../../../../utils/formatMoney';
import { truncated } from '../../../../utils/getPlayerInfo';
import { stringToHSLColor } from '../../../../utils/chatUtils';
import { usePlayerUsername } from '../../../../hooks/usePlayerUsername';
import useUser from '../../../../hooks/useUser';
import { handNameToText } from '../../../../utils/handNameToText';
import { GameLogDto } from '../../../../../../../packages/shared/shared.types';

export const Message = ({ message }: { message: any }) => {
    
    const { user } = useUser(message.senderId);
    const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });

    const timeDisplay = timestamp;
    const messageDisplay =
        typeof message.message === 'string' ? message.message : '';

    return (
        <Box
            // bg="brand.modalGray"
            // bg="brand.gray45"
            borderRadius="1.1rem"
            paddingX="0.4rem"
            paddingY="0.4rem"
            fontSize="0.84rem"
        >
            <HStack spacing={2} align="center">
                <Text textAlign="start" whiteSpace="pre-wrap" fontWeight="bold">
                    <Text as="span" color="rgb(118, 123, 130)" fontSize="0.735rem" letterSpacing="-0.16px" fontWeight="600">
                        {timeDisplay}
                    </Text>{' '}
                    <Text
                        as="span"
                        display="inline-flex"
                        alignItems="center"
                        sx={{ transform: 'translateY(2.25px)' }}
                    >
                        <Image
                            src={user?.imageUrl ?? undefined}
                            alt="User Avatar"
                            width="1rem"
                            height="1rem"
                            borderRadius="50%"
                            border="0.01rem solid"
                            borderColor="brand.gray40"
                            // borderColor="brand.accentWhite"
                        />
                    </Text>
                    <Text
                        as="span"
                        color={stringToHSLColor(user?.username ?? '')}
                        fontSize="0.84rem"
                    >
                        {' ' + truncated(user?.username ?? '')}
                    </Text>
                    {' ' + messageDisplay}
                </Text>
            </HStack>
        </Box>
    );
};

const faceCardToValue: { [key: string]: string } = {
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': '10',
    '11': 'J',
    '12': 'Q',
    '13': 'K',
    '14': 'A',
};

const suitToValue: { [key: string]: string } = {
    '0': '♥',
    '1': '♦',
    '2': '♣',
    '3': '♠',
};

const USER_LOG_TYPES = [
    LogType.CHECK,
    LogType.FOLD,
    LogType.CALL,
    LogType.BET,
    LogType.RAISE,
    LogType.ALL_IN,
    LogType.HOST_CHANGED,
    LogType.LEAVE,
    LogType.POST_SB,
    LogType.POST_BB,
    LogType.TIMEOUT,
    LogType.WIN,
    LogType.BOARD_WIN,
    LogType.RUN_WIN,
    LogType.UNCALLED_BET,
    LogType.SHOW_CARD,
    LogType.SHOW_CARDS,
    LogType.GAME_CREATED,
    LogType.STRADDLE,
    LogType.PLAYERS,
];

export const LogMessage = ({
    log,
    showSeconds = false,
}: {
    log: GameLogDto;
    showSeconds?: boolean;
}) => {
    let args = log.args;

    if (log.logType === LogType.HAND_END) {
        return null;
    }

    if (log.logType === LogType.WIN && args.length === 1 && typeof args[0] === 'string' && args[0].startsWith('[')) {
        try {
            args = JSON.parse(args[0]);
        } catch (e) {
            console.error("Failed to parse stringified log args", e);
        }
    }


    if (USER_LOG_TYPES.includes(log.logType)) {
        const username = usePlayerUsername(args[0] || '') || '';
        args = [username, ...args.slice(1)]; 
    }

    const logMessageFunction = LOG_ACTION_TO_USER_MESSAGE[log.logType];
    const logMessage = logMessageFunction ? (
        logMessageFunction(args)
    ) : (
        <Text color="red">Unknown log type</Text>
    );

    const shouldHideTimestamp = [
        LogType.FLOP,
        LogType.TURN,
        LogType.RIVER,
    ].includes(log.logType);

    return (
        <HStack width="100%" align="center" paddingX="0.25rem">
            <Text fontSize="0.75rem" color={shouldHideTimestamp ? "transparent" : "brand.gray10"}>
                {new Date(log.createdAt).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    ...(showSeconds ? { second: '2-digit' } : {}),
                })}
            </Text>
            <Text
                fontSize="0.75rem"
                color={LOG_ACTION_TO_COLOR[log.logType] || 'gray.400'}
                overflowWrap="break-word"
                wordBreak="break-word"
            >
                {logMessage}
            </Text>
        </HStack>
    );
};


const LOG_ACTION_TO_COLOR: Record<number, string> = {
    [LogType.CHECK]: 'yellow.300',
    [LogType.FOLD]: 'red.300',
    [LogType.CALL]: 'yellow.300',
    [LogType.POST_SB]: 'gray.300',
    [LogType.POST_BB]: 'gray.300',
    [LogType.POST_BOMB_POT]: 'gray.300',
    [LogType.POST_ANTE]: 'gray.300',
    [LogType.STRADDLE]: 'gray.300',
    [LogType.TIMEOUT]: 'brand.white50',
    [LogType.WIN]: 'green.400',
    [LogType.BOARD_WIN]: 'green.400',
    [LogType.RUN_WIN]: 'green.400',
    [LogType.RAISE]: 'blue.300',
    [LogType.BET]: 'blue.300',
    [LogType.HAND_START]: 'brand.white60',
    [LogType.HAND_END]: 'brand.white60',
    [LogType.UNCALLED_BET]: 'gray.400',
    [LogType.BOMB_POT]: 'purple.200',
    [LogType.FLOP]: 'gray.200',
    [LogType.TURN]: 'gray.200',
    [LogType.RIVER]: 'gray.200',
    [LogType.ALL_IN]: 'blue.300',
};

const LOG_ACTION_TO_USER_MESSAGE: Record<
    number,
    (args: string[]) => React.ReactElement
> = {
    [LogType.PLAYERS]: (args) => {
        // args: [username, index, amount, is_dealer, is_small_blind, is_big_blind]
        const labels = [];
        if (args[3]) labels.push('Dealer');
        if (args[4]) labels.push('SB');
        if (args[5]) labels.push('BB');
        return (
            <>
                <b>
                    {' '}
                    {args[1]} {args[0]}{' '}
                    <b>${(parseFloat(args[2]) / 1000000).toFixed(2)}</b>{' '}
                    {labels.length > 0 ? labels.join(' / ') : ''}{' '}
                </b>
            </>
        );
    },
    [LogType.CHECK]: (args) => (
        <>
            <b> {args[0]}</b> checks
        </>
    ),
    [LogType.FOLD]: (args) => (
        <>
            <b> {args[0]}</b> folds
        </>
    ),
    [LogType.CALL]: (args) => (
        <>
            <b> {args[0]}</b> calls{' '}
            <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.BET]: (args) => (
        <>
            <b> {args[0]}</b> bets{' '}
            <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.RAISE]: (args) => (
        <>
            <b> {args[0]}</b> raises to{' '}
            <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.ALL_IN]: (args) => (
        <>
            <b> {args[0]}</b> goes all-in for{' '}
            <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.HOST_CHANGED]: (args) => (
        <>
            <b> {args[0]}</b> becomes the host
        </>
    ),
    [LogType.LEAVE]: (args) => (
        <>
            <b> {args[0]}</b> left the game
        </>
    ),
    [LogType.WIN]: (args) => {
        let handText = '';
        let showHandDetail = true;
        if (args[2] !== undefined && args[2] !== null && args[2] !== '') {
            const handNameNum = parseInt(args[2], 10);
            handText = handNameToText[handNameNum as HandName] || args[2];
            if (handNameNum === 1) {
                // 1 = LAST_PLAYER_STANDING
                showHandDetail = false;
            }
        }
        const handDetail = args[3] && args[3] !== '' ? args[3] : '';
        return (
            <>
                <b> {args[0]}</b> wins{' '}
                <b>
                    $
                    {formatMoneyStringWithCommas(
                        (parseFloat(args[1]) / 1000000).toFixed(2),
                    )}
                </b>
                {(handText || handDetail) && (
                    <>
                        {' '}
                        ({handText}
                        {showHandDetail && handDetail ? `, ${handDetail}` : ''})
                    </>
                )}
            </>
        );
    },
    [LogType.BOARD_WIN]: (args) => {
        const handArg = args[2]?.toString() ?? '';
        const [handCodeStr, ...detailParts] = handArg.split(' ');
        const handCode = parseInt(handCodeStr, 10);
        const handText = isNaN(handCode)
            ? handArg
            : handNameToText[handCode as HandName];
        const detailsText = detailParts.join(' ').trim();
        return (
            <>
                <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="green.600"
                    color="white"
                    borderRadius="0.3rem"
                    w="1.25rem"
                    h="1rem"
                    fontSize="0.65rem"
                    fontWeight="700"
                    mr="0.2rem"
                >
                    {'B' + args[1].toString()}
                </Box>
                <b> {args[0]}</b> wins{' '}
                <b>
                    ({handText}
                    {detailsText ? ', ' + detailsText : ''})
                </b>
            </>
        );
    },
    [LogType.RUN_WIN]: (args) => {
        const handArg = args[2]?.toString() ?? '';
        const [handCodeStr, ...detailParts] = handArg.split(' ');
        const handCode = parseInt(handCodeStr, 10);
        const handText = isNaN(handCode)
            ? handArg
            : handNameToText[handCode as HandName];
        const detailsText = detailParts.join(' ').trim();
        return (
            <>
                <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="green.600"
                    color="white"
                    borderRadius="0.3rem"
                    w="1.25rem"
                    h="1rem"
                    fontSize="0.65rem"
                    fontWeight="700"
                    mr="0.2rem"
                >
                    {'R' + args[1].toString()}
                </Box>
                <b> {truncated(args[0])}</b> wins{' '}
                <b>
                    ({handText}
                    {detailsText ? ', ' + detailsText : ''})
                </b>
            </>
        );
    },
    [LogType.TURN_START]: function (
        args: string[],
    ): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
        throw new Error('Function not implemented.');
    },
    [LogType.TIMEOUT]: (args) => (
        <>
            <b> {args[0]}</b> timed out
        </>
    ),
    [LogType.GAME_CREATED]: (args) => (
        <>
            <b> {args[0]}</b> created the game
        </>
    ),
    [LogType.BOMB_POT]: (args) => {
        return (
            <>
                <b>BOMB POT [{args[0]} BB]</b>
            </>
        );
    },
    [LogType.POST_BOMB_POT]: (args) => {
        return (
            <>
                All players post a{' '}
                <b>${(parseFloat(args[0]) / 1000000).toFixed(2)}</b> bomb pot
                ante
            </>
        );
    },
    [LogType.POST_ANTE]: (args) => {
        return (
            <>
                All players post a{' '}
                <b>${(parseFloat(args[0]) / 1000000).toFixed(2)}</b> ante
            </>
        );
    },
    [LogType.FLOP]: (args) => {
        const renderCard = (cardStr: string) => {
            const face = cardStr.slice(0, -1);
            const suit = cardStr.slice(-1);
            const isRed = suit === '♥' || suit === '♦';
            return (
                <Box
                    key={cardStr}
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="whiteAlpha.900"
                    border="1px solid"
                    borderColor="whiteAlpha.600"
                    borderRadius="0.2rem"
                    px="0.2rem"
                    py="0.15rem"
                    mx="0.05rem"
                    w="1.8rem"
                    h="1.2rem"
                    fontSize="0.75rem"
                    fontWeight="600"
                >
                    <Text
                        as="span"
                        color={isRed ? 'red.500' : 'black'}
                        fontWeight="800"
                    >
                        {face}
                    </Text>
                    <Text
                        as="span"
                        color={isRed ? 'red.500' : 'black'}
                        fontSize="0.85rem"
                        ml="1px"
                    >
                        {suit}
                    </Text>
                </Box>
            );
        };

        // Check if this is likely a double board scenario (6 cards for FLOP - 3 per board)
        const isDoubleBoard = args.length === 6;

        if (isDoubleBoard) {
            const firstBoard = args.slice(0, 3);
            const secondBoard = args.slice(3, 6);

            return (
                <Box textAlign="left">
                    <Text as="span" fontWeight="bold">
                        FLOP
                    </Text>
                    <Box
                        mt={1}
                        display="flex"
                        flexWrap="wrap"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                    >
                        {firstBoard.map((card) => renderCard(card))}
                    </Box>
                    <Box
                        mt={1}
                        display="flex"
                        flexWrap="wrap"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                    >
                        {secondBoard.map((card) => renderCard(card))}
                    </Box>
                </Box>
            );
        }

        return (
            <Box textAlign="left">
                <Text as="span" fontWeight="bold">
                    FLOP
                </Text>
                <Box
                    mt={1}
                    display="flex"
                    flexWrap="wrap"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                >
                    {args.slice(0, 3).map((card) => renderCard(card))}
                </Box>
            </Box>
        );
    },
    [LogType.TURN]: (args) => {
        const renderCard = (cardStr: string) => {
            const face = cardStr?.slice(0, -1);
            const suit = cardStr?.slice(-1);
            const isRed = suit === '♥' || suit === '♦';
            return (
                <Box
                    key={cardStr}
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="whiteAlpha.900"
                    border="1px solid"
                    borderColor="whiteAlpha.600"
                    borderRadius="0.2rem"
                    px="0.2rem"
                    py="0.15rem"
                    mx="0.05rem"
                    w="1.8rem"
                    h="1.2rem"
                    fontSize="0.75rem"
                    fontWeight="600"
                >
                    <Text
                        as="span"
                        color={isRed ? 'red.500' : 'black'}
                        fontWeight="800"
                    >
                        {face}
                    </Text>
                    <Text
                        as="span"
                        color={isRed ? 'red.500' : 'black'}
                        fontSize="0.85rem"
                        ml="1px"
                    >
                        {suit}
                    </Text>
                </Box>
            );
        };

        // Check if this is likely a double board scenario (8 cards for TURN - 4 per board)
        const isDoubleBoard = args.length === 8;

        if (isDoubleBoard) {
            const firstBoard = args.slice(0, 4);
            const secondBoard = args.slice(4, 8);

            return (
                <Box textAlign="left">
                    <Text as="span" fontWeight="bold">
                        TURN
                    </Text>
                    <Box
                        mt={1}
                        display="flex"
                        flexWrap="wrap"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                    >
                        {firstBoard.slice(0, 3).map((card) => renderCard(card))}
                        <Box mx="0.3rem" />
                        {renderCard(firstBoard[3])}
                    </Box>
                    <Box
                        mt={1}
                        display="flex"
                        flexWrap="wrap"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                    >
                        {secondBoard
                            .slice(0, 3)
                            .map((card) => renderCard(card))}
                        <Box mx="0.3rem" />
                        {renderCard(secondBoard[3])}
                    </Box>
                </Box>
            );
        }

        return (
            <Box textAlign="left">
                <Text as="span" fontWeight="bold">
                    TURN
                </Text>
                <Box
                    mt={1}
                    display="flex"
                    flexWrap="wrap"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                >
                    {args.slice(0, 3).map((card) => renderCard(card))}
                    <Box mx="0.3rem" />
                    {renderCard(args[3])}
                </Box>
            </Box>
        );
    },
    [LogType.RIVER]: (args) => {
        const renderCard = (cardStr: string) => {
            const face = cardStr?.slice(0, -1);
            const suit = cardStr?.slice(-1);
            const isRed = suit === '♥' || suit === '♦';
            return (
                <Box
                    key={cardStr}
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="whiteAlpha.900"
                    border="1px solid"
                    borderColor="whiteAlpha.600"
                    borderRadius="0.2rem"
                    px="0.2rem"
                    py="0.15rem"
                    mx="0.05rem"
                    w="1.8rem"
                    h="1.2rem"
                    fontSize="0.75rem"
                    fontWeight="600"
                >
                    <Text
                        as="span"
                        color={isRed ? 'red.500' : 'black'}
                        fontWeight="800"
                    >
                        {face}
                    </Text>
                    <Text
                        as="span"
                        color={isRed ? 'red.500' : 'black'}
                        fontSize="0.85rem"
                        ml="1px"
                    >
                        {suit}
                    </Text>
                </Box>
            );
        };

        // Check if this is likely a double board scenario (10 cards for RIVER - 5 per board)
        const isDoubleBoard = args.length === 10;

        if (isDoubleBoard) {
            const firstBoard = args.slice(0, 5);
            const secondBoard = args.slice(5, 10);

            return (
                <Box textAlign="left">
                    <Text as="span" fontWeight="bold">
                        RIVER
                    </Text>
                    <Box
                        mt={1}
                        display="flex"
                        flexWrap="wrap"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                    >
                        {firstBoard.slice(0, 3).map((card) => renderCard(card))}
                        <Box mx="0.3rem" />
                        {renderCard(firstBoard[3])}
                        <Box mx="0.3rem" />
                        {renderCard(firstBoard[4])}
                    </Box>
                    <Box
                        mt={1}
                        display="flex"
                        flexWrap="wrap"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                    >
                        {secondBoard
                            .slice(0, 3)
                            .map((card) => renderCard(card))}
                        <Box mx="0.3rem" />
                        {renderCard(secondBoard[3])}
                        <Box mx="0.3rem" />
                        {renderCard(secondBoard[4])}
                    </Box>
                </Box>
            );
        }

        return (
            <Box textAlign="left">
                <Text as="span" fontWeight="bold">
                    RIVER
                </Text>
                <Box
                    mt={1}
                    display="flex"
                    flexWrap="wrap"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                >
                    {args.slice(0, 3).map((card) => renderCard(card))}
                    <Box mx="0.3rem" />
                    {renderCard(args[3])}
                    <Box mx="0.3rem" />
                    {renderCard(args[4])}
                </Box>
            </Box>
        );
    },
    [LogType.POST_SB]: (args) => (
        <>
            <b> {args[0]}</b> posts a small blind of{' '}
            <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.POST_BB]: (args) => (
        <>
            <b> {args[0]}</b> posts a big blind of{' '}
            <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.HAND_START]: (args) => (
        <>
            <b>--------- Starting Hand #{args[0]} ---------</b>
        </>
    ),
    [LogType.HAND_END]: (args) => (
        <>
            <b>--- Ending hand #{args[0]} ---</b>
        </>
    ),
    [LogType.STRADDLE]: (args) => (
        <>
            <b> {args[0]}</b> straddles{' '}
            <b>${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>
        </>
    ),
    [LogType.UNCALLED_BET]: (args) => (
        <>
            <b>Uncalled bet of ${(parseFloat(args[1]) / 1000000).toFixed(2)}</b>{' '}
            returned to <b>{args[0]}</b>
        </>
    ),
    [LogType.SHOW_CARD]: (args) => {
        const card = faceCardToValue[args[1]] + suitToValue[args[2]];
        return (
            <>
                <b> {args[0]}</b> shows {card}
            </>
        );
    },
    [LogType.SHOW_CARDS]: (args) => (
        <>
            <b> {args[0]}</b> shows <b>{args.slice(1).join(' ')}</b>
        </>
    ),
};

export default Message;
