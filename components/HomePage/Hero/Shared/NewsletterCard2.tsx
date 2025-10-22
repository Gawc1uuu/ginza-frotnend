import { Box, HStack, Image, Text } from '@chakra-ui/react';

const NewsletterCard2 = () => {
    return (
        <Box w="100%">
            <HStack align="center" spacing={2} mb={2} mt={2}>
                <Image src="/NEWS_ICON.webp" alt="News" boxSize="36px" />
                <Text
                    color="brand.textWhite"
                    fontSize="1.4rem"
                    fontWeight="800"
                    p="0.25rem 0"
                    textAlign="left"
                >
                    Community Updates
                </Text>
            </HStack>
            <Box
                w="100%"
                display="flex"
                flexDirection={{ base: 'column', md: 'row' }}
                gap={4}
                alignItems="stretch"
            >
                <Box
                    border="1px solid"
                    sx={{
                        borderImageSource:
                            'linear-gradient(103.51deg, rgba(95, 89, 173, 0.2) -4.5%,rgb(86, 111, 169) 82.89%,rgb(192, 94, 143) 106.77%)',
                        borderImageSlice: 5,
                        borderRadius: '25px',
                    }}
                    flex="1"
                    w={{ base: '100%', md: '50%' }}
                    display="flex"
                    alignItems="stretch"
                >
                    <Image
                        src="/AffiliateEvent.jpg"
                        alt="Affiliate Event"
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        userSelect="none"
                        draggable={false}
                    />
                </Box>
                <Box
                    border="1px solid"
                    sx={{
                        borderImageSource:
                            'linear-gradient(103.51deg, rgba(87, 52, 130, 0.2) -4.5%,rgb(113, 78, 155) 82.89%,rgb(58, 84, 141) 106.77%)',
                        borderImageSlice: 1,
                    }}
                    flex="1"
                    w={{ base: '100%', md: '50%' }}
                    display="flex"
                    alignItems="stretch"
                >
                    <Image
                        src="/PublicGamesEvent.jpg"
                        alt="Public Games Event"
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        userSelect="none"
                        draggable={false}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default NewsletterCard2;
