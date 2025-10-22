import {
    VStack,
    HStack,
    Text,
    Image,
    Button,
    Flex,
    Box,
} from '@chakra-ui/react';
import { UserDto } from '../../../../../packages/shared/shared.types';

export const ProfileInfo = ({
    userData,
}: {
    userData: UserDto;
    currentUser?: UserDto;
}) => {
    const isProfileAffiliate =
        userData.affiliate && Object.keys(userData.affiliate).length > 0;

    return (
        <HStack
            alignItems="flex-start"
            spacing="1rem"
            border="none"
            background="linear-gradient(180deg, rgba(190, 204, 216, 0.15) 0%, rgba(24, 26, 32, 0.60) 100%), rgba(15, 17, 24, 0.70)"
            borderRadius="1rem"
            p="16px"
            position="relative"
        >
            {isProfileAffiliate && (
                <Button
                    variant='outline'
                    position="absolute"
                    top="16px"
                    right="16px"
                    size="sm"
                    color='white'
                    borderColor={isProfileAffiliate ? 'purple.300' : 'gray.400'}
                    // bg={
                    //     isProfileAffiliate
                    //         ? 'linear-gradient(351.96deg, #B37FEB -20.9%, rgba(210, 174, 245, 0) 20%, #EFDBFF 96%), #4B2B82'
                    //         : 'gray.600'
                    // }
                    _hover={{}}
                    cursor="default"
                    pointerEvents="none"
                >
                    Affiliate
                </Button>
            )}
            <Box
                boxSize="7.5rem"
                borderRadius="full"
                p="0.3rem"
                bg="linear-gradient(180deg, rgba(192, 156, 255, 0.95) 0%, rgba(174, 118, 242, 0.95) 55%, rgba(142, 69, 133, 0.95) 100%)"
                flexShrink={0}
            >
                <Box
                    w="100%"
                    h="100%"
                    borderRadius="full"
                    overflow="hidden"
                    bg="black"
                    boxShadow="0 0 0 2px rgba(0,0,0,0.95), 0 0 12px rgba(142, 69, 133, 0.5)"
                >
                    <Image
                        src={userData.imageUrl}
                        alt="User Avatar"
                        boxSize="100%"
                        objectFit="cover"
                        draggable={false}
                    />
                </Box>
            </Box>
            <VStack align="start" w="full" justify="space-between" h="7.5rem">
                <VStack align="start" spacing="0.25rem" pl="0.5rem">
                    <Text size="lg" fontWeight="700" color="white">
                        {userData.username}
                    </Text>
                    <Text size="md" color="white" opacity="0.5">
                        {`Joined ${new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                    </Text>
                    {userData.twitterUsername && (
                        <HStack align="center" spacing="0.5rem">
                            <Image
                                src="/TwitterLogo.png" // Ensure you have the correct path to the X logo
                                alt="X Logo"
                                width="0.9rem"
                                height="0.9rem"
                            />
                            <Text
                                size="md"
                                fontWeight="600"
                                color="blue.400"
                                as="a"
                                href={`https://x.com/${userData.twitterUsername}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.textDecoration =
                                        'underline')
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.textDecoration =
                                        'none')
                                }
                            >
                                @{userData.twitterUsername}
                            </Text>
                        </HStack>
                    )}
                </VStack>
            </VStack>
        </HStack>
    );
};
