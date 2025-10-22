import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { format } from 'date-fns';

import { useIsGameHost } from '../../hooks/useIsGameHost';
import useGameData from '../../hooks/useGameData';
import { useQueries } from '@tanstack/react-query';
import useViewer from '../../hooks/useViewer';
import { GameHistoryType } from '../../hooks/useGameHistory';
import { useWSQuery } from '../../websocket/hooks/useWSQuery';
import { useHttpClient } from '../../websocket/hooks/useHttpClient';

export const usePlayerManagementInGamePlayers = () => {
    const [sortBy, setSortBy] = useState<
        'Time Joined' | 'Buy In Amount' | 'Player Name'
    >('Time Joined');
    const playersInGame: any[] = [];
    const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

    const {
        isOpen: isSetHostOpen,
        onOpen: onSetHostOpen,
        onClose: onSetHostClose,
    } = useDisclosure();
    const isGameHost = useIsGameHost();

    const httpClient = useHttpClient();

 


    const allGameTransactions: any[] = [];

    // Sorting logic

    

  
};
