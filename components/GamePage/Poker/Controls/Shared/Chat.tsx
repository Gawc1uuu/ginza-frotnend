import { Flex, Box } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { useScrollToBottom } from './useScrollToBottom';

import Message, { LogMessage } from './Message';
import { ChatInput } from './ChatInput';
import useGameId from '../../../../hooks/useGameID';
import { LogType } from '../../../../../client';
import { useWSQuery } from '../../../../websocket/hooks/useWSQuery';
import { WebsocketsQueries } from '../../../../../../../packages/shared/websockets.events';

interface ChatProps {
    showLogs: boolean;
    height?: string;
    tabIndex: number;
}

interface MessageListProps {
    messagesToDisplay: any[];
    showLogs: boolean;
    tabIndex: number;
    scrollRef: React.RefObject<HTMLDivElement>;
}

interface RowProps {
    index: number;
    style: React.CSSProperties;
    data: {
        messagesToDisplay: any[];
        showLogs: boolean;
        getItemSize: (index: number) => number;
        setItemSize: (index: number, size: number) => void;
    };
}

const Row: React.FC<RowProps> = ({ index, style, data }) => {
    const { messagesToDisplay, showLogs, getItemSize, setItemSize } = data;
    const msg = messagesToDisplay[index];

    // Create a ref to measure the content
    const measureRef = useRef<HTMLDivElement>(null);

    // Effect to measure the height after rendering
    useEffect(() => {
        if (measureRef.current) {
            const height = measureRef.current.getBoundingClientRect().height;
            if (height !== getItemSize(index)) {
                setItemSize(index, height);
            }
        }
    }, [index, getItemSize, setItemSize, msg]);

    return (
        <div
            style={{
                ...style,
                // Add a minimum height to prevent overlap
                height: Math.max(
                    style.height as number,
                    getItemSize(index) + 2,
                ),
            }}
        >
            <div ref={measureRef}>
                <Box pl="3px" pr="0" paddingY="0.05rem">
                    {showLogs ? (
                        <LogMessage log={msg} />
                    ) : (
                        <Message message={msg} />
                    )}
                </Box>
            </div>
        </div>
    );
};

