import { Box, Flex, useDisclosure } from '@chakra-ui/react';

import { useUserStatus } from '../../../../../hooks/useUserStatus';
import { useIsPendingPlayer } from '../../../../../hooks/useIsPendingPlayer';

import WaitingRoom from '../../Shared/Actions/NonActions/WaitingRoom';
import ActionBox from '../../Shared/Actions/ActionBox/ActionBox';
import RaiseMenu from '../../Shared/Actions/RaiseMenu/RaiseMenu';
import SpectatorBox from '../../Shared/Actions/NonActions/SpectatorBox';
import { PendingBox } from '../../Shared/Actions/NonActions/PendingBox';
import { useIsInGame } from '../../../../../hooks/useIsInGame';
import AwayBox from '../../Shared/Actions/NonActions/AwayBox';
import { keyframes } from '@emotion/react';

export const ActionPanel = () => {
    const { isWinner, isSpectator, isCurrentDecidingPlayer, isAway } =
        useUserStatus();
    const isPendingPlayer = useIsPendingPlayer();
    const {
        isOpen: isRaiseMenuOpen,
        onOpen: onOpenRaiseMenu,
        onClose: onCloseRaiseMenu,
    } = useDisclosure();

    const isInGame = useIsInGame();

    const outerBg = isWinner
        ? 'brand.vividGreen'
        : isCurrentDecidingPlayer
          ? 'rgba(170, 186, 205, 0.9)'
          : 'brand.gray30';

    const innerBg = isWinner
        ? 'brand.primaryGray'
        : isCurrentDecidingPlayer
          ? 'brand.primaryGray'
          : 'brand.darkerBlueGray';

    // TODO: revisit decision between 'rgba(202, 235, 237, 1.0)' and 'rgba(172, 211, 237, 1.0)'
    const shouldGlow = isWinner || isCurrentDecidingPlayer;
    const glowColor = isWinner ? '#66F28D' : 'rgba(202, 235, 237, 1.0)';

    const borderGlowAnimation = shouldGlow
        ? `${keyframes`
            0%, 100% {
                filter: drop-shadow(0 0 2.5px ${glowColor}) drop-shadow(0 0 5px ${glowColor});
            }
        `} 2s ease-in-out infinite`
        : undefined;

    const shouldSpectate = isSpectator && isInGame && !isPendingPlayer;
    const shouldShowActions =
        isInGame &&
        !isRaiseMenuOpen &&
        !isSpectator &&
        !isPendingPlayer &&
        !isAway;
    const shouldShowWaitingRoom =
        !isInGame && !isPendingPlayer && !shouldSpectate;

    const remValue = 3;
    const heightValue =
        Math.sqrt(remValue * remValue + remValue * remValue) + 'rem';

    return (
        <Box
            h="100%"
            w="100%"
            // bg="brand.darkerBlueGray"
            // bg="linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.0) 100%), #0C0E18"
            // bg="linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(69, 60, 60, 0.81) 100%), #0C0E18"
            // bg="linear-gradient(180deg, rgba(46, 47, 52, 0.54) 0%, rgba(43, 49, 61, 0.23) 50%),rgb(14, 15, 20)"
            // bg="linear-gradient(180deg, rgba(35, 36, 42, 0.54) 0%, rgba(40, 43, 49, 0.23) 50%),rgb(12, 12, 16)"
            // fill="rgba(47, 51, 58, 0.50)"
            // stroke="#484E59"
            filter="drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.5))"
            animation={borderGlowAnimation}
            borderRadius="0.85rem"
            border="0.05rem solid"
            borderColor="rgba(255, 255, 255, 0.1)"
        >
            <Box
                h="100%"
                bg={outerBg}
                padding={'0.125rem'}
                borderRadius="0.85rem"
            >
                <Flex
                    alignItems="center"
                    h="100%"
                    bg={innerBg}
                    borderRadius="0.85rem"
                >
                    {shouldSpectate && <SpectatorBox />}
                    {shouldShowActions && (
                        <ActionBox
                            onOpenRaiseMenu={onOpenRaiseMenu}
                            onCloseRaiseMenu={onCloseRaiseMenu}
                        />
                    )}
                    {isRaiseMenuOpen && (
                        <RaiseMenu onCloseRaiseMenu={onCloseRaiseMenu} />
                    )}
                    {shouldShowWaitingRoom && !isAway && <WaitingRoom />}
                    {isPendingPlayer && <PendingBox />}
                    {isAway && <AwayBox />}
                </Flex>
            </Box>
        </Box>
    );
};

export default ActionPanel;
