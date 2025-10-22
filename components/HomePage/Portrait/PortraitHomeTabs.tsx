'use client';

import React from 'react';
import {
    Box,
    HStack,
    Text,
    Image,
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    useBreakpointValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HamburgerIcon, SettingsIcon } from '@chakra-ui/icons';
import { PokerIcon } from '../../Shared/PokerIcon';
import useViewer from '../../hooks/useViewer';
import { useState } from 'react';
import { UserPreferencesModal } from '../../Modals/UserPreferencesModal/UserPreferencesModal';
import { FaUserShield } from 'react-icons/fa';
import { Image as ChakraImage } from '@chakra-ui/react';

const TabContent = ({
    icon,
    text,
    isActive,
}: {
    icon?: React.ReactElement;
    text?: string;
    isActive: boolean;
}) => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={0}
        p={0}
        color={isActive ? 'white' : undefined}
        height="100%"
        position="relative"
    >
        {isActive && (
            <Box
                position="absolute"
                left={0}
                right={0}
                top={-4}
                height="1.5px"
                borderRadius="1px"
                bg="#FF4EDB"
                boxShadow="0 2px 20px 1.5px #FF4EDB, 0 0px 2px 1px #FF4EDB"
            />
        )}
        {icon}
        <Text
            mt="0.15rem"
            fontSize="sm"
            color={isActive ? 'whiteAlpha.900' : 'whiteAlpha.800'}
            textShadow={isActive ? '0 0 1px white' : undefined}
        >
            {text}
        </Text>
    </Box>
);

export function PortraitHomeTabs() {
    const pathname = usePathname();
    const router = useRouter();
    const [isPreferencesOpen, setPreferencesOpen] = useState(false);
    const [isHamburgerOpen, setHamburgerOpen] = useState(false);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    const tabData = [
        {
            icon: (
                <Image
                    src={undefined}
                    width="1.2rem"
                    height="1.2rem"
                    borderRadius="50%"
                    alt="User Avatar"
                    style={{ filter: undefined }} // will override below
                />
            ),
            text: 'Profile',
            path: `#`,
        },
        {
            icon: (
                <ChakraImage
                    src="/RewardsIcon.png"
                    alt="Rewards"
                    width="1.3rem"
                    height="1.3rem"
                    borderRadius="50%"
                    objectFit="contain"
                    style={{ filter: undefined }} // will override below
                />
            ),
            text: 'Rewards',
            path: '/rewards',
        },
        {
            icon: <PokerIcon color="inherit" />, // will override below
            text: 'Home',
            path: '/',
        },
    ] as const;

    return (
        <HStack
            width="100%"
            bg="brand.gray70"
            boxShadow="0 -2.5px 4px rgba(255, 255, 255, 0.5)"
            pt="0.9rem"
            pb="1.55rem"
            minHeight="4.5rem"
            justify="space-around"
            zIndex="100"
        >
            {tabData.map((tab, index) => {
                const isActive = pathname === tab.path;
                let icon = tab.icon;
                // For images, apply white filter if active
                if (tab.text === 'Rewards') {
                    // Wrap the icon in a span and apply style to the span
                    icon = (
                        <span
                            style={{
                                display: 'inline-block',
                                filter: isActive
                                    ? 'brightness(0) invert(1)'
                                    : undefined,
                                textShadow: isActive
                                    ? '0 0 16px white, 0 0 8px white, 0 0 2px white'
                                    : undefined,
                            }}
                        >
                            {tab.icon}
                        </span>
                    );
                }
                // For PokerIcon, pass color prop
                if (tab.text === 'Home') {
                    icon = (
                        <PokerIcon
                            color={
                                isActive ? 'whiteAlpha.900' : 'whiteAlpha.700'
                            }
                        />
                    );
                }
                // Change Menu to More (remove tabText logic, not needed)
                return (
                    <Link
                        key={`${tab.text}-${index}`}
                        href={tab.path}
                        style={{ textDecoration: 'none' }}
                    >
                        <TabContent
                            icon={icon}
                            text={tab.text}
                            isActive={isActive}
                        />
                    </Link>
                );
            })}
            <Box
                as="button"
                onClick={() => setPreferencesOpen(true)}
                background="none"
                border="none"
                p={0}
                m={0}
                display="flex"
                alignItems="center"
            >
                <TabContent
                    icon={
                        <SettingsIcon
                            boxSize="1.1rem"
                            color={false ? 'whiteAlpha.900' : 'whiteAlpha.700'}
                        />
                    }
                    text={'Settings'}
                    isActive={false}
                />
            </Box>
            <Box
                as="button"
                onClick={() => setHamburgerOpen(true)}
                background="none"
                border="none"
                p={0}
                m={0}
                display="flex"
                alignItems="center"
            >
                <TabContent
                    icon={
                        <HamburgerIcon
                            boxSize="1.3rem"
                            color="brand.accentWhite"
                        />
                    }
                    text={'More'}
                    isActive={false}
                />
            </Box>
            {isPortrait && (
                <Drawer
                    placement="bottom"
                    onClose={() => setHamburgerOpen(false)}
                    isOpen={isHamburgerOpen}
                    size="xs"
                >
                    <DrawerOverlay />
                    <DrawerContent
                        bg="brand.primaryGray"
                        border="1px solid"
                        borderColor="whiteAlpha.400"
                        borderRadius="0.5rem"
                        boxShadow="0px -2px 16px rgba(0,0,0,0.25)"
                        p={0}
                        height="auto"
                        minH="unset"
                        mb="5.25rem"
                        width="min(40vw, 300px)"
                        ml="auto"
                        mr="0.35rem"
                    >
                        <DrawerBody
                            p={0}
                            height="auto"
                            minH="unset"
                            display="block"
                        >
                            <Box
                                as="button"
                                w="100%"
                                py={4}
                                px={2}
                                pl={5}
                                textAlign="left"
                                bg="transparent"
                                border="none"
                                _hover={{ bg: 'brand.gray45' }}
                                onClick={() => {
                                    setHamburgerOpen(false);
                                    router.push('/transactions');
                                }}
                                display="flex"
                                alignItems="center"
                                gap={3}
                            >
                                <ChakraImage
                                    src="/TransactionsIcon.png"
                                    alt="Transactions"
                                    boxSize="24px"
                                    minW="24px"
                                    minH="24px"
                                    objectFit="contain"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    ml="-3px"
                                />
                                <Text
                                    fontSize="md"
                                    color="white"
                                    fontWeight="normal"
                                >
                                    Transactions
                                </Text>
                            </Box>
                            {/* {(isAdmin || isModerator) && (
                                <Box
                                    as="button"
                                    w="100%"
                                    py={4}
                                    px={2}
                                    pl={5}
                                    textAlign="left"
                                    bg="transparent"
                                    border="none"
                                    _hover={{ bg: 'brand.gray45' }}
                                    onClick={() => {
                                        setHamburgerOpen(false);
                                        router.push('/admin');
                                    }}
                                    display="flex"
                                    alignItems="center"
                                    gap={3}
                                >
                                    <FaUserShield
                                        size={20}
                                        color="#E8E8E8"
                                        style={{ minWidth: 20 }}
                                    />
                                    <Text
                                        fontSize="md"
                                        color="white"
                                        fontWeight="normal"
                                    >
                                        Admin
                                    </Text>
                                </Box>
                            )} */}
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            )}
            <UserPreferencesModal
                isOpen={isPreferencesOpen}
                onClose={() => setPreferencesOpen(false)}
            />
        </HStack>
    );
}

export default PortraitHomeTabs;
