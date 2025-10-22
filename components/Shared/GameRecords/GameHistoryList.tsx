'use client';

import React, { useEffect, useState } from 'react';
import { VStack, Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { GameCard } from './GameCard';
import { useQuery } from '@tanstack/react-query';
import GameHistoryControls from './GameHistoryControls';
import { useHttpClient } from '../../websocket/hooks/useHttpClient';
import {
    HttpNamespaces,
    HttpQueries,
} from '../../../../../packages/shared/http.events';
import { UserDto } from '../../../../../packages/shared/shared.types';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useDebounce } from '../../hooks/useDebounce';

export const GameHistoryList = ({ user }: { user: UserDto }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('Latest');
    const [statusFilter, setStatusFilter] = useState('All Games');
    const [page, setPage] = useState(1);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm, sortOption, statusFilter]);

    const httpClient = useHttpClient();

    const { data, isLoading } = useQuery<any>({
        queryKey: ['paginatedGamesForUser', debouncedSearchTerm, sortOption, statusFilter, user.id, page],
        queryFn: () => httpClient.query(
            HttpNamespaces.GAME,
            HttpQueries.getPaginatedGamesForUser,
            {
                orderBy:'createdAt',
                userId: user.id,
                page: page,
                limit: 10,
                orderType: sortOption === 'Latest' ? 'desc' : 'asc',
                gameId: debouncedSearchTerm,
                status: statusFilter,
            },
        ),
    });



    const totalPages = data?.totalCount ? Math.ceil(data.totalCount / 10) : 1;

    const handlePrevPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    return (
        <VStack spacing={3} w="100%">
            <GameHistoryControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortOption={sortOption}
                setSortOption={setSortOption}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />
            <Box width="100%" borderRadius="xl">
                <VStack width="100%" spacing={5} py={4}>
                    {isLoading ? (
                        <Text color="white" textAlign="center" py={10}>
                            Loading games...
                        </Text>
                    ) : !data?.games || data.games.length === 0 ? (
                        <Text color="white" textAlign="center" py={10}>
                            No game records found.
                        </Text>
                    ) : (
                        data.games.map((gameItem: any, index: number) => {

                            return <Box
                                key={gameItem.game_id}
                                w="100%"
                                pb={
                                    index === data.games.length - 1
                                        ? '1rem'
                                        : 0
                                }
                            >
                                <GameCard
                                    game={gameItem}
                                    gameData={gameItem.gameData}
                                    user={user}
                                    loading={isLoading}
                                />
                            </Box>
                        })
                    )}
                </VStack>

                {data && data.totalCount > 10 && (
                    <HStack
                        mt="auto"
                        pt={4}
                        pb={2}
                        justifyContent="center"
                        spacing={4}
                    >
                        <IconButton
                            aria-label="Previous Page"
                            icon={<ChevronLeftIcon color="white" />}
                            size="sm"
                            variant="solid"
                            bg="purple.400"
                            _hover={{ bg: 'purple.500' }}
                            onClick={handlePrevPage}
                            isDisabled={page === 1}
                        />
                        <Text color="white">
                            Page {page} of {totalPages}
                        </Text>
                        <IconButton
                            aria-label="Next Page"
                            icon={<ChevronRightIcon color="white" />}
                            size="sm"
                            variant="solid"
                            bg="purple.400"
                            _hover={{ bg: 'purple.500' }}
                            onClick={handleNextPage}
                            isDisabled={page >= totalPages}
                        />
                    </HStack>
                )}
            </Box>
        </VStack>
    );
};


export default GameHistoryList;
