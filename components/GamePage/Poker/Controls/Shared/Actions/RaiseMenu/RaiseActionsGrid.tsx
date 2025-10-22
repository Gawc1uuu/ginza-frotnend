import { Grid, GridItem, Text, Box, Show } from '@chakra-ui/react';

import { formatMicroDollars } from '../../../../../../utils/formatMoney';
import { useRaiseActions } from './hooks/useRaiseActions';
import { useGetPlayerRaise } from '../../../../../../hooks/useGetPlayerRaise';
import useGameData from '../../../../../../hooks/useGameData';

interface RaiseActionsGridProps {
    setValue: (value: number, index: number) => void;
    selectedActionIndex: number | null;
    displayInBigBlinds?: boolean;
    bigBlindValue?: number;
    isPortrait?: boolean;
}

export const RaiseActionsGrid = ({
    setValue,
    selectedActionIndex,
    displayInBigBlinds = false,
    bigBlindValue = 1000000,
    isPortrait = true,
}: RaiseActionsGridProps) => {
    const { raiseActions } = useRaiseActions();
    const { maxRaise } = useGetPlayerRaise();
    const { gameSettings, raiseOptions } = useGameData();
    const isPLO = gameSettings?.game_mode === 1; // 1 is PLO
    const potLimit = raiseOptions?.pot_raise || 0;

    // Format the value based on display preference
    const formatValue = (value: number, actionName?: string): string => {
        if (displayInBigBlinds) {
            const bbValue = value / bigBlindValue;
            if (actionName === 'Min') {
                // Round up to 2 decimal places for Min
                const roundedUp = Math.ceil(bbValue * 100) / 100;
                return `${roundedUp.toFixed(2)} BB`;
            } else {
                // For Pot and others, truncate
                const truncated = Math.trunc(bbValue * 100) / 100;
                return `${truncated.toFixed(2)} BB`;
            }
        }
        return `$${formatMicroDollars(value)}`;
    };

    // Filter out "All In" option for PLO if it exceeds pot limit
    const filteredActions = raiseActions?.filter((action, index) => {
        if (action.name === 'All In' && isPLO && maxRaise > potLimit) {
            return false;
        }
        return true;
    });

    const selectedBg =
        'linear-gradient(135deg,rgba(127, 84, 169, 0.71) 0%,rgba(69, 43, 93, 0.84) 100%)';
    const selectedBorder = '#522C70';
    const defaultLandscapeBorder = 'rgba(57, 60, 66, 0.89)';
    return (
        <Grid
            w="100%"
            templateColumns={`repeat(${filteredActions?.length || 1}, 1fr)`}
            gap={2}
        >
            {filteredActions?.map((action, index) => {
                const isSelected = index === selectedActionIndex;
                const isDisabled = action.value > maxRaise;
                // Responsive sizing
                const px = isPortrait ? '0.25rem' : '0.1rem';
                const py = isPortrait ? '0.35rem' : '0.2rem';
                const fontSize = isPortrait ? 'sm' : 'sm';
                const landscapeTextColor = !isPortrait
                    ? 'whiteAlpha.700'
                    : isSelected
                      ? 'brand.accentWhite'
                      : isDisabled
                        ? 'brand.white50'
                        : 'brand.white70';
                const landscapeBg = !isPortrait
                    ? isSelected
                        ? selectedBg
                        : 'linear-gradient(135deg,rgb(46, 47, 50) 0%,rgb(66, 66, 68) 100%)'
                    : isSelected
                      ? selectedBg
                      : isDisabled
                        ? 'brand.gray50'
                        : 'linear-gradient(135deg,rgb(43, 46, 53) 0%,rgb(54, 57, 61) 100%)';
                const landscapeBorder = !isPortrait
                    ? isSelected
                        ? 'rgba(55, 23, 76, 0.5)'
                        : isDisabled
                          ? 'rgba(180, 180, 200, 0.5)'
                          : 'rgba(55, 23, 76, 0.2)'
                    : isSelected
                      ? 'rgb(55, 23, 76)'
                      : isDisabled
                        ? 'rgba(24, 27, 32, 0.5)'
                        : 'rgba(57, 60, 66, 0.89)';
                const valueFontSize = !isPortrait ? 'xs' : 'sm';
                return (
                    <GridItem key={index}>
                        <Box
                            background={landscapeBg}
                            cursor={isDisabled ? 'not-allowed' : 'pointer'}
                            px={px}
                            py={py}
                            textAlign="center"
                            onClick={() => {
                                if (!isDisabled) {
                                    if (
                                        displayInBigBlinds &&
                                        isPLO &&
                                        action.name === 'Pot'
                                    ) {
                                        // Truncate to 2 decimals in BB, then convert back to microdollars
                                        const bbValue =
                                            action.value / bigBlindValue;
                                        const truncatedBB =
                                            Math.trunc(bbValue * 100) / 100;
                                        const truncatedValue = Math.round(
                                            truncatedBB * bigBlindValue,
                                        );
                                        setValue(truncatedValue, index);
                                    } else {
                                        setValue(action.value, index);
                                    }
                                }
                            }}
                            boxSizing="border-box"
                            border="1px solid"
                            borderColor={
                                isSelected
                                    ? selectedBorder
                                    : isDisabled
                                      ? !isPortrait
                                          ? 'rgba(180, 180, 200, 0.1)'
                                          : 'rgba(24, 27, 32, 0.5)'
                                      : !isPortrait
                                        ? defaultLandscapeBorder
                                        : 'rgba(57, 60, 66, 0.89)'
                            }
                            borderRadius="0.5rem"
                            _hover={{
                                borderColor: isDisabled
                                    ? !isPortrait
                                        ? 'rgba(180, 180, 200, 0.4)'
                                        : 'rgba(24, 27, 32, 0.4)'
                                    : selectedBorder,
                                background:
                                    isSelected || isDisabled
                                        ? landscapeBg
                                        : selectedBg,
                                // '& > *': {
                                //     color: isDisabled
                                //         ? 'brand.white50'
                                //         : (!isPortrait ? 'whiteAlpha.700' : 'brand.accentWhite'),
                                // },
                            }}
                            _active={{
                                borderColor: isDisabled
                                    ? !isPortrait
                                        ? 'rgba(180, 180, 200, 0.4)'
                                        : 'rgba(24, 27, 32, 0.4)'
                                    : selectedBorder,
                                background:
                                    isSelected || isDisabled
                                        ? landscapeBg
                                        : selectedBg,
                            }}
                            opacity={isDisabled ? 0.7 : 1}
                        >
                            <Text
                                size={fontSize}
                                textColor={landscapeTextColor}
                                fontWeight="bold"
                            >
                                {action.name}
                            </Text>
                            <Show above="xl">
                                <Text
                                    size={valueFontSize}
                                    variant="bold"
                                    textColor={
                                        isSelected
                                            ? 'brand.accentWhite'
                                            : isDisabled
                                              ? 'brand.white50'
                                              : 'brand.white70'
                                    }
                                >
                                    {formatValue(action.value, action.name)}
                                </Text>
                            </Show>
                        </Box>
                    </GridItem>
                );
            })}
        </Grid>
    );
};
