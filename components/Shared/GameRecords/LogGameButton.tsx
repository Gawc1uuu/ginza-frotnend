import { Button } from '@chakra-ui/react';
import { HStack, Text } from '@chakra-ui/react';
import { FaFileAlt } from 'react-icons/fa';

interface LogGameButtonProps {
    onClick?: () => void;
    isDisabled?: boolean;
    isPortrait?: boolean;
    nonce?: number;
    [key: string]: any;
}

export function LogGameButton({
    onClick,
    isDisabled = false,
    isPortrait = false,
    nonce,
}: LogGameButtonProps) {
    const disabled = (typeof nonce === 'number' && nonce < 2) || isDisabled;
    return (
        <Button
            onClick={onClick}
            variant={'walletButton'}
            fontSize="12px"
            isDisabled={disabled}
            bg={disabled ? 'gray.700' : undefined}
            _hover={disabled ? {} : undefined}
            _active={disabled ? {} : undefined}
            width={isPortrait ? '36px' : '70px'}
            height="32px"
            px={2}
            py={1}
            borderRadius="8px"
        >
            {isPortrait ? (
                <FaFileAlt size={'16px'} color="white" />
            ) : (
                <HStack spacing={2}>
                    <Text>Log</Text>
                    <FaFileAlt size={'16px'} color="white" />
                </HStack>
            )}
        </Button>
    );
}

export default LogGameButton;
