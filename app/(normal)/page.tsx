'use client';

import { Box, useBreakpointValue, useToast } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { Suspense, useEffect, useRef } from 'react';

import { Hero } from '../../components/HomePage/Hero/Hero';

export const OpacityCover = ({
    opacity,
    blurAmount = 0,
}: {
    opacity: number;
    blurAmount?: number;
}) => (
    <Box
        w="100%"
        h="100%"
        bg={`rgba(0, 0, 0, ${opacity})`}
        position="absolute"
        top="0"
        left="0"
        right="0"
        backdropFilter={blurAmount > 0 ? `blur(${blurAmount}px)` : 'none'}
        pointerEvents="none"
    />
);

const StartPageContent: NextPage = () => {
    const toast = useToast();
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    return (
        <Box
            backgroundImage={`url('/home_bg4.webp')`}
            backgroundSize="cover"
            backgroundPosition="bottom"
            h="100vh"
            overflowY={isPortrait ? 'unset' : 'auto'}
        >
            <OpacityCover opacity={0.6} blurAmount={8} />
            <Hero />
        </Box>
    );
};

const StartPage: NextPage = () => (
    <Suspense
        fallback={
            <Box
                backgroundImage={`url('/home_bg4.webp')`}
                backgroundSize="cover"
                backgroundPosition="bottom"
                h="100vh"
                overflowY="auto"
            >
                <OpacityCover opacity={0.4} blurAmount={2} />
            </Box>
        }
    >
        <StartPageContent />
    </Suspense>
);

export default StartPage;
