import { Button } from '@chakra-ui/react';
import { HStack, Text } from '@chakra-ui/react';
import { RiShareForwardFill } from 'react-icons/ri';

interface ShareGameButtonProps {
    onClick?: () => void;
    isPortrait?: boolean;
    [key: string]: any;
}

export function ShareGameButton({
    onClick,
    isPortrait = false,
}: ShareGameButtonProps) {
    return (
        <Button
            onClick={onClick}
            variant={'walletButton'}
            fontSize="12px"
            borderRadius="8px"
            width={isPortrait ? '36px' : '70px'}
            height="32px"
            px={2}
            py={1}
        >
            {isPortrait ? (
                <RiShareForwardFill size={'16px'} color="white" />
            ) : (
                <HStack spacing={2}>
                    <Text>Share</Text>
                    <RiShareForwardFill size={'16px'} color="white" />
                </HStack>
            )}
        </Button>
    );
}

export default ShareGameButton;
