'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    HStack,
    VStack,
    Text,
    Tag,
    TagLabel,
    Button,
    IconButton,
    useBreakpointValue,
    CircularProgress,
    CircularProgressLabel,
    Checkbox,
    Divider,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { LockIcon } from '@chakra-ui/icons';
import { FaPlay } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { FaBomb, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useBreakpointValue as useChakraBreakpointValue } from '@chakra-ui/react';
import { Menu, MenuButton, MenuList } from '@chakra-ui/react';
import { MdFilterList } from 'react-icons/md';
import { FaSyncAlt } from 'react-icons/fa';
import { useHttpClient } from '../../../websocket/hooks/useHttpClient';

const FILTERS = [
    { label: 'ALL', value: 'ALL' },
    { label: 'NLH', value: 'NLH' },
    { label: 'PLO', value: 'PLO' },
];

export const ActiveGamesCard: React.FC = () => {
    const router = useRouter();
    const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
    const minUpdatedAt = Date.now() - TWO_WEEKS_MS;
    const [games, setGames] = useState<any[] | null>(null);
    const isPortrait = useBreakpointValue({
        base: true,
        md: true,
        lg: false,
        xl: false,
    });
    const isXl = useChakraBreakpointValue({
        base: false,
        md: false,
        lg: false,
        xl: true,
    });
    const isMd = useBreakpointValue({
        base: false,
        md: true,
        lg: false,
        xl: false,
    });
    const itemsPerPage = isPortrait ? 8 : isXl ? 9 : isMd ? 8 : 7;

    const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);

    // Format blinds and min buy-in like admin/Games.tsx
    const formatBlinds = (
        smallBlind: number | bigint | undefined,
        bigBlind: number | bigint | undefined,
    ) => {
        if (!smallBlind || !bigBlind) return 'N/A';
        const sb = Number(smallBlind) / 1e6;
        const bb = Number(bigBlind) / 1e6;
        return `${sb}/${bb}`;
    };

    const formatBuyIn = (minBuyIn: number | bigint | undefined) => {
        if (!minBuyIn) return 'N/A';
        const value = Number(minBuyIn) / 1e6;
        if (value > 1) {
            return value.toLocaleString(undefined, {
                maximumFractionDigits: 0,
            });
        } else {
            return value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
    };

    // For row hover highlight and custom checkbox color
    const rowHoverBg = 'brand.gray40';
    const filterBg = 'rgba(162, 121, 220, 0.18)';
    const filterIconColor = '#A78BFA';

    const isBaseOrXs = isPortrait; // For simplicity, treat isPortrait as base/xs

    return (
        <Box
            w={isPortrait ? '100%' : undefined}
            p={3}
            borderRadius="16px"
            border="1px solid rgb(65, 64, 70, 0.25)"
            overflow="visible"
            minH="650px"
            display="flex"
            flexDirection="column"
            background="linear-gradient(106.48deg, rgba(33, 34, 65, 0) 27.36%, #0D0B16 88.17%),
                      radial-gradient(40.43% 165.91% at 90.43% 81.34%, rgba(54, 7, 54, 0.4) 0%, rgba(13, 11, 22, 0.4) 100%),
                      radial-gradient(130.47% 61.72% at 45.05% 113.18%, rgba(2, 2, 27, 0.7) 0%, rgba(23, 22, 42, 0.7) 100%)"
            boxShadow="-1px -2px 1.5px 0 rgba(77, 52, 95, 0.75)"
            h="100%"
            position="relative"
            _before={{
                content: '""',
                position: 'absolute',
                top: -0.5,
                left: 0,
                right: 0,
                height: '1px',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                background:
                    'linear-gradient(90deg, rgba(167,139,250,0) 0%, rgba(167,139,250,0.9) 50%, rgba(167,139,250,0) 100%)',
                pointerEvents: 'none',
            }}
        >
            <HStack
                align="center"
                spacing={2}
                mb={2}
                justifyContent="center"
                w="100%"
            >
                <FaUsers size={26} color="#A78BFA" />
                <Text
                    fontSize="1.25rem"
                    fontWeight="800"
                    color="brand.textWhite"
                >
                    Active Games
                </Text>
            </HStack>
            <Box
                w="100%"
                display="flex"
                justifyContent="center"
                position="relative"
            >
                {isBaseOrXs ? (
                    <>
                        <IconButton
                            aria-label="Previous Page"
                            icon={
                                <ChevronLeftIcon
                                    color='gray.400'
                                />
                            }
                            size="md"
                            variant="walletButton"
                            h="2.5rem"
                            w="2.5rem"
                            position="absolute"
                            left={0}
                            top="50%"
                            transform="translateY(-50%)"
                            m={0}
                            isDisabled={true}
                            _disabled={{ opacity: 0.3, bg: 'gray.700' }}
                            _hover={{}}
                            zIndex={2}
                        />
                        <HStack
                            mb={2}
                            spacing={2.5}
                            align="center"
                            justify="center"
                            w="100%"
                        >
                            {FILTERS.map((f) => (
                                <Button
                                    key={f.value}
                                    variant='solid'
                                    bg='gray.700'
                                    color={
                                        'whiteAlpha.700'
                                    }
                                    borderRadius="1rem"
                                    fontWeight="bold"
                                    fontSize={isPortrait ? '0.82rem' : '0.9rem'}
                                    minW={isPortrait ? '3.1rem' : '3.2rem'}
                                    px={isPortrait ? 2.5 : 3}
                                    mb={1}
                                    py={isPortrait ? 1.5 : 2}
                                    h={isPortrait ? '1.85rem' : '2.2rem'}
                                    _hover={
                                        { bg: 'gray.600' }
                                    }
                                >
                                    {f.label}
                                </Button>
                            ))}
                            <Menu
                                isOpen={false}
                                onOpen={() => {}}
                                onClose={() => {}}
                            >
                                <MenuButton
                                    as={Button}
                                    bg={
                                        'rgba(162, 121, 220, 0.18)'
                                    }
                                    borderRadius="1rem"
                                    minW="3.2rem"
                                    px={3.5}
                                    mb={1}
                                    py={isPortrait ? 1.5 : 2}
                                    h={isPortrait ? '1.85rem' : '2.2rem'}
                                    borderWidth={undefined}
                                    borderColor={undefined}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    _hover={{ bg: 'rgba(162, 121, 220, 0.25)' }}
                                    _active={{
                                        bg: 'rgba(162, 121, 220, 0.25)',
                                    }}
                                    fontWeight="bold"
                                    fontSize="0.9rem"
                                    aria-label="Sort"
                                >
                                    <MdFilterList
                                        style={{
                                            fontSize: 20,
                                            verticalAlign: 'middle',
                                        }}
                                        color="#A78BFA"
                                    />
                                </MenuButton>
                                <MenuList
                                    bg="brand.gray50"
                                    opacity={0.97}
                                    borderRadius="1rem"
                                    minW="220px"
                                    p={2}
                                    color="whiteAlpha.800"
                                    border="1.5px solid"
                                    borderColor="brand.gray40"
                                >
                                    <Box px={2} pt={1} pb={1}>
                                        <HStack
                                            align="center"
                                            mb={3}
                                            as="button"
                                            w="100%"
                                            onClick={() =>
                                                {}
                                            }
                                            cursor="pointer"
                                            _hover={{ bg: rowHoverBg }}
                                            bg="brand.gray50"
                                        >
                                            <Checkbox
                                                isChecked={false}
                                                onChange={() =>
                                                    {}
                                                }
                                                colorScheme="purple"
                                                mr={2}
                                                pointerEvents="none"
                                                iconColor={filterIconColor}
                                                sx={{
                                                    '.chakra-checkbox__control[data-checked]':
                                                        {
                                                            bg: filterBg,
                                                            borderColor:
                                                                filterBg,
                                                        },
                                                    '.chakra-checkbox__icon': {
                                                        color: filterIconColor,
                                                    },
                                                    '.chakra-checkbox__control':
                                                        {
                                                            borderColor:
                                                                'gray.500',
                                                            background:
                                                                'gray.700',
                                                        },
                                                }}
                                            />
                                            <Text
                                                fontSize="0.75rem"
                                                color="whiteAlpha.700"
                                                fontWeight={600}
                                            >
                                                Hide lower stakes
                                            </Text>
                                        </HStack>
                                        <Divider
                                            borderColor="whiteAlpha.200"
                                            mb={2}
                                        />
                                        <HStack
                                            align="center"
                                            mb={2}
                                            justify="space-between"
                                            as="button"
                                            w="100%"
                                            onClick={() =>
                                                {}
                                            }
                                            cursor="pointer"
                                            _hover={{ bg: rowHoverBg }}
                                            bg="brand.gray50"
                                        >
                                            <HStack align="center">
                                                <Checkbox
                                                    isChecked={false}
                                                    onChange={() =>
                                                        {}
                                                    }
                                                    colorScheme="purple"
                                                    mr={2}
                                                    pointerEvents="none"
                                                    iconColor={filterIconColor}
                                                    sx={{
                                                        '.chakra-checkbox__control[data-checked]':
                                                            {
                                                                bg: filterBg,
                                                                borderColor:
                                                                    filterBg,
                                                            },
                                                        '.chakra-checkbox__icon':
                                                            {
                                                                color: filterIconColor,
                                                            },
                                                        '.chakra-checkbox__control':
                                                            {
                                                                borderColor:
                                                                    'gray.500',
                                                                background:
                                                                    'gray.700',
                                                            },
                                                    }}
                                                />
                                                <Text
                                                    fontSize="0.85rem"
                                                    fontWeight={700}
                                                    color="whiteAlpha.600"
                                                >
                                                        Public (0)
                                                </Text>
                                            </HStack>
                                        </HStack>
                                        <HStack
                                            align="center"
                                            justify="space-between"
                                            as="button"
                                            w="100%"
                                            onClick={() =>
                                                {}
                                            }
                                            cursor="pointer"
                                            _hover={{ bg: rowHoverBg }}
                                            bg="brand.gray50"
                                        >
                                            <HStack align="center">
                                                <Checkbox
                                                    isChecked={false}
                                                    onChange={() =>
                                                        {}
                                                    }
                                                    colorScheme="purple"
                                                    mr={2}
                                                    pointerEvents="none"
                                                    iconColor={filterIconColor}
                                                    sx={{
                                                        '.chakra-checkbox__control[data-checked]':
                                                            {
                                                                bg: filterBg,
                                                                borderColor:
                                                                    filterBg,
                                                            },
                                                        '.chakra-checkbox__icon':
                                                            {
                                                                color: filterIconColor,
                                                            },
                                                        '.chakra-checkbox__control':
                                                            {
                                                                borderColor:
                                                                    'gray.500',
                                                                background:
                                                                    'gray.700',
                                                            },
                                                    }}
                                                />
                                                <Text
                                                    fontSize="0.85rem"
                                                    fontWeight={700}
                                                    color="whiteAlpha.600"
                                                >
                                                    Private (0)
                                                </Text>
                                            </HStack>
                                        </HStack>
                                    </Box>
                                </MenuList>
                            </Menu>
                            <IconButton
                                aria-label="Refresh"
                                icon={<FaSyncAlt color="#A78BFA" />}
                                size={isPortrait ? 'sm' : 'md'}
                                variant="walletButton"
                                h={isPortrait ? '1.85rem' : '2.2rem'}
                                w={isPortrait ? '1.85rem' : '2.2rem'}
                                mb={1}
                                ml={isPortrait ? 0.5 : 1}
                                onClick={() => {}}
                            />
                        </HStack>
                        <IconButton
                            aria-label="Next Page"
                            icon={
                                <ChevronRightIcon
                                    color='gray.400'
                                />
                            }
                            size="md"
                            variant="walletButton"
                            h="2.5rem"
                            w="2.5rem"
                            position="absolute"
                            right={0}
                            top="50%"
                            transform="translateY(-50%)"
                            m={0}
                            onClick={() => {}}
                                isDisabled={
                                true
                            }
                            _disabled={{ opacity: 0.3, bg: 'gray.700' }}
                            _hover={{}}
                            zIndex={2}
                        />
                    </>
                ) : (
                    <HStack
                        mb={2}
                        spacing={2}
                        align="center"
                        justify="center"
                        w="100%"
                    >
                        <IconButton
                            aria-label="Previous Page"
                            icon={
                                <ChevronLeftIcon
                                    color='gray.400'
                                />
                            }
                            size="sm"
                            variant="walletButton"
                            h="2rem"
                            w="2rem"
                            mx={3}
                            cursor="pointer"
                            alignSelf="center"
                            onClick={() => {}}
                            isDisabled={true}
                            _disabled={{ opacity: 0.3, bg: 'gray.700' }}
                            _hover={{}}
                        />
                        <HStack spacing={2} align="center" justify="center">
                            {FILTERS.map((f) => (
                                <Button
                                    key={f.value}
                                    onClick={() => {}}
                                    variant='solid'
                                    bg={
                                        'gray.700'
                                    }
                                    color='whiteAlpha.700'
                                    borderRadius="1rem"
                                    fontWeight="bold"
                                    fontSize="0.7rem"
                                    minW="2.5rem"
                                    px={2.5}
                                    mb={1}
                                    py={1}
                                    h="1.65rem"
                                    _hover={
                                        { bg: 'gray.600' }
                                    }
                                >
                                    {f.label}
                                </Button>
                            ))}
                            <Menu
                                isOpen={false}
                            >
                                <MenuButton
                                    as={Button}
                                    bg={
                                        'rgba(162, 121, 220, 0.18)'
                                    }
                                    borderRadius="1rem"
                                    minW="2.5rem"
                                    px={2.5}
                                    mb={1}
                                    py={1}
                                    h="1.65rem"
                                    _hover={{ bg: 'rgba(162, 121, 220, 0.25)' }}
                                    _active={{
                                        bg: 'rgba(162, 121, 220, 0.25)',
                                    }}
                                    fontWeight="bold"
                                    fontSize="0.7rem"
                                    aria-label="Sort"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <MdFilterList
                                        style={{
                                            fontSize: 20,
                                            verticalAlign: 'middle',
                                        }}
                                        color="#A78BFA"
                                    />
                                </MenuButton>
                                <MenuList
                                    bg="brand.gray50"
                                    opacity={0.97}
                                    borderRadius="1rem"
                                    minW="220px"
                                    p={2}
                                    color="whiteAlpha.800"
                                    border="1.5px solid"
                                    borderColor="brand.gray40"
                                >
                                    <Box px={2} pt={1} pb={1}>
                                        <HStack
                                            align="center"
                                            mb={3}
                                            as="button"
                                            w="100%"
                                            onClick={() =>
                                                {}
                                            }
                                            cursor="pointer"
                                            _hover={{ bg: rowHoverBg }}
                                            bg="brand.gray50"
                                        >
                                            <Checkbox
                                                isChecked={false}
                                                onChange={() =>
                                                    {}
                                                }
                                                colorScheme="purple"
                                                mr={2}
                                                pointerEvents="none"
                                                iconColor={filterIconColor}
                                                sx={{
                                                    '.chakra-checkbox__control[data-checked]':
                                                        {
                                                            bg: filterBg,
                                                            borderColor:
                                                                filterBg,
                                                        },
                                                    '.chakra-checkbox__icon': {
                                                        color: filterIconColor,
                                                    },
                                                    '.chakra-checkbox__control':
                                                        {
                                                            borderColor:
                                                                'gray.500',
                                                            background:
                                                                'gray.700',
                                                        },
                                                }}
                                            />
                                            <Text
                                                fontSize="0.75rem"
                                                color="whiteAlpha.700"
                                                fontWeight={600}
                                            >
                                                Hide lower stakes
                                            </Text>
                                        </HStack>
                                        <Divider
                                            borderColor="whiteAlpha.200"
                                            mb={2}
                                        />
                                        <HStack
                                            align="center"
                                            mb={2}
                                            justify="space-between"
                                            as="button"
                                            w="100%"
                                            onClick={() =>
                                                {}
                                            }
                                            cursor="pointer"
                                            _hover={{ bg: rowHoverBg }}
                                            bg="brand.gray50"
                                        >
                                            <HStack align="center">
                                                <Checkbox
                                                    isChecked={false}
                                                    onChange={() =>
                                                        {}
                                                    }
                                                    colorScheme="purple"
                                                    mr={2}
                                                    pointerEvents="none"
                                                    iconColor={filterIconColor}
                                                />
                                                <Text
                                                    fontSize="0.85rem"
                                                    fontWeight={700}
                                                    color="whiteAlpha.600"
                                                >
                                                    Public (0)
                                                </Text>
                                            </HStack>
                                        </HStack>
                                        <HStack
                                            align="center"
                                            justify="space-between"
                                            as="button"
                                            w="100%"
                                            onClick={() =>
                                                {}
                                            }
                                            cursor="pointer"
                                            _hover={{ bg: rowHoverBg }}
                                            bg="brand.gray50"
                                        >
                                            <HStack align="center">
                                                <Checkbox
                                                    isChecked={false}
                                                    onChange={() =>
                                                        {}
                                                    }
                                                    colorScheme="purple"
                                                    mr={2}
                                                    pointerEvents="none"
                                                    iconColor={filterIconColor}
                                                    sx={{
                                                        '.chakra-checkbox__control[data-checked]':
                                                            {
                                                                bg: filterBg,
                                                                borderColor:
                                                                    filterBg,
                                                            },
                                                        '.chakra-checkbox__icon':
                                                            {
                                                                color: filterIconColor,
                                                            },
                                                        '.chakra-checkbox__control':
                                                            {
                                                                borderColor:
                                                                    'gray.500',
                                                                background:
                                                                    'gray.700',
                                                            },
                                                    }}
                                                />
                                                <Text
                                                    fontSize="0.85rem"
                                                    fontWeight={700}
                                                    color="whiteAlpha.600"
                                                >
                                                        Private (0)
                                                </Text>
                                            </HStack>
                                        </HStack>
                                    </Box>
                                </MenuList>
                            </Menu>
                            <IconButton
                                aria-label="Refresh"
                                icon={<FaSyncAlt color="#A78BFA" />}
                                size="sm"
                                variant="walletButton"
                                h="1.65rem"
                                w="1.65rem"
                                mb={1}
                                ml={0.5}
                                onClick={() => {}}
                            />
                        </HStack>
                        <IconButton
                            aria-label="Next Page"
                            icon={
                                <ChevronRightIcon
                                    color='gray.400'
                                />
                            }
                            size="sm"
                            variant="walletButton"
                            h="2rem"
                            w="2rem"
                            mx={3}
                            cursor="pointer"
                            alignSelf="center"
                            onClick={() => {}}
                            isDisabled={true}
                            _disabled={{ opacity: 0.3, bg: 'gray.700' }}
                            _hover={
                                {}
                            }
                        />
                    </HStack>
                )}
            </Box>
            <VStack spacing={1} align="stretch" w="100%">
                {!games && (
                    <VStack
                        w="100%"
                        align="center"
                        justifyContent="center"
                        spacing={1}
                        mt="20%"
                    >
                        <img
                            src="/SearchIcon.webp"
                            alt="Loading"
                            style={{ width: 56, height: 56, margin: '0 auto' }}
                        />
                        <Text
                            color="gray.400"
                            textAlign="center"
                            fontSize="1.1rem"
                            mt={1}
                            fontWeight="700"
                        >
                            Loading Games...
                        </Text>
                    </VStack>
                )}
                
            </VStack>
        </Box>
    );
};
