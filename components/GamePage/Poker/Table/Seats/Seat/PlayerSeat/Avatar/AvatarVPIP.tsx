import { Text, Box, useBreakpointValue } from '@chakra-ui/react';
import useGameData from '../../../../../../../hooks/useGameData';

export const PlayerVPIP = ({ player }: { player: any }) => {
    const { vpipArchive } = useGameData();
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const vpip =
        vpipArchive[player.player_id] &&
        vpipArchive[player.player_id].hands_played > 0
            ? Math.round(
                  (vpipArchive[player.player_id].vpip_count /
                      vpipArchive[player.player_id].hands_played) *
                      100,
              )
            : 0;

    return (
        <Box
            bg="brand.gray45"
            borderRadius="6.25rem"
            boxShadow="0 0 1.25px rgba(243, 248, 255, 0.95)"
            border={isPortrait ? '0.1vmax solid' : '0.1rem solid'}
            borderColor='brand.gray20'
            bottom={isPortrait ? '-0.4vmax' : '-0.4rem'}
            left={isPortrait ? '-1vmax' : '-0.75rem'}
            position="absolute"
            zIndex={1000}
            pointerEvents="none"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Text
                fontSize={isPortrait ? '1.15vmax' : '1.29vmin'}
                color="brand.accentWhite"
                py={isPortrait ? '0.35vmax' : '0.3vmin'}
                px={isPortrait ? '0.5vmax' : '0.5vmin'}
                variant="bold"
                letterSpacing="-0.01px"
                lineHeight="1"
                transform={isPortrait ? 'translateY(0.05vmax)' : 'none'}
            >
                {vpip}
            </Text>
        </Box>
    );
};

export default PlayerVPIP;
