import { Button, Icon } from '@chakra-ui/react';
import LedgerTable from './LedgerTable';
import { DownloadIcon } from '@chakra-ui/icons';
import { GinzaSurface } from '../GinzaModal';

interface LedgerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DownloadLedgerButton = () => {
    return (
        <Button
            variant="walletButton"
            rightIcon={<Icon as={DownloadIcon} />}
            onClick={() => {}}
        >
            Download Ledger
        </Button>
    );
};

export const LedgerModal: React.FC<LedgerModalProps> = ({
    isOpen,
    onClose,
}: LedgerModalProps) => {
    return (
        <GinzaSurface
            isOpen={isOpen}
            onClose={onClose}
            title="Session Ledger"
            content={<LedgerTable />}
            primaryButton={<DownloadLedgerButton />}
        />
    );
};

export default LedgerModal;
