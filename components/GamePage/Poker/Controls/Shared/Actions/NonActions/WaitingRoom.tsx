import {
    Button,
    HStack,
    Text,
    VStack,
    Box,
    IconButton,
} from '@chakra-ui/react';
import { useWaitingRoom } from '../../useWaitingRoom';
import { CopyIcon, TimeIcon } from '@chakra-ui/icons';

export const WaitingRoom = () => {
    const { isHost, url, copyURL } = useWaitingRoom();

    return (
        <>
            <VStack
                h="100%"
                paddingX="1.5rem"
                my="auto"
                w="100%"
                justifyContent="center"
                spacing="0.5rem"
                // border="0.1rem solid"
                // borderColor="rgba(232, 230, 230, 0.79)"
                bg="brand.primaryGray"
                // bg="linear-gradient(180deg, rgba(33, 33, 36, 0.54) 0%, rgba(33, 34, 36, 0.23) 50%),rgba(18, 18, 19, 0.82)"
                borderRadius="0.75rem"
                p="1rem"
            >
                <HStack
                    spacing="0.5rem"
                    alignItems="center"
                    justifyContent="center"
                    mb="1rem"
                >
                    {!isHost && (
                        <TimeIcon color="brand.white80" w="1.2rem" h="1.2rem" />
                    )}
                    <Text
                        size="0.75rem"
                        variant="bold"
                        textAlign="center"
                        whiteSpace="pre-wrap"
                        color="brand.white80"
                    >
                        {isHost
                            ? 'Press "Start Game" above to begin!'
                            : 'Waiting for the host to start the game...'}
                    </Text>
                </HStack>
                <Text
                    size="1rem"
                    variant="bold"
                    textAlign="center"
                    whiteSpace="pre-wrap"
                    fontWeight="600"
                    color="gray.400"
                    fontSize="0.95rem"
                >
                    Share the link to invite your friends and earn rewards!
                </Text>
                <HStack
                    spacing=".5rem"
                    w="100%"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box position="relative" w="75%" maxW="100%">
                        <Box
                            bg="rgba(25, 26, 27, 0.35)"
                            border="0.075rem solid"
                            // borderColor="rgba(153, 166, 183, 0.25)"
                            // boxShadow="0 0 -2rem 0.5rem rgba(6, 7, 7, 0.15)"
                            // border="0.1rem solid"
                            // borderColor="rgba(172, 187, 208, 0.35)"
                            borderColor="gray.500"
                            borderRadius="0.75rem"
                            paddingX="1.5rem"
                            paddingY="0.8rem"
                            h="3.1rem"
                            pr="3rem"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            overflow="hidden"
                        >
                            <Text
                                textColor="whiteAlpha.700"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textAlign="left"
                                fontWeight="400"
                                letterSpacing="-0.01rem"
                                fontSize="0.95rem"
                                fontStyle="italic"
                                flex={1}
                                minW={0}
                            >
                                {url}
                            </Text>
                        </Box>
                        <Box
                            position="absolute"
                            right="0.35rem"
                            top="50%"
                            transform="translateY(-50%)"
                            bg="rgba(123, 138, 190, 0.64)"
                            borderRadius="0.5rem"
                            w="2.15rem"
                            h="2.15rem"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            // border="1px solid"
                            // borderColor="rgba(255,255,255,0.25)"
                        >
                            <IconButton
                                aria-label="Copy referral link"
                                onClick={copyURL}
                                // variant="unstyled"
                                variant="link"
                                h="100%"
                                w="100%"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                icon={
                                    <CopyIcon
                                        color="whiteAlpha.800"
                                        fontWeight="bold"
                                        w="1rem"
                                        h="1rem"
                                        transform="scaleX(-1)"
                                    />
                                }
                            />
                        </Box>
                    </Box>
                </HStack>
            </VStack>
        </>
    );
};

export default WaitingRoom;
