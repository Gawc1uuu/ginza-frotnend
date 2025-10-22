'use client';

import {
    VStack,
    Text,
    Image,
    HStack,
    Stack,
    useBreakpointValue,
    IconButton,
    Box,
} from '@chakra-ui/react';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useRef } from 'react';
import React from 'react';

interface MobileInfoConfig {
    stepNumber: number;
    mobileImageSrc: string;
    description: string;
}

const MobileStepCard = ({ gameConfig }: { gameConfig: MobileInfoConfig }) => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    return (
        <VStack spacing={0}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                w={isPortrait ? '40px' : '48px'}
                h={isPortrait ? '40px' : '48px'}
                minW={isPortrait ? '40px' : '48px'}
                minH={isPortrait ? '40px' : '48px'}
                background="linear-gradient(138.64deg, rgba(8, 9, 30, 0.9) 8.24%, rgba(47, 28, 70, 0.9) 98.03%), radial-gradient(60.52% 85.11% at 9.86% 66.12%, rgba(35, 17, 72, 0.75) 0%, rgba(22, 9, 49, 0) 10%)"
                border="0.15rem solid #B794F4"
                borderRadius="0.75rem"
                fontWeight="800"
                fontSize={isPortrait ? '1.2rem' : '1.45rem'}
                color="brand.accentWhite"
                userSelect="none"
            >
                {gameConfig.stepNumber}
            </Box>

            <Text
                fontSize="md"
                transform="translateY(10px)"
                fontWeight="900"
                textAlign="center"
            >
                {gameConfig.description}
            </Text>

            <Image
                src={gameConfig.mobileImageSrc}
                w="40vw"
                height="48vw"
                maxHeight="380px"
                objectFit="contain"
                transform="translateY(5%) translateX(2%)"
                alignSelf="center"
                alignItems="center"
                userSelect="none"
                draggable={false}
            />
        </VStack>
    );
};

export const MobileInfoCard = () => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const [current, setCurrent] = React.useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const StackComponent =
        useBreakpointValue({ base: VStack, md: HStack }) || VStack;

    const gameConfigs: MobileInfoConfig[] = [
        {
            stepNumber: 1,
            mobileImageSrc: '/mobile1.png',
            description: 'GO TO GINZAGAMING.COM',
        },
        {
            stepNumber: 2,
            mobileImageSrc: '/mobile2.png',
            description: 'CLICK THE SHARE BUTTON',
        },
        {
            stepNumber: 3,
            mobileImageSrc: '/mobile3.png',
            description: 'CLICK "ADD TO HOME SCREEN"',
        },
    ];

    const goTo = (idx: number) => {
        setCurrent((idx + gameConfigs.length) % gameConfigs.length);
    };
    const goLeft = () => goTo(current - 1);
    const goRight = () => goTo(current + 1);

    // Swipe handlers
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
        const delta = touchEndX.current - touchStartX.current;
        if (Math.abs(delta) > 40) {
            if (delta > 0) goLeft();
            else goRight();
        }
    };

    // Portrait: Carousel
    if (isPortrait) {
        return (
            <VStack width="100%" alignItems="center" spacing="8px">
                <Text
                    fontSize={{ base: '1.85rem', xl: '2rem' }}
                    fontWeight="900"
                    textAlign="center"
                >
                    ENJOY POKER ON{' '}
                    <Text as="span" color="pink.500">
                        MOBILE
                    </Text>
                </Text>
                <Text
                    fontSize={{ base: '0.85rem', xl: '1.2rem' }}
                    fontWeight="600"
                    color="brand.white80"
                    alignContent="center"
                    whiteSpace="normal"
                    overflowWrap="break-word"
                    maxWidth={{
                        base: '320px',
                        sm: '400px',
                        lg: '520px',
                        xl: '720px',
                    }}
                    mx="auto"
                >
                    Enjoy mobile focused poker gameplay via our Progressive Web
                    App (PWA) that you can install directly from the browser.
                </Text>
                <HStack
                    mt="4"
                    spacing="0"
                    w="100%"
                    justify="center"
                    align="center"
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        minW="64px"
                    >
                        <IconButton
                            aria-label="Previous"
                            icon={<ChevronLeftIcon boxSize={8} color="white" />}
                            onClick={goLeft}
                            variant="solid"
                            size="md"
                            isRound
                            background="linear-gradient(138.64deg, rgba(8, 9, 30, 0.9) 8.24%, rgba(47, 28, 70, 0.9) 98.03%), radial-gradient(60.52% 85.11% at 9.86% 66.12%, rgba(35, 17, 72, 0.75) 0%, rgba(22, 9, 49, 0) 10%)"
                            border="2px solid #B794F4"
                            _hover={{}}
                            boxShadow="0 1px 4px 0 rgba(164, 123, 229, 0.15)"
                        />
                    </Box>
                    <Box
                        w="320px"
                        display="flex"
                        alignItems="flex-end"
                        justifyContent="center"
                        pb={0}
                        mb={0}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <MobileStepCard gameConfig={gameConfigs[current]} />
                    </Box>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        minW="64px"
                    >
                        <IconButton
                            aria-label="Next"
                            icon={
                                <ChevronRightIcon boxSize={8} color="white" />
                            }
                            onClick={goRight}
                            variant="solid"
                            size="md"
                            isRound
                            background="linear-gradient(138.64deg, rgba(8, 9, 30, 0.9) 8.24%, rgba(47, 28, 70, 0.9) 98.03%), radial-gradient(60.52% 85.11% at 9.86% 66.12%, rgba(35, 17, 72, 0.75) 0%, rgba(22, 9, 49, 0) 10%)"
                            border="2px solid #B794F4"
                            _hover={{}}
                            boxShadow="0 1px 4px 0 rgba(164, 123, 229, 0.15)"
                        />
                    </Box>
                </HStack>
                <HStack spacing={2} mt={8} justify="center">
                    {gameConfigs.map((_, idx) => (
                        <Box
                            key={idx}
                            w={current === idx ? 3.5 : 3}
                            h={current === idx ? 3.5 : 3}
                            borderRadius="full"
                            bg={current === idx ? '#F3F4F6' : 'gray.500'}
                            border={
                                current === idx ? '2px solid #B794F4' : 'none'
                            }
                            boxShadow={
                                current === idx ? '0 0 8px 2px #a47be5' : 'none'
                            }
                            transition="all 0.2s"
                        />
                    ))}
                </HStack>
            </VStack>
        );
    }

    // Desktop: Original layout
    return (
        <Stack width="100%" alignItems="center" spacing="16px">
            <Text
                fontSize={{ base: '1.75rem', xl: '2rem' }}
                fontWeight="900"
                textAlign="center"
            >
                ENJOY POKER ON{' '}
                <Text as="span" color="pink.500">
                    MOBILE
                </Text>
            </Text>
            <Text
                fontSize={{ base: '0.85rem', xl: '1.2rem' }}
                fontWeight="600"
                color="brand.white80"
                alignContent="center"
                whiteSpace="normal"
                overflowWrap="break-word"
                maxWidth={{ base: '360px', lg: '450px', xl: '620px' }}
                mx="auto"
            >
                Enjoy mobile focused poker gameplay via our Progressive Web App
                (PWA) that you can install directly from the browser.
            </Text>
            <StackComponent mt="32px" spacing="42px" w="100%">
                {gameConfigs.map((config, index) => (
                    <MobileStepCard key={index} gameConfig={config} />
                ))}
            </StackComponent>
        </Stack>
    );
};
