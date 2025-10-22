'use client';

import {
    Box,
    VStack,
    Text,
    Image,
    useDisclosure,
    HStack,
    Spacer,
    Flex,
    Button,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    Tag,
} from '@chakra-ui/react';

import { CreateTableModal } from '../../../Modals/CreateTableModal/CreateTableModal';
import { GameMode } from '../../../../client';
import { useAuthModal } from '../../../Shared/AuthModalContext';
import useViewer from '../../../hooks/useViewer';
import { CloseIcon, WarningIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkGameLink } from '../../../utils/getUrl';

interface GameActionConfig {
    imageSrc: string;
    gameName: string;
    active: boolean;
}

const TEXAS_HOLD_EM = "TEXAS HOLD'EM";
const POT_LIMIT_OMAHA = 'POT-LIMIT OMAHA';

const GameCard = ({ gameConfig }: { gameConfig: GameActionConfig }) => {
    const {
        isOpen: isCreateTableModalOpen,
        onOpen: onOpenCreateTableModal,
        onClose: onCloseCreateTableModal,
    } = useDisclosure();

    const handleClick = () => {
        if (!gameConfig.active) return;
        onOpenCreateTableModal();
    };

    return (
        <VStack
            spacing={0}
            align="center"
            borderRadius="1rem"
            border="1px solid rgba(137, 142, 150, 0.35)"
            position="relative"
            cursor={gameConfig.active ? 'pointer' : 'default'}
            overflow="hidden"
            onClick={gameConfig.active ? handleClick : undefined}
            _hover={
                gameConfig.active
                    ? {
                          border: '1px solid rgba(255,255,255,0.57)',
                          boxShadow: '0 0 12px rgba(212, 195, 221, 0.5)',
                      }
                    : {}
            }
            pointerEvents={gameConfig.active ? undefined : 'none'}
        >
            <Box w="100%" h="100%" position="relative">
                <Image
                    src={gameConfig.imageSrc}
                    fit="cover"
                    w="100%"
                    h="100%"
                    aspectRatio="0.86"
                    alt={`Thumbnail for ${gameConfig.gameName} game`}
                    userSelect="none"
                    draggable={false}
                />
            </Box>
            <CreateTableModal
                isOpen={isCreateTableModalOpen}
                onClose={onCloseCreateTableModal}
                gameMode={
                    gameConfig.gameName === TEXAS_HOLD_EM
                        ? GameMode.NLH
                        : gameConfig.gameName === POT_LIMIT_OMAHA
                          ? GameMode.PLO
                          : GameMode.NLH
                }
            />
        </VStack>
    );
};

