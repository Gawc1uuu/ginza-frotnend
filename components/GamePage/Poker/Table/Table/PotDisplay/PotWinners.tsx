import {
    Text,
    VStack,
    Box,
    HStack,
    Image,
    useBreakpointValue,
} from '@chakra-ui/react';
import { WinnerIcon } from '../WinnerIcon';

import { useQueries } from '@tanstack/react-query';
import { useMoneyDisplay } from '../../../../../Shared/MoneyDisplay';
import { useHttpClient } from '../../../../../websocket/hooks/useHttpClient';
import {
    HttpNamespaces,
    HttpQueries,
} from '../../../../../../../../packages/shared/http.events';

type PotType = 'MAIN' | 'SIDE';

interface WinnerAvatarsProps {
    winners?: string[];
    potType: PotType;
    amount: bigint;
    position?: 'left' | 'right' | 'center';
    isPortraitAndBothPots?: boolean;
    isMainPot?: boolean;
}

const PotTypeToText = {
    MAIN: (winnerCount: number) =>
        winnerCount > 1 ? 'MAIN POT WINNERS' : 'MAIN POT WINNER',
    SIDE: (winnerCount: number) =>
        winnerCount > 1 ? 'SIDE POT WINNERS' : 'SIDE POT WINNER',
};

// Text colors to match the comp
const LABEL_GRAY = '#C9CFD7';
const AMOUNT_GREEN = '#3DE3A4';

// Inner background: dark top → cool inky bottom
const INNER_BG_GRADIENT = 'linear-gradient(180deg, #11181F 0%, #0B1116 100%)';

export const PotWinners = ({
    winners,
    potType,
    amount,
    position = 'center',
    isPortraitAndBothPots = false,
    isMainPot = false,
}: WinnerAvatarsProps) => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const size = isPortrait ? '3vmax' : '3vmin';
    const winnerCount = winners?.length || 0;
    const winnerText = PotTypeToText[potType](winnerCount);
    const httpClient = useHttpClient();
    const userQueries = useQueries({
        queries:
            winners?.map((player_id) => ({
                queryKey: ['user', player_id],
                queryFn: () =>
                    httpClient.query(
                        HttpNamespaces.USER,
                        HttpQueries.getUserByUserId,
                        {
                            userId: player_id,
                        },
                    ),
            })) ?? [],
    });
    const moneyDisplay = useMoneyDisplay(BigInt(amount));
    let left = '50%';
    let transform = 'translate(-50%, -50%)';
    let top = '22%';
    if (isPortrait) {
        if (isMainPot) top = '20%';
        else if (isPortraitAndBothPots) top = '59%';
        else top = '22%';
    } else {
        top = '21%';
        if (position === 'left') left = '40%';
        else if (position === 'right') left = '60%';
    }

    return (
        <Box
            position="absolute"
            top={top}
            left={left}
            transform={transform}
            zIndex={2000}
        >
            {/* SINGLE CONTAINER WITH GRADIENT BORDER (top dark gray → bottom aqua) */}
            <HStack
                alignItems="center"
                borderRadius="1.5rem"
                pl="2.5rem"
                pr="2rem"
                pt="0.3rem"
                bg={INNER_BG_GRADIENT}
                backdropFilter="blur(10px)"
                position="relative"
                overflow="hidden"
                boxShadow="0 6px 10px rgba(0, 0, 0, 0.35)"
                border="2px solid transparent"
                sx={{
                    backgroundImage: `radial-gradient(130% 155% at 12% 10%, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.05) 32%, rgba(194,195,196,0) 58%), radial-gradient(115% 135% at 88% 8%, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 24%, rgba(255,255,255,0) 50%), ${INNER_BG_GRADIENT}, radial-gradient(122% 122% at 7% 2%, rgba(155, 183, 190, 0.36) 0%, rgba(160, 200, 214, 0.26) 18%, rgba(201, 207, 215, 0.1) 50%), linear-gradient(180deg, rgba(28, 38, 46, 0.94) 0%, rgba(23, 28, 33, 0.86) 60%, rgba(0, 217, 189, 0.72) 100%)`,
                    backgroundOrigin:
                        'padding-box, padding-box, padding-box, border-box, border-box',
                    backgroundClip:
                        'padding-box, padding-box, padding-box, border-box, border-box',
                    backgroundBlendMode:
                        'screen, screen, normal, screen, normal',
                }}
            >
                {winners?.map((player_id, index) => (
                    <Box
                        marginLeft="-1.875rem"
                        key={player_id}
                        zIndex={winners.length + index}
                        position="relative"
                        display="inline-block"
                    >
                        <Box position="relative" display="inline-block">
                            {potType === 'MAIN' && (
                                <Box
                                    position="absolute"
                                    top="-30%"
                                    left="-25%"
                                    zIndex={1}
                                    width="60%"
                                    height="60%"
                                >
                                    <WinnerIcon width="100%" height="100%" />
                                </Box>
                            )}
                            <Image
                                src={
                                    userQueries[index]?.data?.imageUrl ??
                                    undefined
                                }
                                alt="User Avatar"
                                width={size}
                                height={size}
                                borderRadius="50%"
                                objectFit="cover"
                            />
                        </Box>
                    </Box>
                ))}

                <VStack spacing="-4px">
                    <Text
                        pt="0.2125rem"
                        fontWeight={800}
                        fontSize={isPortrait ? '1.25vmax' : '1.35vmin'}
                        color="brand.accentWhite"
                        letterSpacing="0.02em"
                    >
                        {winnerText}
                    </Text>
                    {winnerCount > 0 ? (
                        <VStack
                            spacing={isPortrait ? '0.2vmax' : '0.2vmin'}
                            pb={isPortrait ? '0.6vmax' : '0.6vmin'}
                        >
                            {winners?.map((player_id, index) => (
                                <HStack
                                    key={player_id}
                                    spacing={isPortrait ? '0.6vmax' : '0.6vmin'}
                                >
                                    <Text
                                        fontWeight={600}
                                        fontSize={
                                            isPortrait ? '1.25vmax' : '1.25vmin'
                                        }
                                        color={'brand.white90'}
                                        maxW={isPortrait ? '22vmax' : '22vmin'}
                                        isTruncated
                                    >
                                        {userQueries[index]?.data?.username ??
                                            'Player'}
                                    </Text>
                                    <Text
                                        fontWeight={700}
                                        fontSize={
                                            isPortrait ? '1.25vmax' : '1.25vmin'
                                        }
                                        color={AMOUNT_GREEN}
                                    >
                                        {moneyDisplay}
                                    </Text>
                                </HStack>
                            ))}
                        </VStack>
                    ) : (
                        <Text
                            pb="0.3125rem"
                            fontWeight={700}
                            fontSize={isPortrait ? '1.3vmax' : '1.3vmin'}
                            color={AMOUNT_GREEN}
                        >
                            {moneyDisplay}
                        </Text>
                    )}
                </VStack>
            </HStack>
        </Box>
    );
};
