import {
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    IconButton,
    Box,
} from '@chakra-ui/react';

import { Chat } from '../../Shared/Chat';

import useChatPanel from './useChatPanel';
import { FaChevronUp } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';

export const ChatPanel = ({
    isOpen,
    onOpen,
    onClose,
}: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}) => {
    const { tabIndex, setTabIndex, chatTabText, logTabText } = useChatPanel();

    const chatExpansionIcon = isOpen ? <FaChevronDown /> : <FaChevronUp />;

    const frameBorderColor = 'rgba(210, 220, 235, 0.12)';
    const bottomMatch = 'var(--chakra-colors-brand-gray55)';

    return (
        <Tabs
            position="absolute"
            variant="chat"
            index={tabIndex}
            onChange={(index) => setTabIndex(index)}
            w="23.65vw"
            h={isOpen ? '250%' : '100%'}
            top={isOpen ? '-150%' : '0'}
            isLazy
        >
            <TabList
                position="absolute"
                top="-2.24em"
                left="0.02rem"
                borderBottom="none"
            >
                <Tab
                    px="0.6rem"
                    py="0.6rem"
                    borderTopLeftRadius="0.4rem"
                    borderTopRightRadius="0.1rem"
                    bg="linear-gradient(15deg, rgba(14, 19, 24, 0.7) 1%, rgba(84, 85, 87, 0.7) 100%)"
                    color="brand.white60"
                    transition="all 160ms ease"
                    _hover={{ color: 'brand.white70' }}
                    position="relative"
                    _selected={{
                        color: 'rgb(200, 221, 249)',
                        bg: `linear-gradient(0deg, ${bottomMatch} 0%, ${bottomMatch} 75%, rgba(200, 214, 235, 0.30) 100%)`,
                        border: 'none',
                        borderBottom: 'none',
                        marginBottom: '-0.5px',
                        zIndex: 2,
                        _before: {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '28%',
                            borderTopLeftRadius: 'inherit',
                            borderTopRightRadius: 'inherit',
                            pointerEvents: 'none',
                        },
                    }}
                >
                    <Text fontSize="0.75rem" color="inherit" fontWeight={800}>
                        {chatTabText}
                    </Text>
                </Tab>
                <Tab
                    px="0.6rem"
                    py="0.6rem"
                    borderTopRightRadius="0.5rem"
                    bg="linear-gradient(50deg, rgba(41, 43, 45, 0.85) 20%, rgba(38, 39, 41, 0.7) 90%)"
                    color="brand.white60"
                    transition="all 160ms ease"
                    _hover={{ color: 'brand.white70' }}
                    position="relative"
                    _selected={{
                        color: 'green.100',
                        bg: `linear-gradient(0deg, ${bottomMatch} 0%, ${bottomMatch} 75%, rgba(200, 214, 235, 0.30) 100%)`,
                        border: 'none',
                        // borderBottom: 'none',
                        marginBottom: '-0.5px',
                        zIndex: 2,
                        _before: {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '28%',
                            borderTopLeftRadius: 'inherit',
                            // borderTopRightRadius: 'inherit',
                            pointerEvents: 'none',
                        },
                    }}
                >
                    <Text fontSize="0.75rem" color="inherit" fontWeight={800}>
                        {logTabText}
                    </Text>
                </Tab>
            </TabList>
            <IconButton
                background="linear-gradient(0deg, rgba(47, 51, 53, 0.75) 0%, rgba(65, 69, 74, 0.75) 100%)"
                position="absolute"
                aria-label="Expand chat"
                icon={chatExpansionIcon}
                right="0"
                top="-1.875rem"
                variant="chatButton"
                onClick={isOpen ? onClose : onOpen}
            />

            <Box
                h="100%"
                border={`1px solid ${frameBorderColor}`}
                borderRadius="0.25rem"
                overflow="hidden"
                boxShadow="0 0 1px 0.5px rgba(193, 195, 199, 0.1)"
            >
                <TabPanels h="100%">
                    <TabPanel
                        h="100%"
                        padding="8px"
                        bg="brand.primaryGray"
                        pb="16px"
                    >
                        <Chat showLogs={false} tabIndex={tabIndex} />
                    </TabPanel>
                    <TabPanel
                        h="100%"
                        bg="brand.primaryGray"
                        padding="8px"
                        borderTopRadius="0.25rem"
                    >
                        <Chat showLogs={true} tabIndex={tabIndex} />
                        <Box
                            position="absolute"
                            bottom="0.82rem"
                            left="0.75rem"
                        ></Box>
                    </TabPanel>
                </TabPanels>
            </Box>
        </Tabs>
    );
};

export default ChatPanel;
