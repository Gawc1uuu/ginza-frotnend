import {
    Button,
    HStack,
    Text,
    VStack,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip,
    Checkbox,
    ButtonGroup,
    SliderMark,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    Box,
    Flex,
} from '@chakra-ui/react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import {
    FaCog,
    FaBomb,
    FaCoins,
    FaBitcoin,
    FaPlus,
    FaEye,
    FaLock,
    FaUsers,
} from 'react-icons/fa';
import {
    CreateTableFormValues,
    NO_MAX_MAXIMUM,
    SHOWDOWN_OPTIONS,
    EXTRA_TIMER_OPTIONS,
    STAKE_LEVELS,
    STAKE_SETTINGS,
} from './schema';
import React from 'react';

export const GameOptions = ({ isSubmitting }: { isSubmitting: boolean }) => {
    const { control, setValue, watch } =
        useFormContext<CreateTableFormValues>();

    const stakeLevel = useWatch({
        control,
        name: 'stakeLevel',
    });
    const blindIndex = useWatch({
        control,
        name: 'blindIndex',
    });
    const noMaxBuyIn = useWatch({
        control,
        name: 'noMaxBuyIn',
    });
    const bombPotBB = useWatch({
        control,
        name: 'bombPotBB',
    });
    const bombPotFrequency = useWatch({
        control,
        name: 'bombPotFrequency',
    });
    const extraTime = useWatch({
        control,
        name: 'extraTime',
    });
    const ante = useWatch({
        control,
        name: 'ante',
    });
    // Add visibility toggle state from form
    const visibility = useWatch({
        control,
        name: 'visibility',
    });

    // Find the max allowed index for low stakes when public (bb <= 20)
    const maxLowPublicIndex = STAKE_SETTINGS.low.findIndex(
        (blind) => blind.bb > 20,
    );
    const cappedLowBlinds =
        visibility === 2 && stakeLevel === 'low'
            ? STAKE_SETTINGS.low.slice(
                  0,
                  maxLowPublicIndex === -1
                      ? STAKE_SETTINGS.low.length
                      : maxLowPublicIndex,
              )
            : STAKE_SETTINGS.low;

    // If public, cap the blindIndex for low stakes
    React.useEffect(() => {
        if (visibility === 2 && stakeLevel === 'low') {
            const maxIndex = cappedLowBlinds.length - 1;
            if (blindIndex > maxIndex) {
                setValue('blindIndex', maxIndex);
            }
        }
    }, [visibility, stakeLevel, blindIndex, setValue]);

    const currentBlinds =
        stakeLevel === 'low' && visibility === 2
            ? cappedLowBlinds[blindIndex]
            : STAKE_SETTINGS[stakeLevel][blindIndex];
    const maxBlindsIndex =
        stakeLevel === 'low' && visibility === 2
            ? cappedLowBlinds.length - 1
            : STAKE_SETTINGS[stakeLevel].length - 1;

    // Check if only one bomb pot field is filled
    const showBBError = bombPotBB === 0 && bombPotFrequency > 0;
    const showFreqError = bombPotBB > 0 && bombPotFrequency === 0;

    return (
        <VStack alignItems="start" spacing="0.75rem">
            {/* Visibility Section */}
            <Box
                bg="brand.gray52"
                borderRadius="lg"
                border="0.1rem solid"
                borderColor="brand.gray45"
                p={4}
                mb={0.5}
                w="100%"
            >
                <HStack
                    w="100%"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <HStack spacing="0.5rem" alignItems="center">
                        <FaEye color="#9F7AEA" size="18px" />
                        <Text color="brand.white90" variant="modalH1">
                            Visibility
                        </Text>
                    </HStack>
                    <Controller
                        name="visibility"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <ButtonGroup isAttached>
                                <Button
                                    borderRadius="12px 0 0 12px"
                                    width="50%"
                                    bg={
                                        value === 1
                                            ? '#553976'
                                            : 'rgba(162, 121, 220, 0.18)'
                                    }
                                    color={
                                        value === 1
                                            ? 'whiteAlpha.800'
                                            : 'whiteAlpha.700'
                                    }
                                    fontWeight={600}
                                    fontSize="0.95rem"
                                    h="40px"
                                    boxShadow="none"
                                    border="none"
                                    onClick={() => onChange(1)}
                                    _hover={{
                                        bg:
                                            value === 1
                                                ? '#553976'
                                                : 'rgba(162, 121, 220, 0.25)',
                                    }}
                                    _active={{
                                        bg:
                                            value === 1
                                                ? '#553976'
                                                : 'rgba(162, 121, 220, 0.25)',
                                    }}
                                    leftIcon={
                                        <FaLock style={{ marginRight: 3 }} />
                                    }
                                    disabled={isSubmitting}
                                >
                                    <Text
                                        fontSize="0.85rem"
                                        fontWeight={700}
                                        color={
                                            value === 1
                                                ? 'whiteAlpha.800'
                                                : 'whiteAlpha.700'
                                        }
                                    >
                                        PRIVATE
                                    </Text>
                                </Button>
                                <Button
                                    borderRadius="0 12px 12px 0"
                                    width="50%"
                                    bg={
                                        value === 2
                                            ? '#553976'
                                            : 'rgba(162, 121, 220, 0.18)'
                                    }
                                    color={
                                        value === 2
                                            ? 'whiteAlpha.800'
                                            : 'whiteAlpha.700'
                                    }
                                    fontWeight={600}
                                    fontSize="0.95rem"
                                    h="40px"
                                    boxShadow="none"
                                    border="none"
                                    onClick={() => { /* Temporarily disabled */ }}
                                    isDisabled
                                    _hover={{ bg: value === 2 ? '#553976' : 'rgba(162, 121, 220, 0.18)' }}
                                    _active={{ bg: value === 2 ? '#553976' : 'rgba(162, 121, 220, 0.18)' }}
                                    leftIcon={<FaUsers style={{ marginRight: 3 }} />}
                                >
                                    <Text
                                        fontSize="0.85rem"
                                        fontWeight={700}
                                        color={
                                            value === 2
                                                ? 'whiteAlpha.800'
                                                : 'whiteAlpha.700'
                                        }
                                    >
                                        PUBLIC
                                    </Text>
                                </Button>
                            </ButtonGroup>
                        )}
                    />
                </HStack>
            </Box>
            {/* Blinds Section */}
            <Box
                bg="brand.gray52"
                borderRadius="lg"
                border="0.1rem solid"
                borderColor="brand.gray45"
                p={4}
                mb={0.5}
                w="100%"
            >
                <VStack spacing="0.5rem" w="100%" alignItems="start">
                    <HStack spacing="0.5rem" alignItems="center">
                        <FaBitcoin color="#9F7AEA" size="18px" />
                        <Text color="brand.white90" variant="modalH1">
                            Blinds
                        </Text>
                        <Text
                            fontSize="1rem"
                            fontWeight="bold"
                            color="purple.300"
                            minW="4rem"
                        >{`${currentBlinds.sb}/${currentBlinds.bb}`}</Text>
                    </HStack>
                    <Controller
                        name="stakeLevel"
                        control={control}
                        render={({ field: { value, onChange } }) => {
                            return (
                                <HStack spacing="0.5rem">
                                    {STAKE_LEVELS.map(
                                        ({ label, value: optionValue }) => {
                                            const displayLabel =
                                                label === 'Medium'
                                                    ? 'Mid'
                                                    : label;
                                            const isActive =
                                                value === optionValue;
                                            // Disable medium/high if public
                                            const isDisabled =
                                                visibility === 2 &&
                                                (optionValue === 'medium' ||
                                                    optionValue === 'high');
                                            return (
                                                <Button
                                                    fontSize="0.875rem"
                                                    key={optionValue}
                                                    variant="gameOptionButton"
                                                    onClick={() => {
                                                        if (!isDisabled)
                                                            onChange(
                                                                optionValue,
                                                            );
                                                    }}
                                                    isActive={isActive}
                                                    width="72px"
                                                    px={1}
                                                    py={1}
                                                    color="whiteAlpha.800"
                                                    isDisabled={isDisabled}
                                                    bg={
                                                        isDisabled
                                                            ? 'brand.gray25'
                                                            : isActive
                                                              ? '#553976'
                                                              : 'rgba(162, 121, 220, 0.18)'
                                                    }
                                                    _hover={
                                                        isDisabled
                                                            ? {
                                                                  bg: 'brand.gray25',
                                                              }
                                                            : { bg: '#553976' }
                                                    }
                                                    _active={
                                                        isDisabled
                                                            ? {
                                                                  bg: 'brand.gray25',
                                                              }
                                                            : { bg: '#553976' }
                                                    }
                                                    disabled={isSubmitting}
                                                >
                                                    {displayLabel}
                                                </Button>
                                            );
                                        },
                                    )}
                                </HStack>
                            );
                        }}
                    />
                    <Controller
                        name="blindIndex"
                        control={control}
                        render={({ field }) => (
                            <HStack w="100%" spacing="1.5rem">
                                <Text
                                    variant="sliderText"
                                    fontSize="0.75rem"
                                    w="4.5rem"
                                    textAlign="left"
                                >
                                    {stakeLevel === 'low' && visibility === 2
                                        ? `${cappedLowBlinds[0].sb}/${cappedLowBlinds[0].bb}`
                                        : `${STAKE_SETTINGS[stakeLevel][0].sb}/${STAKE_SETTINGS[stakeLevel][0].bb}`}
                                </Text>
                                <Slider
                                    w="90%"
                                    minWidth="18rem"
                                    maxWidth="65%"
                                    min={0}
                                    max={maxBlindsIndex}
                                    step={1}
                                    value={field.value}
                                    onChange={field.onChange}
                                    mt={2}
                                    isDisabled={isSubmitting}
                                >
                                    <SliderTrack bg="gray.600">
                                        <SliderFilledTrack bg="purple.700" />
                                    </SliderTrack>
                                    <Tooltip
                                        hasArrow
                                        bg="brand.gray20"
                                        color="white"
                                        placement="bottom"
                                        label={
                                            stakeLevel === 'low' &&
                                            visibility === 2
                                                ? `${cappedLowBlinds[field.value].sb}/${cappedLowBlinds[field.value].bb}`
                                                : `${STAKE_SETTINGS[stakeLevel][field.value].sb}/${STAKE_SETTINGS[stakeLevel][field.value].bb}`
                                        }
                                    >
                                        <SliderThumb
                                            bg="gray.400"
                                            boxSize="20px"
                                        />
                                    </Tooltip>
                                </Slider>
                                <Text
                                    variant="sliderText"
                                    fontSize="0.75rem"
                                    w="4.5rem"
                                    textAlign="right"
                                >
                                    {stakeLevel === 'low' && visibility === 2
                                        ? `${cappedLowBlinds[maxBlindsIndex].sb}/${cappedLowBlinds[maxBlindsIndex].bb}`
                                        : `${STAKE_SETTINGS[stakeLevel][maxBlindsIndex].sb}/${STAKE_SETTINGS[stakeLevel][maxBlindsIndex].bb}`}
                                </Text>
                            </HStack>
                        )}
                    />
                </VStack>
            </Box>
            {/* Buy-in Section */}
            <Box
                bg="brand.gray52"
                borderRadius="lg"
                border="0.1rem solid"
                borderColor="brand.gray45"
                p={4}
                mb={0.5}
                w="100%"
            >
                <VStack spacing="0.5rem" w="100%" alignItems="start">
                    <HStack spacing="1rem" alignItems="center">
                        <FaCoins color="#9F7AEA" size="18px" />
                        <Text color="brand.white90" variant="modalH1">
                            Buy-in
                        </Text>
                        <Controller
                            name="noMaxBuyIn"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Checkbox
                                    isChecked={value}
                                    onChange={(e) => {
                                        onChange(e.target.checked);
                                        if (e.target.checked) {
                                            setValue(
                                                'maxBuyIn',
                                                NO_MAX_MAXIMUM,
                                            );
                                        } else {
                                            const minBuyIn = watch('minBuyIn');
                                            const currentMax =
                                                watch('maxBuyIn') ?? 500;
                                            setValue(
                                                'maxBuyIn',
                                                Math.max(
                                                    minBuyIn,
                                                    Math.min(currentMax, 500),
                                                ),
                                            );
                                        }
                                    }}
                                    borderColor="brand.gray20"
                                    colorScheme="brand.purple.500"
                                    iconColor="brand.purple.500"
                                    _checked={{
                                        borderColor: 'brand.purple.500',
                                    }}
                                    isDisabled={isSubmitting}
                                >
                                    <Text
                                        fontWeight="bold"
                                        fontSize="0.875rem"
                                        color="gray.300"
                                    >
                                        No Max
                                    </Text>
                                </Checkbox>
                            )}
                        />
                    </HStack>
                    <Controller
                        name="minBuyIn"
                        control={control}
                        render={({ field: minField }) => (
                            <Controller
                                name="maxBuyIn"
                                control={control}
                                render={({ field: maxField }) => (
                                    <>
                                        <HStack spacing="2.5rem" pb="0.5rem">
                                            <HStack spacing="0.5rem">
                                                <Text
                                                    fontSize="0.95rem"
                                                    color="gray.300"
                                                >
                                                    Min:
                                                </Text>
                                                <Text
                                                    fontSize="1rem"
                                                    fontWeight="bold"
                                                    color="purple.400"
                                                    w="5rem"
                                                >
                                                    {minField.value} BB
                                                </Text>
                                            </HStack>
                                            <HStack spacing="0.5rem">
                                                <Text
                                                    fontSize="0.95rem"
                                                    color="gray.300"
                                                >
                                                    Max:
                                                </Text>
                                                <Text
                                                    fontWeight="bold"
                                                    color="purple.300"
                                                    fontSize={
                                                        noMaxBuyIn
                                                            ? '1.25rem'
                                                            : '1rem'
                                                    }
                                                    w="6rem"
                                                >
                                                    {noMaxBuyIn
                                                        ? '∞'
                                                        : `${maxField.value} BB`}
                                                </Text>
                                            </HStack>
                                        </HStack>
                                        <HStack w="100%" spacing="1.5rem">
                                            <Text variant="sliderText">
                                                10 BB
                                            </Text>
                                            {!noMaxBuyIn ? (
                                                <RangeSlider
                                                    w="90%"
                                                    minWidth="18rem"
                                                    maxWidth="67.5%"
                                                    min={10}
                                                    max={500}
                                                    step={5}
                                                    value={[
                                                        minField.value,
                                                        maxField.value,
                                                    ]}
                                                    onChange={([min, max]) => {
                                                        minField.onChange(min);
                                                        maxField.onChange(max);
                                                    }}
                                                    isDisabled={isSubmitting}
                                                >
                                                    <RangeSliderTrack bg="gray.600">
                                                        <RangeSliderFilledTrack bg="purple.700" />
                                                    </RangeSliderTrack>
                                                    <Tooltip
                                                        hasArrow
                                                        bg="brand.gray20"
                                                        color="white"
                                                        placement="bottom"
                                                        label={`${minField.value} BB`}
                                                    >
                                                        <RangeSliderThumb
                                                            index={0}
                                                            bg="gray.400"
                                                            boxSize="20px"
                                                        />
                                                    </Tooltip>
                                                    <Tooltip
                                                        hasArrow
                                                        bg="brand.gray20"
                                                        color="white"
                                                        placement="bottom"
                                                        label={`${maxField.value} BB`}
                                                    >
                                                        <RangeSliderThumb
                                                            index={1}
                                                            bg="gray.400"
                                                            boxSize="20px"
                                                        />
                                                    </Tooltip>
                                                </RangeSlider>
                                            ) : (
                                                <Slider
                                                    w="90%"
                                                    minWidth="18rem"
                                                    maxWidth="67.5%"
                                                    min={10}
                                                    max={500}
                                                    step={5}
                                                    value={minField.value}
                                                    onChange={minField.onChange}
                                                    isDisabled={isSubmitting}
                                                >
                                                    <SliderTrack bg="gray.600">
                                                        <SliderFilledTrack bg="purple.700" />
                                                    </SliderTrack>
                                                    <Tooltip
                                                        hasArrow
                                                        bg="brand.gray20"
                                                        color="white"
                                                        placement="bottom"
                                                        label={`${minField.value} BB`}
                                                    >
                                                        <SliderThumb
                                                            bg="gray.400"
                                                            boxSize="20px"
                                                        />
                                                    </Tooltip>
                                                </Slider>
                                            )}
                                            <Text
                                                variant="sliderText"
                                                fontWeight={
                                                    noMaxBuyIn
                                                        ? 'bold'
                                                        : undefined
                                                }
                                                fontSize={
                                                    noMaxBuyIn
                                                        ? '1.25rem'
                                                        : undefined
                                                }
                                            >
                                                {noMaxBuyIn ? '∞' : '500 BB'}
                                            </Text>
                                        </HStack>
                                    </>
                                )}
                            />
                        )}
                    />
                </VStack>
            </Box>
            {/* Game Settings Section */}
            <Box
                bg="brand.gray52"
                borderRadius="lg"
                border="0.1rem solid"
                borderColor="brand.gray45"
                p={4}
                mb={0.5}
                w="100%"
            >
                <VStack
                    spacing="0.5rem"
                    paddingBottom={0}
                    w="100%"
                    alignItems="start"
                >
                    <HStack spacing="0.5rem" alignItems="center">
                        <FaCog color="#9F7AEA" size="18px" />
                        <Text color="brand.white90" variant="modalH1">
                            Game Settings
                        </Text>
                    </HStack>
                    <Controller
                        name="turnTime"
                        control={control}
                        render={({ field }) => (
                            <VStack
                                alignItems="start"
                                spacing="0.75rem"
                                pb="2rem"
                            >
                                <HStack spacing="1rem" alignItems="center">
                                    <Text
                                        variant="modalH2"
                                        color="brand.white85"
                                    >
                                        Turn time
                                    </Text>
                                    <Text
                                        fontSize="1rem"
                                        fontWeight="bold"
                                        color="purple.300"
                                    >
                                        {field.value}s
                                    </Text>
                                </HStack>
                                <HStack w="100%" spacing="1.5rem">
                                    <Slider
                                        w="100%"
                                        ml="0.5rem"
                                        minWidth="20rem"
                                        maxWidth="100%"
                                        min={15}
                                        max={45}
                                        step={5}
                                        value={field.value}
                                        onChange={field.onChange}
                                        isDisabled={isSubmitting}
                                    >
                                        <SliderTrack bg="gray.600">
                                            <SliderFilledTrack bg="purple.700" />
                                        </SliderTrack>
                                        {[15, 20, 25, 30, 35, 40, 45].map(
                                            (value) => (
                                                <SliderMark
                                                    key={value}
                                                    value={value}
                                                    mt="4"
                                                    ml="-0.5rem"
                                                    fontSize="0.75rem"
                                                    color={
                                                        field.value === value
                                                            ? 'brand.textWhite'
                                                            : 'gray.400'
                                                    }
                                                    fontWeight={
                                                        field.value === value
                                                            ? 'bold'
                                                            : 'normal'
                                                    }
                                                >
                                                    {value}s
                                                </SliderMark>
                                            ),
                                        )}
                                        <Tooltip
                                            hasArrow
                                            bg="brand.gray20"
                                            color="white"
                                            placement="bottom"
                                            // label={`${field.value}s`}
                                        >
                                            <SliderThumb
                                                bg="gray.400"
                                                boxSize="20px"
                                            />
                                        </Tooltip>
                                    </Slider>
                                </HStack>
                            </VStack>
                        )}
                    />
                    <Controller
                        name="extraTime"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <VStack alignItems="start" spacing="0.5rem">
                                <Text
                                    variant="modalH2"
                                    fontSize="0.875rem"
                                    color="brand.white90"
                                >
                                    Extra time duration
                                </Text>
                                <ButtonGroup isAttached variant="outline">
                                    {EXTRA_TIMER_OPTIONS.map((opt, idx) => (
                                        <Button
                                            key={opt.value}
                                            borderRadius={
                                                idx === 0
                                                    ? '12px 0 0 12px'
                                                    : idx ===
                                                        EXTRA_TIMER_OPTIONS.length -
                                                            1
                                                      ? '0 12px 12px 0'
                                                      : undefined
                                            }
                                            width="90px"
                                            bg={
                                                value === opt.value
                                                    ? '#553976'
                                                    : 'rgba(162, 121, 220, 0.18)'
                                            }
                                            color={
                                                value === opt.value
                                                    ? 'whiteAlpha.800'
                                                    : 'gray.400'
                                            }
                                            fontWeight={600}
                                            fontSize="0.9rem"
                                            h="36px"
                                            boxShadow="none"
                                            border="none"
                                            onClick={() => onChange(opt.value)}
                                            _hover={{
                                                bg:
                                                    value === opt.value
                                                        ? '#553976'
                                                        : 'rgba(162, 121, 220, 0.25)',
                                            }}
                                            _active={{
                                                bg:
                                                    value === opt.value
                                                        ? '#553976'
                                                        : 'rgba(162, 121, 220, 0.25)',
                                            }}
                                            justifyContent="center"
                                            disabled={isSubmitting}
                                        >
                                            <Text
                                                w="100%"
                                                textAlign="center"
                                                color={
                                                    value === opt.value
                                                        ? 'brand.textWhite'
                                                        : 'gray.200'
                                                }
                                            >
                                                {opt.label}
                                            </Text>
                                        </Button>
                                    ))}
                                </ButtonGroup>
                                <Box h={0.5} />
                            </VStack>
                        )}
                    />
                    <Controller
                        name="rabbitHunting"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <VStack alignItems="start" spacing="0.5rem">
                                <Text variant="modalH2" color="brand.white90">
                                    Allow players to see undealt cards? (Rabbit
                                    Hunting)
                                </Text>
                                <ButtonGroup isAttached variant="outline">
                                    {['Yes', 'No'].map((option, idx) => {
                                        const isActive =
                                            value === (option === 'Yes');
                                        return (
                                            <Button
                                                key={option}
                                                width="90px"
                                                h="36px"
                                                borderRadius={
                                                    idx === 0
                                                        ? '12px 0 0 12px'
                                                        : '0 12px 12px 0'
                                                }
                                                onClick={() =>
                                                    onChange(option === 'Yes')
                                                }
                                                bg={
                                                    isActive
                                                        ? '#553976'
                                                        : 'rgba(162, 121, 220, 0.18)'
                                                }
                                                color={
                                                    isActive
                                                        ? 'whiteAlpha.800'
                                                        : 'gray.400'
                                                }
                                                boxShadow="none"
                                                border="none"
                                                fontWeight={600}
                                                fontSize="0.95rem"
                                                _hover={{
                                                    bg: isActive
                                                        ? '#553976'
                                                        : 'rgba(162, 121, 220, 0.25)',
                                                }}
                                                _active={{
                                                    bg: isActive
                                                        ? '#553976'
                                                        : 'rgba(162, 121, 220, 0.25)',
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                <Text
                                                    w="100%"
                                                    textAlign="center"
                                                    color={
                                                        isActive
                                                            ? 'brand.textWhite'
                                                            : 'gray.200'
                                                    }
                                                >
                                                    {option}
                                                </Text>
                                            </Button>
                                        );
                                    })}
                                </ButtonGroup>
                                <Box h={0.5} />
                            </VStack>
                        )}
                    />
                    <Controller
                        name="showdownTimer"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <VStack alignItems="start" spacing="0.5rem">
                                <Text
                                    variant="modalH2"
                                    fontSize="0.875rem"
                                    color="brand.white90"
                                >
                                    Showdown presentation time
                                </Text>
                                <ButtonGroup isAttached variant="outline">
                                    {SHOWDOWN_OPTIONS.map((opt) => (
                                        <Button
                                            borderRadius="12px"
                                            width="110px"
                                            h="36px"
                                            key={opt.label}
                                            onClick={() => onChange(opt.value)}
                                            bg={
                                                value === opt.value
                                                    ? '#553976'
                                                    : 'rgba(162, 121, 220, 0.18)'
                                            }
                                            color={
                                                value === opt.value
                                                    ? 'whiteAlpha.800'
                                                    : 'gray.400'
                                            }
                                            boxShadow="none"
                                            border="none"
                                            fontWeight={600}
                                            fontSize="0.95rem"
                                            disabled={isSubmitting}
                                            _hover={{
                                                bg:
                                                    value === opt.value
                                                        ? '#553976'
                                                        : 'rgba(162, 121, 220, 0.25)',
                                            }}
                                            _active={{
                                                bg:
                                                    value === opt.value
                                                        ? '#553976'
                                                        : 'rgba(162, 121, 220, 0.25)',
                                            }}
                                        >
                                            <Text
                                                fontSize="0.875rem"
                                                color={
                                                    value === opt.value
                                                        ? 'brand.textWhite'
                                                        : 'gray.200'
                                                }
                                            >
                                                {opt.label}
                                            </Text>
                                        </Button>
                                    ))}
                                </ButtonGroup>
                                {/* Double Board Section */}
                                <Box pt={2} w="100%">
                                    <Text
                                        variant="modalH2"
                                        fontSize="0.875rem"
                                        mb={1}
                                        color="brand.white90"
                                    >
                                        Double Board
                                    </Text>
                                    <Controller
                                        name="doubleBoard"
                                        control={control}
                                        render={({
                                            field: { value, onChange },
                                        }) => (
                                            <HStack
                                                w="100%"
                                                justify="flex-start"
                                            >
                                                <ButtonGroup
                                                    isAttached
                                                    variant="outline"
                                                >
                                                    <Button
                                                        borderRadius="12px 0 0 12px"
                                                        width="90px"
                                                        bg={
                                                            value === 'always'
                                                                ? '#553976'
                                                                : 'rgba(162, 121, 220, 0.18)'
                                                        }
                                                        color={
                                                            value === 'always'
                                                                ? 'whiteAlpha.800'
                                                                : 'gray.400'
                                                        }
                                                        fontWeight={600}
                                                        fontSize="0.9rem"
                                                        h="36px"
                                                        boxShadow="none"
                                                        border="none"
                                                        disabled={isSubmitting}
                                                        onClick={() =>
                                                            onChange('always')
                                                        }
                                                        _hover={{
                                                            bg:
                                                                value ===
                                                                'always'
                                                                    ? '#553976'
                                                                    : 'rgba(162, 121, 220, 0.25)',
                                                        }}
                                                        _active={{
                                                            bg:
                                                                value ===
                                                                'always'
                                                                    ? '#553976'
                                                                    : 'rgba(162, 121, 220, 0.25)',
                                                        }}
                                                        justifyContent="center"
                                                    >
                                                        <Text
                                                            w="100%"
                                                            textAlign="center"
                                                        >
                                                            Always
                                                        </Text>
                                                    </Button>
                                                    <Button
                                                        width="110px"
                                                        bg={
                                                            value === 'bomb_pot'
                                                                ? '#553976'
                                                                : 'rgba(162, 121, 220, 0.18)'
                                                        }
                                                        color={
                                                            value === 'bomb_pot'
                                                                ? 'whiteAlpha.800'
                                                                : 'gray.400'
                                                        }
                                                        fontWeight={600}
                                                        fontSize="0.9rem"
                                                        h="36px"
                                                        boxShadow="none"
                                                        border="none"
                                                        disabled={isSubmitting}
                                                        onClick={() =>
                                                            onChange('bomb_pot')
                                                        }
                                                        _hover={{
                                                            bg:
                                                                value ===
                                                                'bomb_pot'
                                                                    ? '#553976'
                                                                    : 'rgba(162, 121, 220, 0.25)',
                                                        }}
                                                        _active={{
                                                            bg:
                                                                value ===
                                                                'bomb_pot'
                                                                    ? '#553976'
                                                                    : 'rgba(162, 121, 220, 0.25)',
                                                        }}
                                                        justifyContent="center"
                                                    >
                                                        <Text
                                                            w="100%"
                                                            textAlign="center"
                                                        >
                                                            Bomb Pot
                                                        </Text>
                                                    </Button>
                                                    <Button
                                                        borderRadius="0 12px 12px 0"
                                                        width="90px"
                                                        bg={
                                                            value === 'off'
                                                                ? '#553976'
                                                                : 'rgba(162, 121, 220, 0.18)'
                                                        }
                                                        color={
                                                            value === 'off'
                                                                ? 'whiteAlpha.800'
                                                                : 'gray.400'
                                                        }
                                                        fontWeight={600}
                                                        fontSize="0.9rem"
                                                        h="36px"
                                                        boxShadow="none"
                                                        border="none"
                                                        disabled={isSubmitting}
                                                        onClick={() =>
                                                            onChange('off')
                                                        }
                                                        _hover={{
                                                            bg:
                                                                value === 'off'
                                                                    ? '#553976'
                                                                    : 'rgba(162, 121, 220, 0.25)',
                                                        }}
                                                        _active={{
                                                            bg:
                                                                value === 'off'
                                                                    ? '#553976'
                                                                    : 'rgba(162, 121, 220, 0.25)',
                                                        }}
                                                        justifyContent="center"
                                                    >
                                                        <Text
                                                            w="100%"
                                                            textAlign="center"
                                                            color={
                                                                value === 'off'
                                                                    ? 'brand.textWhite'
                                                                    : 'gray.200'
                                                            }
                                                        >
                                                            Off
                                                        </Text>
                                                    </Button>
                                                </ButtonGroup>
                                            </HStack>
                                        )}
                                    />
                                    {/* Mandatory Straddle Section */}
                                    <Box pt={3} w="100%">
                                        <Text
                                            variant="modalH2"
                                            fontSize="0.875rem"
                                            mb={1}
                                            color="brand.white90"
                                        >
                                            Mandatory Straddle
                                        </Text>
                                        <Controller
                                            name="mandatoryStraddle"
                                            control={control}
                                            render={({
                                                field: { value, onChange },
                                            }) => (
                                                <HStack
                                                    w="100%"
                                                    justify="flex-start"
                                                >
                                                    <ButtonGroup
                                                        isAttached
                                                        variant="outline"
                                                    >
                                                        <Button
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            borderRadius="12px 0 0 12px"
                                                            width="90px"
                                                            bg={
                                                                value
                                                                    ? '#553976'
                                                                    : 'rgba(162, 121, 220, 0.18)'
                                                            }
                                                            color={
                                                                value
                                                                    ? 'whiteAlpha.800'
                                                                    : 'gray.400'
                                                            }
                                                            fontWeight={600}
                                                            fontSize="0.9rem"
                                                            h="36px"
                                                            boxShadow="none"
                                                            border="none"
                                                            onClick={() =>
                                                                onChange(true)
                                                            }
                                                            _hover={{
                                                                bg: value
                                                                    ? '#553976'
                                                                    : 'rgba(162, 121, 220, 0.25)',
                                                            }}
                                                            _active={{
                                                                bg: value
                                                                    ? '#553976'
                                                                    : 'rgba(162, 121, 220, 0.25)',
                                                            }}
                                                            justifyContent="center"
                                                        >
                                                            <Text
                                                                w="100%"
                                                                textAlign="center"
                                                            >
                                                                Yes
                                                            </Text>
                                                        </Button>
                                                        <Button
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            borderRadius="0 12px 12px 0"
                                                            width="90px"
                                                            bg={
                                                                !value
                                                                    ? '#553976'
                                                                    : 'rgba(162, 121, 220, 0.18)'
                                                            }
                                                            color={
                                                                !value
                                                                    ? 'whiteAlpha.800'
                                                                    : 'gray.400'
                                                            }
                                                            fontWeight={600}
                                                            fontSize="0.9rem"
                                                            h="36px"
                                                            boxShadow="none"
                                                            border="none"
                                                            onClick={() =>
                                                                onChange(false)
                                                            }
                                                            _hover={{
                                                                bg: !value
                                                                    ? '#553976'
                                                                    : 'rgba(162, 121, 220, 0.25)',
                                                            }}
                                                            _active={{
                                                                bg: !value
                                                                    ? '#553976'
                                                                    : 'rgba(162, 121, 220, 0.25)',
                                                            }}
                                                            justifyContent="center"
                                                        >
                                                            <Text
                                                                w="100%"
                                                                textAlign="center"
                                                                color={
                                                                    !value
                                                                        ? 'brand.textWhite'
                                                                        : 'gray.200'
                                                                }
                                                            >
                                                                No
                                                            </Text>
                                                        </Button>
                                                    </ButtonGroup>
                                                </HStack>
                                            )}
                                        />
                                    </Box>
                                </Box>
                            </VStack>
                        )}
                    />
                </VStack>
            </Box>
            {/* Ante Section */}
            <Box
                bg="brand.gray52"
                border="0.1rem solid"
                borderColor="brand.gray45"
                borderRadius="lg"
                p={4}
                mb={0.5}
                w="100%"
            >
                <VStack spacing="0.5rem" w="100%" alignItems="start">
                    <VStack alignItems="flex-start" spacing="0.15rem" w="100%">
                        <HStack spacing="0.5rem" alignItems="center">
                            {/* <Flex bg="brand.gray40" p={1} borderRadius="full">   */}
                            {/* <FaPlus color="rgba(162, 121, 220, 0.5)" size="18px" /> */}
                            {/* </Flex>  */}
                            <FaPlus color="#9F7AEA" size="18px" />
                            <Text color="brand.white90" variant="modalH1">
                                Ante
                            </Text>
                            <Text
                                fontSize="1rem"
                                fontWeight="bold"
                                color="purple.300"
                            >{`${ante?.toFixed(1)} BB`}</Text>
                        </HStack>
                        <Text
                            color="brand.white90"
                            fontSize="0.75rem"
                            letterSpacing="0.05rem"
                            opacity="0.8"
                        >
                            Applies before pre-flop action - inactive for bomb
                            pots
                        </Text>
                    </VStack>
                    <Controller
                        name="ante"
                        control={control}
                        render={({ field }) => (
                            <HStack w="100%" spacing="1.5rem">
                                <Text variant="sliderText">0 BB</Text>
                                <Slider
                                    isDisabled={isSubmitting}
                                    w="90%"
                                    minWidth="18rem"
                                    maxWidth="65%"
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    <SliderTrack bg="gray.600">
                                        <SliderFilledTrack bg="purple.700" />
                                    </SliderTrack>
                                    <Tooltip
                                        hasArrow
                                        bg="brand.gray20"
                                        color="white"
                                        placement="bottom"
                                        label={`${field.value.toFixed(1)} BB`}
                                    >
                                        <SliderThumb
                                            bg="gray.400"
                                            boxSize="20px"
                                        />
                                    </Tooltip>
                                </Slider>
                                <Text variant="sliderText">2 BB</Text>
                            </HStack>
                        )}
                    />
                </VStack>
            </Box>
            {/* Bomb Pot Section */}
            <Box
                bg="brand.gray52"
                borderRadius="lg"
                border="0.1rem solid"
                borderColor="brand.gray45"
                p={4}
                mb={1.5}
                w="100%"
            >
                <VStack spacing="0.5rem" w="100%" alignItems="start">
                    <VStack alignItems="flex-start" spacing="0.15rem" w="100%">
                        <HStack spacing="0.5rem" alignItems="center">
                            <FaBomb color="#9F7AEA" size="18px" />
                            <Text color="brand.white90" variant="modalH1">
                                Bomb Pot
                            </Text>
                        </HStack>
                        <Text
                            color="brand.white90"
                            fontSize="0.75rem"
                            letterSpacing="0.05rem"
                            opacity="0.8"
                        >
                            Requires both ante and frequency to activate bomb
                            pots
                        </Text>
                    </VStack>
                    <HStack w="100%" spacing="2.5rem" alignItems="flex-start">
                        <Controller
                            name="bombPotBB"
                            control={control}
                            render={({ field }) => {
                                const handleChange = (
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const val = e.target.value;
                                    if (
                                        val === '' ||
                                        (/^\d+$/.test(val) &&
                                            Number(val) >= 0 &&
                                            Number(val) <= 10)
                                    ) {
                                        field.onChange(
                                            val === '' ? 0 : Number(val),
                                        );
                                    }
                                };
                                return (
                                    <VStack
                                        alignItems="flex-start"
                                        spacing="0.25rem"
                                        w="125px"
                                    >
                                        <Text
                                            variant="modalH2"
                                            color="brand.white90"
                                        >
                                            Ante
                                        </Text>
                                        <HStack w="100%">
                                            <input
                                                disabled={isSubmitting}
                                                type="number"
                                                min={1}
                                                max={10}
                                                step={1}
                                                value={
                                                    field.value === 0
                                                        ? ''
                                                        : field.value
                                                }
                                                onChange={handleChange}
                                                placeholder="1-10"
                                                style={{
                                                    width: '100%',
                                                    border: showBBError
                                                        ? '1px solid #E53E3E'
                                                        : '1px solid #444',
                                                    borderRadius: '8px',
                                                    padding: '4px 8px',
                                                    fontSize: '1rem',
                                                    background:
                                                        'var(--chakra-colors-brand-gray40)',
                                                    outline: 'none',
                                                    color: '#9F7AEA',
                                                }}
                                                onFocus={(e) =>
                                                    (e.currentTarget.style.boxShadow =
                                                        'none')
                                                }
                                                onBlur={(e) =>
                                                    (e.currentTarget.style.boxShadow =
                                                        'none')
                                                }
                                            />
                                            <Text
                                                color="gray.400"
                                                fontSize="0.9rem"
                                                pl="6px"
                                            >
                                                BB
                                            </Text>
                                        </HStack>
                                    </VStack>
                                );
                            }}
                        />
                        <Controller
                            name="bombPotFrequency"
                            control={control}
                            render={({ field }) => {
                                const handleChange = (
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const val = e.target.value;
                                    if (
                                        val === '' ||
                                        (/^\d+$/.test(val) &&
                                            Number(val) >= 0 &&
                                            Number(val) <= 30)
                                    ) {
                                        field.onChange(
                                            val === '' ? 0 : Number(val),
                                        );
                                    }
                                };
                                return (
                                    <VStack
                                        alignItems="flex-start"
                                        spacing="0.25rem"
                                        w="150px"
                                    >
                                        <Text
                                            variant="modalH2"
                                            color="brand.white90"
                                        >
                                            Frequency
                                        </Text>
                                        <HStack w="100%">
                                            <input
                                                disabled={isSubmitting}
                                                type="number"
                                                min={1}
                                                max={30}
                                                step={1}
                                                value={
                                                    field.value === 0
                                                        ? ''
                                                        : field.value
                                                }
                                                onChange={handleChange}
                                                placeholder="1-30"
                                                style={{
                                                    width: '100%',
                                                    border: showFreqError
                                                        ? '1px solid #E53E3E'
                                                        : '1px solid #444',
                                                    borderRadius: '8px',
                                                    padding: '4px 8px',
                                                    fontSize: '1rem',
                                                    background:
                                                        'var(--chakra-colors-brand-gray40)',
                                                    outline: 'none',
                                                    color: '#9F7AEA',
                                                }}
                                                onFocus={(e) =>
                                                    (e.currentTarget.style.boxShadow =
                                                        'none')
                                                }
                                                onBlur={(e) =>
                                                    (e.currentTarget.style.boxShadow =
                                                        'none')
                                                }
                                            />
                                            <Text
                                                color="gray.400"
                                                fontSize="0.9rem"
                                                pl="6px"
                                            >
                                                Hands
                                            </Text>
                                        </HStack>
                                    </VStack>
                                );
                            }}
                        />
                    </HStack>
                </VStack>
            </Box>
        </VStack>
    );
};

export default GameOptions;
