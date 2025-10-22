import {
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    HStack,
    Spacer,
    Image,
    useToast,
} from '@chakra-ui/react';

import { usePlayerManagementPendingPlayers } from './usePlayerManagementPendingPlayers';
import { Action, playerAction } from '../../../client';
import { PlayerManagementSortMenu } from './InGamePlayersTable';
import { useQueries } from '@tanstack/react-query';
import useGameId from '../../hooks/useGameID';
import { useHttpClient } from '../../websocket/hooks/useHttpClient';

export const PendingPlayersTable = () => {
    const { sortBy, setSortBy, pendingPlayers } =
        usePlayerManagementPendingPlayers();

    const toast = useToast();
    const handleError = (error: any) => {
        toast({
            title: `Unable to approve player: ${error}`,
            status: 'error',
            duration: 2000,
        });
    };




    const gameId = useGameId();

    return (
        <>
            <HStack justifyContent="space-between" mb="4">
                <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color="brand.secondaryOrange"
                >
                    Waiting for approval ({pendingPlayers.length})
                </Text>
                <PlayerManagementSortMenu
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
            </HStack>
            <Table>
                <Thead>
                    <Tr>
                        <Th borderColor="brand.gray30">
                            <Text variant="tableHeaderText">PLAYER NAME</Text>
                        </Th>
                        <Th borderColor="brand.gray30">
                            <Text variant="tableHeaderText">BUY IN AMT</Text>
                        </Th>
                        <Th borderColor="brand.gray30">
                            <Text variant="tableHeaderText">TIME REQ.</Text>
                        </Th>
                        <Th borderColor="brand.gray30">
                            <Text variant="tableHeaderText">ACTIONS</Text>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {pendingPlayers.length === 0 && (
                        <Tr>
                            <Td colSpan={4} borderBottom="none">
                                <Spacer h="6.25rem" />
                            </Td>
                        </Tr>
                    )}
                    {pendingPlayers?.map((p: any) => (
                        <>
                            <Tr>
                                <Td borderBottom="none">
                                    <HStack>
                                        {p.imageUrl ? (
                                            <Image
                                                src={
                                                    p.imageUrl
                                                }
                                                width="1.25rem"
                                                height="1.25rem"
                                                borderRadius="50%"
                                                alt="User Avatar"
                                            />
                                        ) : null}
                                        <Text variant="tableText">
                                            {p.username}
                                        </Text>
                                    </HStack>
                                </Td>
                                <Td borderBottom="none">
                                    <Text variant="tableText">1.0 USDB</Text>
                                </Td>
                                <Td borderBottom="none">
                                    <Text variant="tableText">9:33PM</Text>
                                </Td>
                                <Td borderBottom="none">
                                    <HStack spacing="4">
                                        <Button
                                            onClick={() => {
                                                playerAction({
                                                    path: {
                                                        game_id: gameId,
                                                    },
                                                    body: {
                                                        action: Action.ACCEPT_PLAYER,
                                                        action_target:
                                                            p.player_id,
                                                    },
                                                });
                                            }}
                                            variant="primary"
                                            size="sm"
                                            onError={handleError}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                playerAction({
                                                    path: {
                                                        game_id: gameId,
                                                    },
                                                    body: {
                                                        action: Action.REJECT_PLAYER,
                                                        action_target:
                                                            p.player_id,
                                                    },
                                                });
                                            }}
                                            variant="secondary"
                                            size="sm"
                                            onError={handleError}
                                        >
                                            Deny
                                        </Button>
                                    </HStack>
                                </Td>
                            </Tr>
                        </>
                    ))}
                </Tbody>
            </Table>
        </>
    );
};

export default PendingPlayersTable;