export const GameMainCard = () => {
    const pokerConfigs: GameActionConfig[] = [
        {
            imageSrc: '../game_holdem.webp',
            gameName: TEXAS_HOLD_EM,
            active: true,
        },
        {
            imageSrc: '../game_plo.webp',
            gameName: POT_LIMIT_OMAHA,
            active: true,
        },
    ];

    const gameConfigs: GameActionConfig[] = [
        {
            imageSrc: '../game_twobirds_onestone.webp',
            gameName: 'TWO BIRDS ONE STONE',
            active: false,
        },
        {
            imageSrc: '../game_roulette.webp',
            gameName: 'ROULETTE',
            active: false,
        },
        {
            imageSrc: '../game_blackjack.webp',
            gameName: 'BLACKJACK',
            active: false,
        },
    ];

    const fillEmptySlots = (configs: GameActionConfig[], size: number) => {
        const filledConfigs = [...configs];
        while (filledConfigs.length < size) {
            filledConfigs.push({ imageSrc: '', gameName: '', active: false });
        }
        return filledConfigs;
    };

    const [isError, setIsError] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const router = useRouter();

    const handleInviteLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInviteLink(value);
        setIsError(false);
    };

    const handleJoinGameClick = () => {
        const gameLink = checkGameLink(inviteLink);
        if (gameLink) {
            router.push(gameLink);
        } else {
            setIsError(true);
        }
    };

    const handleClearInviteLink = () => {
        setInviteLink('');
        setIsError(false);
    };

    return (
        <VStack w="100%" spacing="0.5rem">
            <Flex
                flexDirection="column"
                alignItems="flex-start"
                borderRadius="16px"
                px="1rem"
                pb="1rem"
                border="1px solid rgba(28, 28, 48, 0.75)"
                background="linear-gradient(56.48deg, rgba(33, 34, 65, 0) 27.36%, #0D0B16 88.17%),
                  radial-gradient(40.43% 165.91% at 90.43% 81.34%, rgba(86, 31, 172, 0.4) 0%, rgba(13, 11, 22, 0.4) 100%),
                  radial-gradient(30.47% 61.72% at 45.05% 113.18%, rgba(69, 84, 184, 0.7) 0%, rgba(23, 22, 42, 0.7) 100%)"
                // boxShadow="0 -4px 12px 0 #FF4EDB80"
                boxShadow="-1px -2px 1.5px 0 rgba(77, 52, 95, 0.75)"
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
                        'linear-gradient(90deg, rgba(179,127,235,0) 0%, rgba(179,127,235,0.9) 50%, rgba(179,127,235,0) 100%)',
                    pointerEvents: 'none',
                }}
            >
                <VStack w="100%" spacing="0.5rem">
                    <HStack
                        alignSelf="flex-start"
                        spacing="0.75rem"
                        justify="flex-start"
                    >
                        <Image
                            src="/Poker.png"
                            alt="Poker"
                            boxSize="32px"
                            transform="rotate(-10deg)"
                            userSelect="none"
                            draggable={false}
                        />
                        <Text
                            color="brand.textWhite"
                            fontSize="2rem"
                            fontWeight="900"
                            p="12px"
                            textAlign="left"
                            alignSelf="flex-start"
                            transform="translateX(-10px)"
                        >
                            GINZA POKER
                        </Text>
                    </HStack>
                    <Text
                        fontSize="1.05rem"
                        color="purple.100"
                        fontWeight="900"
                        px="0.5rem"
                        mt="-0.5rem"
                        mb="0.25rem"
                        textAlign="center"
                        alignSelf="flex-start"
                    >
                        CREATE NEW TABLE
                    </Text>
                    <HStack gap="1rem" w="100%" justify="space-between">
                        {fillEmptySlots(pokerConfigs, 3).map(
                            (config, index) => (
                                <Box key={index} flex="1" minW="0" h="100%">
                                    {config.gameName ? (
                                        <GameCard gameConfig={config} />
                                    ) : null}
                                </Box>
                            ),
                        )}
                    </HStack>
                    <Text
                        fontSize="1.05rem"
                        color="purple.100"
                        fontWeight="900"
                        px="0.5rem"
                        mt="0.5rem"
                        textAlign="center"
                        alignSelf="flex-start"
                    >
                        OR JOIN AN EXISTING GAME
                    </Text>
                    <HStack w="99%" spacing="1rem">
                        <InputGroup flex="3">
                            <Input
                                fontSize="clamp(14px, 0.85rem, 0.85rem)"
                                placeholder="Enter your game invite link"
                                textAlign="left"
                                value={inviteLink}
                                onChange={handleInviteLinkChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleJoinGameClick();
                                    }
                                }}
                                color="brand.white80"
                                borderRadius="12px"
                                w="100%"
                                h="3rem"
                                borderColor={isError ? 'red.300' : 'purple.300'}
                                bg="#111111"
                                _hover={{}}
                                _focus={{
                                    borderColor: 'purple.500',
                                    '&::placeholder': {
                                        opacity: 0,
                                    },
                                }}
                                _placeholder={{
                                    fontSize: 'clamp(14px, 0.85rem, 0.85rem)',
                                    color: 'purple.200',
                                    opacity: 0.85,
                                }}
                            />
                            <InputRightElement
                                h="100%"
                                display="flex"
                                alignItems="center"
                                pr="1rem"
                            >
                                <IconButton
                                    aria-label="Clear invite link"
                                    icon={
                                        <CloseIcon color="brand.silverGray" />
                                    }
                                    size="sm"
                                    onClick={handleClearInviteLink}
                                    variant="ghost"
                                    bg="#111111"
                                    _hover={{ bg: '#111111' }}
                                    _active={{ bg: '#111111' }}
                                />
                            </InputRightElement>
                        </InputGroup>
                        <Button
                            flex="1"
                            variant="landingPageButton"
                            fontWeight="700"
                            w="100%"
                            h="3rem"
                            maxW="160px"
                            fontSize="0.95rem"
                            borderRadius="12px"
                            onClick={handleJoinGameClick}
                        >
                            Join Game
                        </Button>
                    </HStack>
                    {isError && (
                        <HStack spacing="0.5rem" mt="0.25rem">
                            <WarningIcon color="red.300" w={3.5} h={3.5} />
                            <Text
                                color="red.300"
                                fontSize="sm"
                                fontWeight="500"
                            >
                                Invalid or expired game invite link. Please try
                                again.
                            </Text>
                        </HStack>
                    )}
                </VStack>
            </Flex>
        </VStack>
    );
};
