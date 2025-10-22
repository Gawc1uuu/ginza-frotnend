import {
    SliderThumb,
    SliderFilledTrack,
    Slider,
    NumberInput,
    NumberInputField,
    VStack,
    SliderTrack,
    HStack,
    Box,
    Button,
    useBreakpointValue,
    Text,
} from '@chakra-ui/react';
import { useEffect, useState, useRef, useCallback } from 'react';

import { RaiseActionsGrid } from './RaiseActionsGrid';
import APIButton from '../../../../../../Shared/APIButton';
import { playerAction } from '../../../../../../../client/sdk.gen';
import { Action } from '../../../../../../../client/types.gen';
import { useHotkeys } from 'react-hotkeys-hook';
import useGameData from '../../../../../../hooks/useGameData';
import useHasPhysicalKeyboard from '../../../../../../hooks/useHasPhysicalKeyboard';
import { useGetPlayerRaise } from '../../../../../../hooks/useGetPlayerRaise';
import { useActionButtons } from '../../../../../../hooks/useActionButtons';
import { useGetCurrentPlayer } from '../../../../../../hooks/useGetCurrentPlayer';
import useViewer from '../../../../../../hooks/useViewer';
import { formatMicroDollars } from '../../../../../../utils/formatMoney';

const RaiseMenu: React.FC<{ onCloseRaiseMenu: () => void }> = ({
    onCloseRaiseMenu,
}) => {
    const hasPhysicalKeyboard = useHasPhysicalKeyboard();
    const { streetPot, gameId, gameSettings, raiseOptions } = useGameData();
    const { minRaise, maxRaise } = useGetPlayerRaise();
    const currentPlayer = useGetCurrentPlayer();
    const currentUserAmount = currentPlayer?.amount || 0;
    const currentUserBet = currentPlayer?.bet_amount || 0;
    const { isMinRaise } = useGetPlayerRaise();

    const isPLO = gameSettings?.game_mode === 1; // 1 is PLO
    const potLimit = raiseOptions?.pot_raise || 0;

    const { isCurrentlyDecidingPlayer } = useActionButtons(onCloseRaiseMenu);
    const inputRef = useRef<HTMLInputElement>(null);
    const fullKeyboardText = useBreakpointValue({
        base: false,
        lg: false,
        xl: true,
    });
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const { user } = useViewer();
    const displayInBigBlinds =
        user?.pokerPreferences?.displayAmountsInBigBlinds;
    const bigBlindValue = gameSettings?.big_blind_value || 1000000; // Default to 1 if not available
    const keyboardShortcuts = user?.pokerPreferences?.keyboardShortcuts ?? true;

    const [selectedActionIdx, setSelectedActionIdx] = useState<number | null>(
        null,
    );
    const [isSubmitting, setIsSubmitting] = useState<undefined | boolean>(
        undefined,
    );
    const lastButtonValueRef = useRef<number | null>(null);

    // Convert to display value based on user preference
    const toDisplayValue = (microDollars: number): number => {
        if (displayInBigBlinds) {
            return microDollars / bigBlindValue;
        }
        return microDollars / 1000000; // Convert to dollars
    };

    // Convert from display value back to microDollars
    const fromDisplayValue = (displayValue: number): number => {
        if (displayInBigBlinds) {
            return displayValue * bigBlindValue;
        }
        return displayValue * 1000000; // Convert from dollars to microDollars
    };

    const initialDisplayValue = toDisplayValue(minRaise);
    const [value, setValue] = useState<number>(initialDisplayValue);
    const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = (valueStr: string, _valueNum: number) => {
        // Sanitize to allow only digits and a single decimal point
        let sanitized = valueStr.replace(/[^0-9.]/g, '');
        const firstDotIndex = sanitized.indexOf('.');
        if (firstDotIndex !== -1) {
            const before = sanitized.slice(0, firstDotIndex + 1);
            // Remove additional dots, then cap to 6 decimal digits for user typing
            const decimalsOnly = sanitized
                .slice(firstDotIndex + 1)
                .replace(/\./g, '');
            const cappedDecimals = decimalsOnly.slice(0, 6);
            sanitized = before + cappedDecimals;
        }

        setInputValue(sanitized);

        const numeric =
            sanitized === '' || sanitized === '.' ? NaN : Number(sanitized);
        if (Number.isFinite(numeric)) {
            setValue(numeric);
        }
        // If the value changes (including string/number difference), reset selectedActionIdx
        if (
            lastButtonValueRef.current === null ||
            numeric !== lastButtonValueRef.current
        ) {
            setSelectedActionIdx(null);
        }
    };

    const handleSliderChange = (newValue: number) => {
        setValue(newValue);
        // Format string to reflect the new numeric slider value without blocking decimals
        setInputValue(formatDisplayStringFromNumber(newValue));
        if (
            lastButtonValueRef.current === null ||
            newValue !== lastButtonValueRef.current
        ) {
            setSelectedActionIdx(null);
        }
    };

    const handleGridValueSelect = useCallback(
        (displayValue: number, index: number) => {
            const converted = toDisplayValue(displayValue);
            setValue(converted);
            setInputValue(formatDisplayStringFromNumber(converted));
            setSelectedActionIdx(index);
            lastButtonValueRef.current = converted;
            setTimeout(() => {
                inputRef.current?.focus();
                //   inputRef.current?.select();
            }, 0);
        },
        [toDisplayValue],
    );

    const noBet = streetPot === 0;
    const betText = noBet
        ? `Bet${hasPhysicalKeyboard && keyboardShortcuts && fullKeyboardText ? ' [Enter]' : ''}`
        : `Raise${hasPhysicalKeyboard && keyboardShortcuts && fullKeyboardText ? ' [Enter]' : ''}`;

    const params = {
        path: {
            game_id: gameId,
        },
        body: {
            action:
                fromDisplayValue(value) >= maxRaise || selectedActionIdx === 4
                    ? Action.ALL_IN
                    : Action.RAISE,
            amount: Math.trunc(fromDisplayValue(value)),
            is_min_raise: isMinRaise(Math.trunc(fromDisplayValue(value))),
        },
    };

    const handleEnterPress = async () => {
        if (!isInvalidRaise && !isSubmitting && isCurrentlyDecidingPlayer) {
            setIsSubmitting(true);
            await playerAction(params);
            onCloseRaiseMenu();
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!isCurrentlyDecidingPlayer) {
            setIsSubmitting(false);
            onCloseRaiseMenu();
        }
    }, [isCurrentlyDecidingPlayer]);

    const isInvalidRaise =
        isNaN(value) ||
        value < toDisplayValue(minRaise) ||
        value > toDisplayValue(maxRaise) ||
        (isPLO && fromDisplayValue(value) > potLimit);

    useHotkeys('Enter', handleEnterPress, {
        preventDefault: true,
        enabled: !isInvalidRaise && keyboardShortcuts,
    });
    useHotkeys('Escape', onCloseRaiseMenu, {
        preventDefault: true,
        enabled: keyboardShortcuts,
    });

    useEffect(() => {
        if (inputRef.current && !isPortrait) {
            inputRef.current.focus();
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.select();
                }
            }, 0);
        }
    }, [inputRef.current]);

    const getDynamicPrecision = (val: number): number => {
        if (displayInBigBlinds) {
            // For BB display, we want to show 2 decimal places
            return 2;
        }

        if (val > toDisplayValue(currentUserAmount)) return 6;
        if (val === 0) return 0;
        const decimalPart = val.toString().split('.')[1] || '';
        if (!decimalPart) {
            return 0;
        }
        const decimals = decimalPart.length;
        // Avoid rounding up in dollar display: if value has more than 2 decimals, keep them
        // so the displayed value never exceeds the player's exact amount.
        if (decimals > 2) return decimals;
        return 2;
    };

    // Format the numeric display value: allow up to 6 decimals, but if all digits beyond
    // the first two decimals are zeros, trim them to exactly two decimals.
    const formatDisplayStringFromNumber = (val: number): string => {
        const precision = getDynamicPrecision(val);
        if (precision <= 0) {
            return Math.trunc(val).toString();
        }
        const decimals = Math.min(precision, 6);
        let s = val.toFixed(decimals);
        if (s.includes('.')) {
            const [intPart, fracPart] = s.split('.');
            if (fracPart.length > 2) {
                const beyond = fracPart.slice(2);
                if (/^0+$/.test(beyond)) {
                    return `${intPart}.${fracPart.slice(0, 2)}`;
                }
            }
        }
        return s;
    };

    // Initialize input value using formatter
    useEffect(() => {
        setInputValue(formatDisplayStringFromNumber(initialDisplayValue));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get the appropriate unit symbol based on display preference
    const getUnitSymbol = (): string => {
        return displayInBigBlinds ? 'BB' : '$';
    };

    const maxSliderValue = isPLO
        ? Math.min(toDisplayValue(potLimit), toDisplayValue(currentUserAmount))
        : toDisplayValue(currentUserAmount);

    // Responsive sizing for input and action buttons (vmin/vmax similar to CommunityCards)
    const inputHeight = isPortrait ? '6vmax' : 'min(6.5vmin, 4.5vmax)';
    const buttonHeight = isPortrait ? '6vmax' : 'min(6.5vmin, 4.5vmax)';
    // const buttonFontSize = isPortrait ? '1.4vmax' : 'min(1.5vmin, 1.2vmax)';
    const buttonFontSize = isPortrait ? 'sm' : 'md';

    const buttonMaxHeight = isPortrait ? '2.5rem' : '2.5rem';

    // Labels around the slider
    const minLabel = displayInBigBlinds
        ? `${(Math.ceil((minRaise / bigBlindValue) * 100) / 100).toFixed(2)} BB`
        : `$${formatMicroDollars(minRaise)}`;

    // Show the largest total you can bet (include already committed bet), truncated to 2 decimals
    const maxMicro = currentUserAmount + currentUserBet;
    const maxAvailableMicro = isPLO ? Math.min(potLimit, maxMicro) : maxMicro;
    const maxLabel = displayInBigBlinds
        ? `${(Math.trunc((maxAvailableMicro / bigBlindValue) * 100) / 100).toFixed(2)} BB`
        : `$${(Math.trunc((maxAvailableMicro / 1000000) * 100) / 100).toFixed(2)}`;

    const labelColor = isPortrait ? 'brand.white70' : 'whiteAlpha.600';
    const labelMargin = isPortrait ? '0.85rem' : '1.1rem';
    const labelFontSize = isPortrait ? 'xs' : 'sm';
    const labelTopOffset = isPortrait ? '-0.2rem' : '-0.25rem';

    // Handle mouse wheel to adjust slider by exactly 1 big blind per tick
    const handleSliderWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const incrementDisplay = toDisplayValue(bigBlindValue / 2);
        const dir = e.deltaY < 0 ? 1 : -1; // up: increase, down: decrease
        const minDisplay = toDisplayValue(minRaise);
        const maxDisplay = maxSliderValue;
        let newVal = value + dir * incrementDisplay;
        if (displayInBigBlinds) {
            // keep to two decimals in BB display
            newVal = Math.round(newVal * 100) / 100;
        }
        newVal = Math.min(maxDisplay, Math.max(minDisplay, newVal));
        handleSliderChange(newVal);
    };

    // Global wheel handler so scrolling anywhere adjusts slider by 1 BB per tick
    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const incrementDisplay = toDisplayValue(bigBlindValue / 2);
            const dir = e.deltaY < 0 ? 1 : -1;
            const minDisplay = toDisplayValue(minRaise);
            const maxDisplay = maxSliderValue;
            let newVal = value + dir * incrementDisplay;
            if (displayInBigBlinds) {
                newVal = Math.round(newVal * 100) / 100;
            }
            newVal = Math.min(maxDisplay, Math.max(minDisplay, newVal));
            handleSliderChange(newVal);
        };
        window.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            window.removeEventListener('wheel', onWheel as EventListener);
        };
    }, [value, bigBlindValue, minRaise, maxSliderValue, displayInBigBlinds]);

    return (
        <VStack
            alignItems="center"
            justifyContent="center"
            spacing="1rem"
            w="100%"
            zIndex={1}
            px="1rem"
        >
            <HStack w="100%" alignItems="start" spacing="1rem">
                <VStack
                    bg="brand.modalGray"
                    borderRadius="0.75rem"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    w="55%"
                    h={`calc(${inputHeight} + 8px)`}
                    maxH="3rem"
                    alignSelf="flex-start"
                >
                    <NumberInput
                        value={inputValue}
                        onChange={handleInputChange}
                        min={0}
                        max={toDisplayValue(maxRaise)}
                        precision={getDynamicPrecision(value)}
                        h={inputHeight}
                        // maxH={buttonMaxHeight}
                        // minH="4rem"
                        w="100%"
                        p="4px"
                        border="none"
                        focusBorderColor="rgba(255, 255, 255, 0.2)"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleEnterPress();
                            } else if (e.key === 'Escape') {
                                onCloseRaiseMenu();
                            }
                        }}
                    >
                        <Box
                            position="absolute"
                            left="1rem"
                            top="0.5"
                            bottom="0"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            w="1.5rem"
                            h={inputHeight}
                            maxH={buttonMaxHeight}
                        >
                            <Text
                                fontSize={
                                    isPortrait
                                        ? '1.75vmax'
                                        : 'min(2.2vmin, 1.6vmax)'
                                }
                                fontWeight="bold"
                            >
                                {getUnitSymbol()}
                            </Text>
                        </Box>
                        <NumberInputField
                            borderRadius="0.6rem"
                            border="0.5px solid"
                            borderColor="rgba(255, 255, 255, 0)"
                            textColor="white"
                            h={inputHeight}
                            maxH={buttonMaxHeight}
                            pl="2.75rem"
                            pb="0.25rem"
                            bg="rgba(0, 0, 0, 0.2)"
                            ref={inputRef}
                            inputMode="decimal"
                        />
                    </NumberInput>
                </VStack>
                <Box position="relative" w="25%" alignSelf="flex-start">
                    <Box
                        position="absolute"
                        w="100%"
                        h={buttonHeight}
                        maxH={buttonMaxHeight}
                        bg={isInvalidRaise ? 'brand.gray40' : 'blue.800'}
                        borderRadius="0.75rem"
                        top="8px"
                        zIndex={0}
                    />
                    <APIButton
                        w="100%"
                        h={buttonHeight}
                        maxH={buttonMaxHeight}
                        endpoint={playerAction}
                        params={params}
                        variant={isInvalidRaise ? 'primaryDark' : 'raiseButton'}
                        onSuccess={onCloseRaiseMenu}
                        disabled={
                            isInvalidRaise ||
                            (isPLO && fromDisplayValue(value) > potLimit)
                        }
                        fontWeight="bold"
                        fontSize={buttonFontSize}
                        aria-label="Confirm Raise"
                        loadingOverride={isSubmitting}
                    >
                        {betText}
                    </APIButton>
                </Box>
                <Box position="relative" w="25%" alignSelf="flex-start">
                    <Box
                        position="absolute"
                        w="100%"
                        h={buttonHeight}
                        maxH={buttonMaxHeight}
                        bg={'brand.gray25'}
                        borderRadius="0.75rem"
                        top="8px"
                        zIndex={0}
                    />
                    <Button
                        w="100%"
                        h={buttonHeight}
                        maxH={buttonMaxHeight}
                        variant="primaryDark"
                        onClick={onCloseRaiseMenu}
                        zIndex={10}
                        textColor="brand.textWhite"
                        fontWeight={800}
                        fontSize={buttonFontSize}
                        position="relative"
                        disabled={isSubmitting}
                    >
                        {`Back${hasPhysicalKeyboard && keyboardShortcuts && fullKeyboardText ? ' [Esc]' : ''}`}
                    </Button>
                </Box>
            </HStack>
            <RaiseActionsGrid
                setValue={handleGridValueSelect}
                selectedActionIndex={selectedActionIdx}
                displayInBigBlinds={displayInBigBlinds}
                bigBlindValue={bigBlindValue}
                isPortrait={isPortrait === undefined ? true : isPortrait}
            />
            <HStack w="100%" justifyContent="space-between" alignItems="center">
                <Box
                    // bg="brand.gray25"
                    borderRadius="0.5rem"
                    px="0.5rem"
                    py="0.25rem"
                    mr={labelMargin}
                    position="relative"
                    top={labelTopOffset}
                    minW="fit-content"
                    alignSelf="flex-start"
                >
                    <Text
                        color={labelColor}
                        fontWeight={700}
                        fontSize={labelFontSize}
                        textAlign="left"
                        whiteSpace="nowrap"
                    >
                        {minLabel}
                    </Text>
                </Box>
                <Slider
                    flex="1"
                    mx={labelMargin}
                    value={value}
                    onChange={handleSliderChange}
                    min={toDisplayValue(minRaise)}
                    focusThumbOnChange={false}
                    max={maxSliderValue}
                    step={
                        displayInBigBlinds
                            ? 0.1 // For BB display, step by 0.1 BB
                            : Math.max(
                                  gameSettings?.small_blind_value /
                                      1000000 /
                                      10,
                                  0.01,
                              ) // For dollar display
                    }
                    onWheel={handleSliderWheel}
                >
                    <SliderTrack>
                        <SliderFilledTrack>
                            <Box
                                w="100%"
                                h="100%"
                                bgGradient="linear-gradient(135deg,rgba(127, 84, 169, 0.71) 0%,rgba(69, 43, 93, 0.84) 100%)"
                            />
                        </SliderFilledTrack>
                    </SliderTrack>
                    <SliderThumb bg="#E2E8F0" />
                </Slider>
                <Box
                    // bg="brand.gray25"
                    borderRadius="0.5rem"
                    alignSelf="flex-end"
                    px="0.5rem"
                    py="0.25rem"
                    ml={labelMargin}
                    position="relative"
                    top={labelTopOffset}
                    minW="fit-content"
                >
                    <Text
                        color={labelColor}
                        fontWeight={700}
                        fontSize={labelFontSize}
                        textAlign="right"
                        whiteSpace="nowrap"
                    >
                        {maxLabel}
                    </Text>
                </Box>
            </HStack>
        </VStack>
    );
};

export default RaiseMenu;
