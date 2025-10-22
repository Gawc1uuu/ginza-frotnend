import React from 'react';
import {
    HStack,
    Image,
    Show,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { convertCurrencyToDisplay } from '../../utils/convertCurrency';
import { useGameAllPlayers } from '../../hooks/useGamePlayers';
import { formatMicroDollarsWithCommas } from '../../utils/formatMoney';
import { useQueries } from '@tanstack/react-query';
import useGameId from '../../hooks/useGameID';
import { useHttpClient } from '../../websocket/hooks/useHttpClient';

export const LedgerTable = ({ showStack = true }: { showStack?: boolean }) => {


    // Create a sorted array of player indices by PnL (descending)
    return (
        <Table w="100%" size={{ base: 'sm', xl: 'md' }}>
            <Thead>
                <Tr>
                    <Th
                        borderBottom="1px solid"
                        borderColor="brand.gray30"
                        borderTop="none"
                        borderLeft="none"
                        borderRight="none"
                        textAlign="start"
                    >
                        <Text
                            fontSize="1rem"
                            variant="tableHeaderText"
                            textAlign="start"
                        >
                            Player
                        </Text>
                    </Th>
                    <Th
                        borderBottom="1px solid"
                        borderColor="brand.gray30"
                        borderTop="none"
                        borderLeft="none"
                        borderRight="none"
                        textAlign="end"
                    >
                        <Text
                            fontSize="1rem"
                            variant="tableHeaderText"
                            textAlign="end"
                        >
                            Buy-In
                        </Text>
                    </Th>
                    <Th
                        borderBottom="1px solid"
                        borderColor="brand.gray30"
                        borderTop="none"
                        borderLeft="none"
                        borderRight="none"
                        textAlign="end"
                    >
                        <Text
                            fontSize="1rem"
                            variant="tableHeaderText"
                            textAlign="end"
                        >
                            Cashout
                        </Text>
                    </Th>
                    {showStack && (
                        <Th
                            borderBottom="1px solid"
                            borderColor="brand.gray30"
                            borderTop="none"
                            borderLeft="none"
                            borderRight="none"
                            textAlign="end"
                        >
                            <Text
                                fontSize="1rem"
                                variant="tableHeaderText"
                                textAlign="end"
                            >
                                Stack
                            </Text>
                        </Th>
                    )}
                    <Th
                        borderBottom="1px solid"
                        borderColor="brand.gray30"
                        borderTop="none"
                        borderLeft="none"
                        borderRight="none"
                        textAlign="end"
                    >
                        <Text
                            fontSize="1rem"
                            variant="tableHeaderText"
                            textAlign="end"
                        >
                            PnL
                        </Text>
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
               
            </Tbody>
        </Table>
    );
};

export default LedgerTable;