const MessageList: React.FC<MessageListProps> = ({
    messagesToDisplay,
    showLogs,
    tabIndex,
    scrollRef,
}) => {
    const listRef = useRef<List>(null);
    const sizeMap = useRef<Record<number, number>>({});

    const getItemSize = (index: number) => {
        return sizeMap.current[index] || 30; // Slightly larger default size
    };

    const setItemSize = (index: number, size: number) => {
        // Add a small buffer to the size to ensure spacing
        const sizeWithBuffer = size + 2;
        sizeMap.current[index] = sizeWithBuffer;
        if (listRef.current) {
            listRef.current.resetAfterIndex(index);
        }
    };

    // Clear size cache when tab changes to force remeasuring
    useEffect(() => {
        sizeMap.current = {};
        if (listRef.current) {
            listRef.current.resetAfterIndex(0);
        }
    }, [tabIndex, showLogs]);

    // Also reset when message list changes length
    useEffect(() => {
        if (listRef.current) {
            listRef.current.resetAfterIndex(0);
        }
    }, [messagesToDisplay.length]);

    const itemData = {
        messagesToDisplay,
        showLogs,
        getItemSize,
        setItemSize,
        tabIndex,
    };

    useEffect(() => {
        requestAnimationFrame(() => {
            const listElement = scrollRef.current;
            if (listElement) {
                const isNearBottom =
                    listElement.scrollHeight -
                        listElement.scrollTop -
                        listElement.clientHeight <
                    150;
                const isAtTop = listElement.scrollTop === 0;
                if (isNearBottom || isAtTop) {
                    listRef.current?.scrollToItem(
                        messagesToDisplay.length - 1,
                        'end',
                    );
                }
            }
        });
    }, [tabIndex, messagesToDisplay]);

    return (
        <Flex
            direction="column"
            // bg="brand.gray50"
            // bg="brand.primaryGray"
            // bg="brand.chatGray"
            // bg="rgba(62, 65, 68, 0.28)"
            // bg="brand.darkerBlueGray"
            // bg="rgba(44, 44, 42, 0.27)"
            bg="brand.modalGray"
            // bgGradient="linear(to-b, brand.modalBackground, brand.modalBackgroundAlpha)"
            // bg="rgba(1, 1, 2, 0.35)"
            // bgGradient="linear(to-r, rgba(54, 54, 56, 0.22) 0%, rgba(43, 45, 47, 0.28) 33%, rgba(56, 58, 60, 0.28) 100%)"
            id="chat-scroll-container"
            w="100%"
            h="100%"
            flex="1"
            overflow="hidden"
            align="start"
            ref={scrollRef}
            border="1px solid"
            borderColor="rgba(54, 54, 54, 0.67)"
            boxShadow="0 0 0.4rem -0.25rem rgba(80, 91, 88, 085)"
            borderRadius="0.5rem"
            position="relative"
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: -0.25,
                right: -1.5,
                bottom: 0,
                borderRadius: 'inherit',
                pointerEvents: 'none',
                zIndex: 1,
                backgroundRepeat: 'no-repeat',
                backgroundImage:
                    'linear-gradient(180deg, rgba(1, 2, 6, 0.65) 15%, rgba(14, 15, 18, 0.5) 35%, rgba(81, 107, 158, 0) 100%), linear-gradient(180deg, rgba(100, 108, 121, 0.26) 0%, rgba(190, 200, 215, 0.14) 45%, rgba(8, 10, 14, 0.35) 100%), linear-gradient(270deg, rgba(5, 6, 8, 0.30) 0%, rgba(5, 6, 8, 0.0) 100%)',
                backgroundSize: '100% 12px, 1.25px 100%, 1.25px 100%',
                backgroundPosition: 'top left, top left, top right',
            }}
            _after={{
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '4px',
                borderBottomLeftRadius: 'inherit',
                borderBottomRightRadius: 'inherit',
                background:
                    'linear-gradient(0deg, rgba(196, 213, 243, 0.2) 0%, rgba(205, 214, 230, 0.0) 100%)',
                boxShadow:
                    'inset -0.5px 0.1px rgba(255, 255, 255, 0.15), inset 0 -10px 10px rgba(12, 14, 16, 0.5)',
                pointerEvents: 'none',
                zIndex: 1,
            }}
        >
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        ref={listRef}
                        outerRef={scrollRef}
                        width={width}
                        height={height}
                        itemCount={messagesToDisplay.length}
                        itemSize={getItemSize}
                        itemData={itemData}
                        overscanCount={10} // Increased overscan for better performance
                        style={{ paddingBottom: '4px' }} // Add padding at bottom of list
                    >
                        {Row}
                    </List>
                )}
            </AutoSizer>
        </Flex>
    );
};

export const Chat = (props: ChatProps) => {
    const { showLogs, height = '100%', tabIndex } = props;
    const { scrollRef } = useScrollToBottom();
    const gameId = useGameId();

    const { data: chatMessages = [] } = useWSQuery<any[]>(
        WebsocketsQueries.getChat,
        {
            gameId,
        },
        !showLogs,
    );

    const { data: gameLogMessages = [] } = useWSQuery<any[]>(
        WebsocketsQueries.getGameLogs,
        {
            gameId,
        },
        showLogs,
    );

    const messagesToDisplay = showLogs
        ? [...gameLogMessages].reverse().filter((log) => log?.logType !== LogType.PLAYERS && log !== null)
        : chatMessages;

    return (
        <Flex direction="column" h={height}>
            <MessageList
                key={tabIndex} // Add key prop to force remount on tabIndex change
                messagesToDisplay={messagesToDisplay}
                showLogs={showLogs}
                scrollRef={scrollRef}
                tabIndex={tabIndex}
            />
            {!showLogs && (
                <Box w="100%" mt="0.5rem" h="2.25rem" mb="0.25rem">
                    <ChatInput gameId={gameId} />
                </Box>
            )}
        </Flex>
    );
};

export default Chat;
