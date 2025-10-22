import { VStack, Box, Stack, Text, Link, HStack, Icon } from '@chakra-ui/react';

import { GameMainCard } from './Shared/GameMainCard';
import { ActiveGamesCard } from './Shared/ActiveGamesCard';
import { FAQCard } from './Shared/FAQCard';
import { FeatureInfoCard } from './Shared/FeatureInfoCard';
import { MobileInfoCard } from './Shared/MobileInfoCard';
import NewsletterCard2 from './Shared/NewsletterCard2';

export const Hero: React.FC = () => {
    return (
        <VStack
            // h="calc(100vh - 4.125rem)"
            w="100%"
            maxW="1400px"
            p={{ base: '16px', lg: '24px' }}
            align="center"
            position="relative"
            gap="16px"
            mx="auto"
            justify="flex-start"
            alignItems="center"
        >
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                spacing="24px"
                w="100%"
                maxW="1600px"
                align="flex-start"
                alignItems="stretch"
                mb="5vw"
            >
                {/* Left column: GINZA POKER and Community Events (NewsletterCard2) in landscape, stacked in portrait */}
                <Box w={{ base: '100%', lg: '60%' }} h="fit-content">
                    <VStack spacing="1.5rem" align="stretch">
                        <GameMainCard />
                        {/* Show Community Events below GINZA POKER only in landscape */}
                        <Box display={{ base: 'none', lg: 'block' }}>
                            <NewsletterCard2 />
                        </Box>
                    </VStack>
                </Box>
                {/* Right column: Active Games (ActiveGamesCard) in landscape, stacked in portrait */}
                <Box
                    w={{ base: '100%', lg: '40%' }}
                    position="relative"
                    borderRadius="16px"
                    // maxH={{base: "650px", md: "650px", lg: "860px"}}
                >
                    <ActiveGamesCard />
                    {/* Show Community Events below Active Games only in portrait */}
                    <Box display={{ base: 'block', lg: 'none' }} mt="1.5rem">
                        <NewsletterCard2 />
                    </Box>
                </Box>
            </Stack>
            <Box
                w="100%"
                maxW="1200px"
                borderRadius="16px"
                position="relative"
                mb="9vw"
            >
                <FeatureInfoCard />
            </Box>
            <Box
                w="100%"
                maxW="1200px"
                borderRadius="16px"
                position="relative"
                mb="9vw"
            >
                <MobileInfoCard />
            </Box>
            <Box
                w="100%"
                maxW="1200px"
                borderRadius="16px"
                position="relative"
                mb="6vw"
            >
                <FAQCard />
            </Box>

            <Box w="100%" textAlign="center">
                <Text color="whiteAlpha.700" fontSize="sm" lineHeight="1.6">
                    Ginzagaming is owned and operated by Collective Catsino of
                    the
                </Text>
                <Text color="whiteAlpha.700" fontSize="sm" lineHeight="1.6">
                    People Sociedad de Responsabilidad Limitada (CCPSRL), a
                    limited
                </Text>
                <Text color="whiteAlpha.700" fontSize="sm" lineHeight="1.6">
                    liability company incorporated in the Republic of Costa
                    Rica.
                </Text>
            </Box>
            {/* Social Icons Section */}
            <Box w="100%" textAlign="center" my={2}>
                <HStack spacing="32px" justify="center">
                    <Link
                        href="https://twitter.com/ginzagaming"
                        isExternal
                        aria-label="Twitter"
                    >
                        <Icon
                            as={require('react-icons/fa').FaTwitter}
                            boxSize={6}
                            color="whiteAlpha.800"
                            _hover={{ color: 'purple.300' }}
                        />
                    </Link>
                    <Link
                        href="https://t.me/CCPGaming"
                        isExternal
                        aria-label="Telegram"
                    >
                        <Icon
                            as={require('react-icons/fa').FaTelegramPlane}
                            boxSize={6}
                            color="whiteAlpha.800"
                            _hover={{ color: 'purple.300' }}
                        />
                    </Link>
                    <Link
                        href="https://discord.gg/ccpgaming"
                        isExternal
                        aria-label="Discord"
                    >
                        <Icon
                            as={require('react-icons/fa').FaDiscord}
                            boxSize={6}
                            color="whiteAlpha.800"
                            _hover={{ color: 'purple.300' }}
                        />
                    </Link>
                </HStack>
            </Box>
            <Box
                w="100%"
                textAlign="center"
                mb="6vw"
                // mb={{ base: '48vw', lg: '12vw' }}
            >
                <Text color="whiteAlpha.700" fontSize="sm" textAlign="center">
                    Copyright 2025 CCPSRL.
                </Text>
                <Text color="whiteAlpha.700" fontSize="sm" textAlign="center">
                    All rights here totally reserved.
                </Text>
                <Stack direction="row" spacing="16px" justify="center" mt="8px">
                    <Link
                        href="https://docs.ginzagaming.com/privacy-policy"
                        isExternal
                        color="whiteAlpha.800"
                        fontWeight="600"
                        fontSize="md"
                        _hover={{
                            textDecoration: 'underline',
                            color: 'whiteAlpha.800',
                        }}
                        transition="all 0.2s"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="https://docs.ginzagaming.com/terms-of-service-1"
                        isExternal
                        color="whiteAlpha.800"
                        fontWeight="600"
                        fontSize="md"
                        _hover={{
                            textDecoration: 'underline',
                            color: 'whiteAlpha.800',
                        }}
                        transition="all 0.2s"
                    >
                        Terms and Conditions
                    </Link>
                </Stack>
            </Box>
        </VStack>
    );
};
