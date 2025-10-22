import {
    Spacer,
    Text,
    VStack,
    HStack,
    Input,
    Button,
    Tag,
    TagLabel,
    Select,
} from '@chakra-ui/react';
import { useGetGameHostName } from '../../hooks/useGetGameHostName';
import useGameData from '../../hooks/useGameData';
import { getGameTypeString } from '../../Shared/GameRecords/utils';
import { formatMicroDollars } from '../../utils/formatMoney';
import { GiPokerHand } from 'react-icons/gi';
import { useState, useEffect } from 'react';
import { FaCopy, FaCheck, FaCog, FaBomb, FaPlus } from 'react-icons/fa';

interface HostSettingsStepProps {
    bombPotBB: string;
    setBombPotBB: (v: string) => void;
    bombPotFrequency: string;
    setBombPotFrequency: (v: string) => void;
    ante: string;
    setAnte: (v: string) => void;
    pending: boolean;
    isHost: boolean;
    doubleBoard?: 'always' | 'bomb_pot' | 'off';
    setDoubleBoard?: (v: 'always' | 'bomb_pot' | 'off') => void;
    mandatoryStraddle?: 'yes' | 'no';
    setMandatoryStraddle?: (v: 'yes' | 'no') => void;
}

export const HostSettingsStep = ({
    bombPotBB,
    setBombPotBB,
    bombPotFrequency,
    setBombPotFrequency,
    ante,
    setAnte,
    pending,
    isHost,
    doubleBoard,
    setDoubleBoard,
    mandatoryStraddle,
    setMandatoryStraddle,
}: HostSettingsStepProps) => {
    const hostUsername = useGetGameHostName();
    const { gameId, gameSettings } = useGameData();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(gameId);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    // Set initial values if > 0
    useEffect(() => {
        if (gameSettings.bomb_pot_bb > 0)
            setBombPotBB(gameSettings.bomb_pot_bb);
        if (gameSettings.bomb_pot_frequency > 0)
            setBombPotFrequency(gameSettings.bomb_pot_frequency);

        // Set initial ante value, converting from microDollars to BB
        if (gameSettings.ante_value && gameSettings.big_blind_value) {
            const anteInBB =
                gameSettings.ante_value / gameSettings.big_blind_value;
            if (anteInBB > 0) {
                setAnte(anteInBB.toFixed(1));
            }
        }
    }, [
        gameSettings.bomb_pot_bb,
        gameSettings.bomb_pot_frequency,
        gameSettings.ante_value,
        gameSettings.big_blind_value,
    ]);

    return (
        <VStack spacing="0.5rem" h="100%" justify="center" position="relative">
            <Text
                color="brand.textWhite"
                fontSize="1.2rem"
                letterSpacing="0.07rem "
                display="flex"
                alignItems="center"
            >
                {getGameTypeString(gameSettings.game_mode) === "NL HOLD'EM" && (
                    <img
                        src="/HoldemIcon.png"
                        style={{
                            marginRight: '6px',
                            width: '22px',
                            height: '22px',
                        }}
                    />
                )}
                {getGameTypeString(gameSettings.game_mode) ===
                    'POT-LIMIT OMAHA' && (
                    <GiPokerHand
                        style={{
                            marginRight: '6px',
                            width: '26px',
                            height: '26px',
                        }}
                    />
                )}
                <b>
                    {getGameTypeString(gameSettings.game_mode)}{' '}
                    {formatMicroDollars(gameSettings.small_blind_value)}/
                    {formatMicroDollars(gameSettings.big_blind_value)}
                </b>
            </Text>
            <Text
                color="brand.gray10"
                fontSize="0.75rem"
                letterSpacing="0.05rem "
                display="flex"
                alignItems="center"
            >
                <b>ID: {gameId}</b>
                <span
                    onClick={handleCopy}
                    style={{ marginLeft: '8px', cursor: 'pointer' }}
                >
                    {copied ? (
                        <FaCheck color="brand.gray10" />
                    ) : (
                        <FaCopy color="brand.gray10" />
                    )}
                </span>
            </Text>
            <Spacer />
            <Text
                pb="0.2rem"
                fontSize="0.9rem"
                whiteSpace="normal"
                fontWeight={500}
                letterSpacing="0.07rem"
            >
                Your host {<b>{hostUsername}</b>} selected the following
                settings:
            </Text>
            {/* Game Settings Header */}
            <HStack
                spacing="0.5rem"
                alignItems="center"
                pt="0.5rem"
                w="100%"
                justifyContent="flex-start"
                pl="2px"
            >
                <FaCog color="#9F7AEA" size="16px" />
                <Text variant="modalH2">Game Settings</Text>
            </HStack>
            {/* Settings rows, left-aligned to match text above */}
            <VStack alignItems="flex-start" spacing="0.5rem" w="100%" pl="2px">
                <HStack>
                    <Text
                        color="brand.white90"
                        fontSize="0.8rem"
                        letterSpacing="0.07rem"
                        fontWeight={500}
                    >
                        Visibility:
                    </Text>
                    {gameSettings.visibility === 1 ? (
                        <Tag
                            size="xs"
                            bg="gray.700"
                            color="white"
                            borderRadius="0.5rem"
                            px={2}
                            py={0.5}
                            fontSize="0.7rem"
                        >
                            <TagLabel fontSize="0.7rem">Private</TagLabel>
                        </Tag>
                    ) : (
                        <Tag
                            size="xs"
                            bg="green.700"
                            color="white"
                            borderRadius="0.5rem"
                            px={2}
                            py={0.5}
                            fontSize="0.7rem"
                        >
                            <TagLabel fontSize="0.7rem">Public</TagLabel>
                        </Tag>
                    )}
                </HStack>
                {gameSettings.fee_schedule && (
                    <Text
                        color="brand.white90"
                        fontSize="0.8rem"
                        letterSpacing="0.07rem"
                    >
                        Game Fee:{' '}
                        <b>
                            {gameSettings.fee_schedule.rake_percentage}% up to{' '}
                            {gameSettings.fee_schedule.rake_cap_in_bb} BB
                        </b>
                    </Text>
                )}
                <Text
                    color="brand.white90"
                    fontSize="0.8rem"
                    letterSpacing="0.07rem"
                >
                    Turn Time: <b>{gameSettings.turn_time} sec</b> | Extra Time:{' '}
                    <b>{gameSettings.extra_time || 10} sec</b>
                </Text>
                <Text
                    color="brand.white90"
                    fontSize="0.8rem"
                    letterSpacing="0.07rem"
                >
                    Min Buy In:{' '}
                    <b>{formatMicroDollars(gameSettings.min_buy_in)}</b> | Max
                    Buy In: <b>{formatMicroDollars(gameSettings.max_buy_in)}</b>
                </Text>
                <Text
                    color="brand.white90"
                    fontSize="0.8rem"
                    letterSpacing="0.07rem"
                >
                    Rabbit Hunting:{' '}
                    <b>{gameSettings.rabbit_hunt ? 'Enabled' : 'Disabled'}</b>
                </Text>
                {/* Double Board Section */}
                <HStack w="100%" alignItems="center" spacing="0.5rem">
                    <Text
                        color="brand.white90"
                        fontSize="0.8rem"
                        letterSpacing="0.05rem"
                        fontWeight={500}
                        flex="0 0 auto"
                    >
                        Double Board:
                    </Text>
                    {!isHost || !setDoubleBoard || !doubleBoard ? (
                        <>
                            {gameSettings.double_board === 0 && (
                                <Tag
                                    size="xs"
                                    bg="purple.700"
                                    color="white"
                                    borderRadius="0.5rem"
                                    px={2}
                                    py={0.5}
                                    fontSize="0.6rem"
                                >
                                    <TagLabel fontSize="0.7rem">
                                        Always
                                    </TagLabel>
                                </Tag>
                            )}
                            {gameSettings.double_board === 1 && (
                                <Tag
                                    size="xs"
                                    bg="gray.700"
                                    color="white"
                                    borderRadius="0.5rem"
                                    px={2}
                                    py={0.5}
                                    fontSize="0.6rem"
                                >
                                    <TagLabel fontSize="0.7rem">Off</TagLabel>
                                </Tag>
                            )}
                            {gameSettings.double_board === 2 && (
                                <Tag
                                    size="xs"
                                    bg="green.700"
                                    color="white"
                                    borderRadius="0.5rem"
                                    px={2}
                                    py={0.5}
                                    fontSize="0.6rem"
                                >
                                    <TagLabel fontSize="0.7rem">
                                        Bomb Pot
                                    </TagLabel>
                                </Tag>
                            )}
                        </>
                    ) : (
                        <Select
                            value={doubleBoard}
                            onChange={(e) =>
                                setDoubleBoard(e.target.value as any)
                            }
                            size="sm"
                            // w="4/0px"
                            h="40px"
                            minW="120px"
                            ml="0.25rem"
                            flex="0 0 160px"
                            flexShrink={0}
                            bg="brand.gray55"
                            borderColor="brand.gray30"
                            color="whiteAlpha.800"
                            borderRadius="0.5rem"
                            isDisabled={pending}
                        >
                            <option value="always">Always</option>
                            <option value="bomb_pot">Bomb Pot</option>
                            <option value="off">Off</option>
                        </Select>
                    )}
                </HStack>
                {/* Mandatory Straddle */}
                <HStack w="100%" alignItems="center" spacing="0.5rem">
                    <Text
                        color="brand.white90"
                        fontSize="0.8rem"
                        letterSpacing="0.05rem"
                        fontWeight={500}
                        flex="0 0 auto"
                    >
                        Mandatory Straddle:
                    </Text>
                    {!isHost ? (
                        <Tag
                            size="xs"
                            bg={
                                (gameSettings as any)?.mandatory_straddle
                                    ? 'purple.700'
                                    : 'gray.700'
                            }
                            color="white"
                            borderRadius="0.5rem"
                            px={2}
                            py={0.5}
                            fontSize="0.6rem"
                        >
                            <TagLabel fontSize="0.7rem">
                                {(gameSettings as any)?.mandatory_straddle
                                    ? 'Yes'
                                    : 'No'}
                            </TagLabel>
                        </Tag>
                    ) : (
                        <Select
                            value={mandatoryStraddle}
                            onChange={(e) =>
                                setMandatoryStraddle &&
                                setMandatoryStraddle(
                                    e.target.value as 'yes' | 'no',
                                )
                            }
                            size="sm"
                            h="40px"
                            minW="120px"
                            ml="0.25rem"
                            flex="0 0 160px"
                            flexShrink={0}
                            bg="brand.gray55"
                            borderColor="brand.gray30"
                            color="whiteAlpha.800"
                            borderRadius="0.5rem"
                            isDisabled={pending}
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Select>
                    )}
                </HStack>
                {/* Ante Section */}
                <VStack
                    alignItems="flex-start"
                    spacing="0.75rem"
                    w="100%"
                    pt="0.5rem"
                >
                    <VStack alignItems="flex-start" spacing="0.15rem" w="100%">
                        <HStack spacing="0.5rem" alignItems="center">
                            <FaPlus color="#9F7AEA" size="16px" />
                            <Text variant="modalH2">Ante</Text>
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
                    <VStack alignItems="flex-start" spacing="0.25rem" w="150px">
                        <HStack w="100%">
                            <Input
                                type="number"
                                min={0}
                                max={2}
                                step={0.1}
                                placeholder="0.0-2.0"
                                value={ante}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Allow empty string or valid decimal numbers within range
                                    if (
                                        val === '' ||
                                        (/^\d*\.?\d*$/.test(val) &&
                                            (val === '' ||
                                                (Number(val) >= 0 &&
                                                    Number(val) <= 2)))
                                    ) {
                                        setAnte(val);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    // Prevent 'e', 'E', '+', '-' characters
                                    if (
                                        e.key === 'e' ||
                                        e.key === 'E' ||
                                        e.key === '+' ||
                                        e.key === '-'
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                isDisabled={!isHost || pending}
                                color="#9F7AEA"
                                borderColor="#444"
                                borderRadius="8px"
                                fontSize="1rem"
                                background="transparent"
                                _focus={{ boxShadow: 'none' }}
                                _hover={{ boxShadow: 'none' }}
                                _placeholder={{
                                    color: 'gray.500',
                                    fontSize: '0.9rem',
                                }}
                            />
                            <Text color="gray.400" fontSize="0.9rem" pl="6px">
                                BB
                            </Text>
                        </HStack>
                    </VStack>
                </VStack>
                {/* Bomb Pot Section */}
                <VStack
                    alignItems="flex-start"
                    spacing="0.75rem"
                    w="100%"
                    pt="0.5rem"
                >
                    <VStack alignItems="flex-start" spacing="0.15rem" w="100%">
                        <HStack spacing="0.5rem" alignItems="center">
                            <FaBomb color="#9F7AEA" size="16px" />
                            <Text variant="modalH2">Bomb Pot</Text>
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
                        <VStack
                            alignItems="flex-start"
                            spacing="0.25rem"
                            w="125px"
                        >
                            <Text fontSize="0.8rem" fontWeight={600}>
                                Ante
                            </Text>
                            <HStack w="100%">
                                <Input
                                    type="number"
                                    min={1}
                                    max={10}
                                    step={1}
                                    placeholder="1-10"
                                    value={bombPotBB}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        // Only allow empty string or positive integers within range
                                        if (
                                            val === '' ||
                                            (/^[1-9]\d*$/.test(val) &&
                                                Number(val) >= 1 &&
                                                Number(val) <= 10)
                                        ) {
                                            setBombPotBB(val);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Prevent decimal point, minus sign, 'e', and other non-integer characters
                                        if (
                                            e.key === '.' ||
                                            e.key === '-' ||
                                            e.key === 'e' ||
                                            e.key === 'E' ||
                                            e.key === '+'
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    isDisabled={!isHost || pending}
                                    color="#9F7AEA"
                                    borderColor="#444"
                                    borderRadius="8px"
                                    fontSize="1rem"
                                    background="transparent"
                                    _focus={{ boxShadow: 'none' }}
                                    _hover={{ boxShadow: 'none' }}
                                    _placeholder={{
                                        color: 'gray.500',
                                        fontSize: '0.9rem',
                                    }}
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
                        <VStack
                            alignItems="flex-start"
                            spacing="0.25rem"
                            w="150px"
                        >
                            <Text fontSize="0.8rem" fontWeight={600}>
                                Frequency
                            </Text>
                            <HStack w="100%">
                                <Input
                                    type="number"
                                    min={1}
                                    max={30}
                                    step={1}
                                    placeholder="1-30"
                                    value={bombPotFrequency}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        // Only allow empty string or positive integers within range
                                        if (
                                            val === '' ||
                                            (/^[1-9]\d*$/.test(val) &&
                                                Number(val) >= 1 &&
                                                Number(val) <= 30)
                                        ) {
                                            setBombPotFrequency(val);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Prevent decimal point, minus sign, 'e', and other non-integer characters
                                        if (
                                            e.key === '.' ||
                                            e.key === '-' ||
                                            e.key === 'e' ||
                                            e.key === 'E' ||
                                            e.key === '+'
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    isDisabled={!isHost || pending}
                                    color="#9F7AEA"
                                    borderColor="#444"
                                    borderRadius="8px"
                                    fontSize="1rem"
                                    background="transparent"
                                    _focus={{ boxShadow: 'none' }}
                                    _hover={{ boxShadow: 'none' }}
                                    _placeholder={{
                                        color: 'gray.500',
                                        fontSize: '0.9rem',
                                    }}
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
                    </HStack>
                </VStack>
            </VStack>
        </VStack>
    );
};

export default HostSettingsStep;
