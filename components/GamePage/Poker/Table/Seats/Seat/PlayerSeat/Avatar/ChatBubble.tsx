import { Box, Fade, useBreakpointValue } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';

import { useGetPlayerUIPosition } from '../../../../../../../hooks/useGetPlayerUIPositions';
import { Player } from '../../../../../../../../client';
import { getPosition, PlayerPosition } from './sharedPositioning';
import useGameId from '../../../../../../../hooks/useGameID';
import { useWSQuery } from '../../../../../../../websocket/hooks/useWSQuery';
import { WebsocketsQueries } from '../../../../../../../../../../packages/shared/websockets.events';

// Temporary minimal type for testing; replace with actual Player when re-enabling live chat
// type PlayerLike = { player_id: string };

const landscapeStyles: Record<PlayerPosition, Record<string, string>> = {
    topLeft: { left: '0.5vmin', bottom: '5.75vmin' },
    topRight: { left: '1.5vmin', bottom: '5.75vmin' },
    upperLeft: { left: '0.5vmin', bottom: '5.75vmin' },
    upperRight: { left: '1.5vmin', bottom: '5.75vmin' },
    left: { left: '-0.5vmin', bottom: '6vmin' },
    right: { left: '2.5vmin', bottom: '6.25vmin' },
    bottomLeft: { left: '0vmin', bottom: '4.6vmin' },
    bottom: { left: '0vmin', bottom: '4.6vmin' },
    bottomRight: { left: '0.5vmin', bottom: '4.6vmin' },
};

const portraitStyles: Record<PlayerPosition, Record<string, string>> = {
    topLeft: { left: '2.25vmax', bottom: '4vmax' },
    topRight: { left: '1vmax', bottom: '4vmax' },
    upperLeft: { left: '2.25vmax', bottom: '4vmax' },
    upperRight: { left: '1vmax', bottom: '4vmax' },
    left: { left: '2.25vmax', bottom: '3.5vmax' },
    bottomLeft: { left: '1.85vmax', bottom: '3.5vmax' },
    right: { left: '1.85vmax', bottom: '3.5vmax' },
    bottomRight: { left: '1.85vmax', bottom: '3.5vmax' },
    bottom: { left: '1.85vmax', bottom: '3.25vmax' },
};

interface ChatBubbleProps {
    player: Player;
    // player: PlayerLike;
}

export const ChatBubble = ({ player }: ChatBubbleProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const currentPlayerPosition = useGetPlayerUIPosition(player?.player_id);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const position = getPosition(currentPlayerPosition);
    const styles = isPortrait ? portraitStyles : landscapeStyles;
    const gameId = useGameId();

    const { data: messages = [] } = useWSQuery<any[]>(
        WebsocketsQueries.getChat,
        {
            gameId,
        },
    );

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // // TEMP: Force a fixed test message for 5 minutes for all players (disabled)
    // useEffect(() => {
    //     setCurrentMessage('abc abc 123 123 123');
    //     setIsVisible(true);
    //
    //     if (timeoutRef.current) clearTimeout(timeoutRef.current);
    //     timeoutRef.current = setTimeout(() => {
    //         setIsVisible(false);
    //         setCurrentMessage('');
    //     }, 5 * 60 * 1000); // 5 minutes
    //
    //     return () => {
    //         if (timeoutRef.current) clearTimeout(timeoutRef.current);
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [player.player_id]);

    // ORIGINAL LIVE CHAT LOGIC (re-enabled)
    useEffect(() => {
        if (messages.length > 0) {
            const currentTime = Math.floor(Date.now());
            const recentMessages = messages
                .filter((msg) => {
                    const timeDiff = currentTime - new Date(msg.createdAt).getTime();
                    return (
                        msg.senderId === player.player_id && timeDiff <= 5000
                    );
                })
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            const latestPlayerMessage = recentMessages[0];

            if (latestPlayerMessage) {
                setCurrentMessage(latestPlayerMessage.message);
                setIsVisible(true);

                if (timeoutRef.current) clearTimeout(timeoutRef.current);

                const msgTimestamp = new Date(latestPlayerMessage.createdAt).getTime();
                const timeDiff = currentTime - msgTimestamp;
                const timeoutDuration = Math.max(0, 5000 - timeDiff);

                timeoutRef.current = setTimeout(() => {
                    setIsVisible(false);
                    setCurrentMessage('');
                }, timeoutDuration);
            } else {
                setIsVisible(false);
                setCurrentMessage('');
            }
        } else {
            setIsVisible(false);
            setCurrentMessage('');
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [messages, player.player_id]);

    const bubbleBgCenter = 'rgba(5, 131, 137, 0.94)';
    const bubbleBgMid = 'rgba(0, 151, 159, 0.92)';
    const bubbleBgEdge = 'rgb(1, 125, 132)';
    const bubbleGradient = `radial-gradient(circle at 50% 50%, ${bubbleBgCenter} 0%, ${bubbleBgMid} 60%, ${bubbleBgEdge} 100%)`;
    const bubbleTailBg = 'rgba(6, 143, 150, 0.9)';

    return (
        <Fade in={isVisible} unmountOnExit={true}>
            <Box
                bg={bubbleGradient}
                borderRadius="0.5rem"
                color="white"
                fontSize={isPortrait ? '1.25vmax' : '1.3vmin'}
                fontWeight="600"
                maxH="3.2rem"
                maxW="9.5rem"
                minW="3rem"
                w="fit-content"
                overflow="visible"
                p={2}
                position="absolute"
                lineHeight="1.2"
                zIndex={1002}
                {...styles[position as keyof typeof styles]}
                _after={{
                    content: '""',
                    position: 'absolute',
                    left: '0.25vmin',
                    bottom: '-0.6vmin',
                    transform: 'translate(-50%, 50%) rotate(43.5deg)',
                    transformOrigin: '100% 50%',
                    borderWidth: '18px 18px 12px 28px',
                    borderStyle: 'solid',
                    borderColor: `${'transparent'} ${bubbleTailBg} ${'transparent'} ${'transparent'}`,
                    zIndex: 0,
                }}
            >
                <Box
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    letterSpacing="-0.01em"
                    maxH="3.2rem"
                    maxW="9.5rem"
                    position="relative"
                    zIndex={1}
                >
                    {currentMessage}
                </Box>
            </Box>
        </Fade>
    );
};

export default ChatBubble;
