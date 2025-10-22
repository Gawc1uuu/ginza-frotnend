'use client';

import {
    Button,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    HStack,
    VStack,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CloseIcon, WarningIcon } from '@chakra-ui/icons';
import { checkGameLink } from '../../../utils/getUrl';

export const InviteLinkCard = () => {
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
        <VStack w="100%" spacing="0.5rem" align="stretch">
            <VStack
                w="100%"
                borderRadius="12px"
                background="#111111"
                spacing="0.5rem"
                align="stretch"
            >
                <HStack w="100%" spacing="1rem">
                    <InputGroup flex="3">
                        <Input
                            // background="#111111"
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
                            borderRadius="0.75rem"
                            w="100%"
                            h="3rem"
                            borderColor={isError ? 'red.300' : 'purple.300'}
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
                                icon={<CloseIcon color="brand.silverGray" />}
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
                        // isDisabled={inviteLink.length < 2}
                    >
                        Join Game
                    </Button>
                </HStack>
                {isError && (
                    <HStack spacing="0.5rem" mt="0.25rem">
                        <WarningIcon color="red.300" w={3.5} h={3.5} />
                        <Text color="red.300" fontSize="sm" fontWeight="500">
                            Invalid or expired game invite link. Please try
                            again.
                        </Text>
                    </HStack>
                )}
            </VStack>
        </VStack>
    );
};
