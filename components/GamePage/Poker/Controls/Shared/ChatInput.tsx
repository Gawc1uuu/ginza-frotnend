import { Input, InputGroup, InputRightElement, Box } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { useState } from 'react';

import { SendIcon } from './SendIcon';
import useViewer from '../../../../hooks/useViewer';
import { useWSMutation } from '../../../../websocket/hooks/useWSMutation';
import { WebsocketsMutations } from '../../../../../../../packages/shared/websockets.events';

interface ChatInputProps {
    gameId: string;
}

export const ChatInput = (props: ChatInputProps) => {
    const { gameId } = props;
    const { userId, isAuthenticated } = useViewer();
    const isPortrait = useBreakpointValue({ base: true, lg: false });
    const [message, setMessage] = useState<string>('');

    const sendMessageMutation = useWSMutation(WebsocketsMutations.sendMessage);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !isAuthenticated) return;
        setMessage('');
        await sendMessageMutation({
            gameId,
            message: message.trim(),
        });
    };

    const enabledColor = 'rgba(190, 205, 255, 0.92)';

    return (
        <form onSubmit={handleSubmit}>
            <Box
                mx={isPortrait ? "0.25rem" : "0"}
                position="relative"
                _before={{
                    content: '""',
                    position: 'absolute',
                    left: '0',
                    right: '0',
                    top: '0',
                    height: '4px',
                    borderRadius: '0.65rem 0.65rem 0 0',
                    background:
                        'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
                _focusWithin={{
                    _after: {
                        content: '""',
                        position: 'absolute',
                        left: '-6px',
                        right: '-6px',
                        bottom: '-8px',
                        top: '40%',
                        borderRadius: '0.9rem',
                        background:
                            'radial-gradient(80% 60% at 50% 100%, rgba(150,170,220,0.25) 0%, rgba(150,170,220,0) 70%)',
                        filter: 'blur(10px)',
                        pointerEvents: 'none',
                        zIndex: 0,
                    },
                }}
            >
                <InputGroup position="relative" zIndex={1}>
                    <Input
                        _placeholder={{
                            color: 'rgba(230, 235, 249, 0.55)',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                        }}
                        _hover={{}}
                        _focus={{
                            backgroundColor: 'brand.gray60',
                            boxShadow:
                                '0 0.02rem 0.05rem 0.05rem rgba(89, 170, 241, 0.8)',
                            _placeholder: {
                                opacity: 0,
                            },
                        }}
                        bg="brand.gray40"
                        // bg="linear-gradient(to bottom, rgba(88, 94, 101, 0.54), rgba(46, 46, 49, 0.56) 20%), rgba(11, 10, 10, 0.24)"
                        borderRadius="0.65rem"
                        boxShadow="0.0rem 0.02rem 0.03rem -0.1rem rgba(154, 193, 227, 0.7)"
                        fontSize="0.875rem"
                        fontWeight="bold"
                        height="2.6rem"
                        placeholder="Enter a message..."
                        size="sm"
                        textColor="brand.accentWhite"
                        value={message}
                        variant="filled"
                        onChange={(e) => setMessage(e.currentTarget.value)}
                    />
                    <InputRightElement
                        height="100%"
                        display="flex"
                        alignItems="center"
                    >
                        <SendIcon
                            color={
                                !message.trim() || !isAuthenticated
                                    ? 'gray'
                                    : enabledColor
                            }
                            boxSize="1.275rem"
                            cursor={
                                !message.trim() || !isAuthenticated
                                    ? 'not-allowed'
                                    : 'pointer'
                            }
                            onClick={
                                isAuthenticated && message.trim()
                                    ? handleSubmit
                                    : undefined
                            }
                            type={
                                isAuthenticated && message.trim()
                                    ? 'submit'
                                    : undefined
                            }
                        />
                    </InputRightElement>
                </InputGroup>
            </Box>
        </form>
    );
};
