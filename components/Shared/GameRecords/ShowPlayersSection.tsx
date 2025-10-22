import React from 'react';
import { VStack, HStack, Text, Box, Image } from '@chakra-ui/react';

import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useHotkeyBlockingDisclosure } from '../../hooks/useHotkeyBlockingDisclosure';
import { useQueries } from '@tanstack/react-query';
import Link from 'next/link';
import { useHttpClient } from '../../websocket/hooks/useHttpClient';
import {
    HttpNamespaces,
    HttpQueries,
} from '../../../../../packages/shared/http.events';
import { UserDto } from '../../../../../packages/shared/shared.types';

const UserRow = ({ user }: { user: UserDto | null }) => {
    return (
        <HStack key={user?.id}>
            <Image
                src={user?.imageUrl}
                width="1.25rem"
                height="1.25rem"
                borderRadius="50%"
                alt="User Avatar"
            />
            <Text
                color="brand.white80"
                cursor="pointer"
                _hover={{
                    textDecoration: 'underline',
                }}
                fontSize="12px"
            >
                <Link href={`/profile/${user?.id}`}>
                    {user?.username ?? 'N/A'}
                </Link>
            </Text>
        </HStack>
    );
};

export const ShowPlayersSection = ({ playerIds }: { playerIds?: string[] }) => {
    const { isOpen, onOpen, onClose } = useHotkeyBlockingDisclosure();

    const httpClient = useHttpClient();

    const usersQueries = useQueries({
        queries:
            playerIds?.map((userId) => ({
                queryKey: ['user', userId],
                queryFn: () =>
                    httpClient.query(
                        HttpNamespaces.USER,
                        HttpQueries.getUserByUserId,
                        {
                            userId: userId,
                        },
                    ),
            })) ?? [],
    });

    return (
        <VStack align="start" spacing={0} width="100%">
            <Box
                borderRadius="0.5rem"
                // border="0.05rem solid"
                // borderColor="rgba(255, 255, 255, 0.25)"
                px="0.55rem"
                py="0.125rem"
                bg="linear-gradient(180deg, rgba(63, 63, 66, 0.83) 0%, rgba(61, 59, 66, 0.75) 100%)"
            >
                <Box
                    as="button"
                    onClick={isOpen ? onClose : onOpen}
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                >
                    <HStack spacing={1}>
                        {isOpen ? (
                            <>
                                {/* <FaChevronDown
                                    size={10}
                                    color="var(--chakra-colors-brand-white70)"
                                /> */}
                                <Text
                                    fontSize="0.75rem"
                                    fontWeight="600"
                                    color="rgba(255, 255, 255, 0.7)"
                                    ml="0.1rem"
                                >
                                    Hide Players
                                </Text>
                                {/* <FaChevronDown
                                    size={10}
                                    color="var(--chakra-colors-brand-white70)"
                                /> */}
                            </>
                        ) : (
                            <>
                                <Text
                                    fontSize="0.75rem"
                                    fontWeight="700"
                                    color="rgba(255, 255, 255, 0.7)"
                                    ml="0.1rem"
                                >
                                    Show Players
                                </Text>
                                {/* <FaChevronRight
                                    size={10}
                                    color="var(--chakra-colors-brand-white80)"
                                /> */}
                            </>
                        )}
                    </HStack>
                </Box>
            </Box>
            {isOpen && (
                <Box
                    width="100%"
                    mt="0.5rem"
                    p="0.75rem"
                    bg="brand.gray45"
                    borderRadius="0.5rem"
                    border="1px solid"
                    borderColor="brand.gray50"
                >
                    <HStack align="start" spacing="2rem" width="100%">
                        <VStack align="start" spacing={2} flex="1">
                            {playerIds
                                ?.slice(0, Math.ceil(playerIds.length / 2))
                                .map((playerId, idx) => (
                                    <UserRow
                                        key={playerId}
                                        user={usersQueries[idx]?.data ?? null}
                                    />
                                ))}
                        </VStack>
                        <VStack align="start" spacing={2} flex="1">
                            {playerIds
                                ?.slice(Math.ceil(playerIds.length / 2))
                                .map((playerId, idx) => (
                                    <UserRow
                                        key={playerId}
                                        user={
                                            usersQueries[
                                                idx +
                                                    Math.ceil(
                                                        playerIds.length / 2,
                                                    )
                                            ]?.data ?? null
                                        }
                                    />
                                ))}
                        </VStack>
                    </HStack>
                </Box>
            )}
        </VStack>
    );
};
