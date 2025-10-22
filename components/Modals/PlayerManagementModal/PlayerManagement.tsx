import React from 'react';

import InGamePlayersTable from './InGamePlayersTable';
import PendingPlayersTable from './PendingPlayersTable';
import { useBreakpointValue, VStack } from '@chakra-ui/react';
import { GinzaSurface } from '../GinzaModal';
import InGamePlayersSection from './Portrait/InGamePlayersSection';
import PendingPlayersSection from './Portrait/PendingPlayersSection';

interface PlayerManagementProps {
    isOpen: boolean;
    onClose: () => void;
    visibility?: number;
}

const PlayerManagement = ({
    isOpen,
    onClose,
    visibility,
}: PlayerManagementProps) => {
    const isPortrait = useBreakpointValue({ base: true, xl: false });
    const isPrivate = visibility === 1;
    const content = (
        <VStack w="100%" spacing="1.5rem" align="stretch">
            {!isPortrait && isPrivate && <PendingPlayersTable />}
            {!isPortrait && <InGamePlayersTable isPrivate={isPrivate} />}
            {isPortrait && isPrivate && <PendingPlayersSection />}
            {isPortrait && <InGamePlayersSection isPrivate={isPrivate} />}
        </VStack>
    );
    return (
        <GinzaSurface
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Players"
            content={content}
        />
    );
};

export default React.memo(PlayerManagement);
