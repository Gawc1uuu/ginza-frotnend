'use client';

import {
    VStack,
    Text,
    Image,
    HStack,
    Spacer,
    useDisclosure,
    useToast,
    Input,
    Button,
    InputGroup,
    InputLeftElement,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useBreakpointValue,
    Box,
    ButtonGroup,
} from '@chakra-ui/react';
import { GinzaSignInButton } from '../../../Shared/AuthButtons';
import { useCurrentUserBalance } from '../../../hooks/useCurrentBalance';
import { SignedIn, SignedOut, UserButton, SignUpButton } from '@clerk/nextjs';
import { GinzaSurface } from '../../../Modals/GinzaModal';
import { usdcIcon } from '../../../../tools/config';
import { FaCopy } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { GameMenu } from '../../../Header/GameMenu';
import { usePathname } from 'next/navigation';

import {
    ChevronDownIcon,
    ExternalLinkIcon,
    CheckIcon,
    InfoOutlineIcon,
} from '@chakra-ui/icons';
import { useAuthModal } from '../../../Shared/AuthModalContext';
import Link from 'next/link';
import useDepositToast from '../../../hooks/useDepositToast';
import { Chain, CHAIN_INFO } from '../../../../utils/shared/onchain.constants';

const ChainAndCurrencySection = ({
    supportedChains,
    selectedChain,
    setSelectedChain,
}: {
    supportedChains: any[];
    selectedChain: any;
    setSelectedChain: (chain: any) => void;
}) => {
    return (
        <HStack spacing="24px" align="stretch">
            {/* Chain Selection Section */}
            <VStack align="stretch" flex="1">
                <Text
                    color="brand.white80"
                    fontWeight="700"
                    fontSize="md"
                    alignSelf="start"
                >
                    Network
                </Text>
                <Menu>
                    <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        bg="whiteAlpha.100"
                        border="1.5px solid"
                        borderColor="purple.400"
                        color="white"
                        borderRadius="xl"
                        h="48px"
                        w="100%"
                        _hover={{ bg: 'whiteAlpha.200' }}
                        _active={{ bg: 'whiteAlpha.200' }}
                    >
                        <Text>{selectedChain.name}</Text>
                    </MenuButton>
                    <MenuList
                        bg="brand.gray50"
                        borderRadius="0.5rem"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                    >
                        {supportedChains.map((chain: any) => (
                            <MenuItem
                                key={chain.id}
                                    onClick={() => {}}
                                _hover={{ bg: 'whiteAlpha.200' }}
                                fontWeight="700"
                                fontSize="14px"
                                pl={3}
                            >
                                <HStack>
                                    <Image
                                        src={CHAIN_INFO[chain.id].icon}
                                        w="24px"
                                        h="24px"
                                        alt={CHAIN_INFO[chain.id].name}
                                    />
                                    <Text color="white">
                                        {CHAIN_INFO[chain.id].name}
                                    </Text>
                                </HStack>
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            </VStack>

            {/* Currency Section */}
            <VStack align="stretch" flex="1">
                <Text
                    color="brand.white80"
                    fontWeight="700"
                    fontSize="md"
                    alignSelf="start"
                >
                    Currency
                </Text>
                <HStack
                    p="2"
                    pl="0.75rem" // Add left padding for image alignment
                    bg="whiteAlpha.100"
                    borderRadius="xl"
                    justify="space-between"
                    h="48px"
                    border="1.5px solid"
                    borderColor="purple.400"
                    _hover={{
                        bg: 'whiteAlpha.200',
                        filter: 'brightness(1.15)',
                    }}
                >
                    <HStack>
                        <Image src={usdcIcon} w="24px" h="24px" alt="USDC" />
                        <Text color="white" fontWeight="700">
                            USDC
                        </Text>
                    </HStack>
                </HStack>
            </VStack>
        </HStack>
    );
};

const DepositAddressSection = ({
    predeployAddress,
}: {
    predeployAddress: string;
}) => {
    const toast = useToast();
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const copyAddress = () => {
        navigator.clipboard.writeText(predeployAddress);
        toast({
            title: 'Address copied to clipboard',
            status: 'success',
        });
    };
    return (
        <VStack align="stretch">
            <Text
                color="brand.white80"
                fontWeight="700"
                fontSize="md"
                alignSelf="start"
            >
                Your Deposit Address
            </Text>
            <HStack
                p="4"
                bg="whiteAlpha.200"
                borderRadius="xl"
                justify="space-between"
            >
                <Text color="white" fontSize="sm" userSelect="text">
                    {predeployAddress}
                </Text>
                <Box
                    as={FaCopy}
                    onClick={copyAddress}
                    color="white"
                    fontSize="20px"
                    cursor="pointer"
                    _hover={!isPortrait ? { color: 'purple.300' } : {}}
                />
            </HStack>
        </VStack>
    );
};

const DepositWarningSection = ({ selectedChain }: { selectedChain: Chain }) => {
    return (
        <VStack align="center" w="100%" spacing={2}>
            <Box
                w="100%"
                bg="#F3EFFF"
                borderRadius="16px"
                px={5}
                py={3}
                display="flex"
                alignItems="center"
            >
                <InfoOutlineIcon
                    color="purple.400"
                    mr={2}
                    style={{ transform: 'rotate(180deg)' }}
                    boxSize={5}
                />
                <Box w="100%">
                    <Text color="gray.700" fontWeight="600" fontSize="sm">
                        Only send USDC through the{' '}
                        {CHAIN_INFO[selectedChain.id].name} network.
                    </Text>

                    <Text color="gray.700" fontWeight="800" fontSize="sm">
                        The minimum deposit is $5!
                    </Text>
                </Box>
            </Box>
        </VStack>
    );
};

const DepositContent = () => {


    return (
        <VStack spacing="16px" align="stretch" w="100%" px="1rem" py="1rem">
            <HStack alignSelf="end" spacing="4px">
                <Text
                    color="whiteAlpha.800"
                    fontSize="sm"
                    alignSelf="start"
                    _hover={{ textDecoration: 'underline' }}
                >
                    <Link href="/transactions">View Past Transactions</Link>
                </Text>
                <ExternalLinkIcon color="whiteAlpha.800" h="12px" />
            </HStack>
            <Text
                color="whiteAlpha.600"
                fontSize="sm"
                textAlign="center"
                w="100%"
                whiteSpace="pre-line"
                wordBreak="break-word"
            >
                You can close this tab while waiting for your deposit to be
                processed.
            </Text>
        </VStack>
    );
};

const WithdrawContent = () => {
    const [address, setAddress] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9.]/g, '');
        // If value starts with a decimal, prepend a 0
        if (value.startsWith('.')) value = `0${value}`;
        // Prevent multiple decimal points
        const parts = value.split('.');
        if (parts.length > 2) return;
        // Limit decimal places to 2
        if (parts[1]?.length > 2) return;
        setWithdrawAmount(value);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAddress = e.target.value;
        setAddress(newAddress);
        // No toast messages here
    };




    return (
        <VStack
            spacing="16px"
            align="stretch"
            w={isPortrait ? '100%' : '450px'}
            alignSelf="center"
            px="1rem"
            py="1rem"
        >
            <VStack spacing="16px" align="stretch" w="100%">
                <VStack align="stretch">
                    <HStack align="center" justify="space-between">
                        <Text
                            color="brand.white80"
                            fontWeight="700"
                            fontSize="md"
                            alignSelf="start"
                        >
                            Amount
                        </Text>
                        <HStack>
                            <Text color="whiteAlpha.800" fontSize="sm">
                                Available Balance: $5
                            </Text>
                            <Text
                                as="button"
                                color="gray.500"
                                fontSize="sm"
                                textDecoration="underline"
                                ml={1}
                                cursor="pointer"
                                onClick={() =>
                                    setWithdrawAmount('5')
                                }
                            >
                                Max
                            </Text>
                        </HStack>
                    </HStack>
                    <InputGroup
                        borderRadius="xl"
                        py="3"
                        bg="whiteAlpha.200"
                        border="1.5px solid"
                        borderColor={
                            withdrawAmount && false
                                ? 'red'
                                : 'whiteAlpha.400'
                        }
                    >
                        <InputLeftElement h="100%">
                            <Image
                                src="/GinzaCoin.webp"
                                w="24px"
                                h="24px"
                                alt="Gold coin"
                            />
                        </InputLeftElement>
                        <Input
                            borderColor={
                                        withdrawAmount && false
                                    ? 'red'
                                    : 'white'
                            }
                            value={withdrawAmount}
                            onChange={handleInputChange}
                            border="none"
                            bg="none"
                            focusBorderColor="transparent"
                            placeholder="Enter amount"
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*\.?[0-9]*"
                            color="white"
                            h="100%"
                            py="0.25"
                        />
                    </InputGroup>
                </VStack>
                <VStack align="stretch">
                    <HStack align="center" justify="space-between">
                        <Text
                            color="brand.white80"
                            fontWeight="700"
                            fontSize="md"
                            alignSelf="start"
                        >
                            Destination Address
                        </Text>
                        <HStack>
                           
                        </HStack>
                    </HStack>
                    <Input
                        placeholder="Enter destination address"
                        value={address}
                        onChange={handleAddressChange}
                        color="white"
                        border="1.5px solid"
                        borderColor="whiteAlpha.400"
                        borderRadius="xl"
                        p="2"
                        pl="4"
                        h="48px"
                        bg="whiteAlpha.200"
                    />
                </VStack>
            </VStack>
        </VStack>
    );
};

const DepositModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>(
        'deposit',
    );
    const isPortrait = useBreakpointValue({ base: true, xl: false });

    return (
        <GinzaSurface
            title="Transfer Crypto"
            content={
                <VStack align="stretch" w="100%">
                    <ButtonGroup
                        isAttached
                        w="100%"
                        maxW="240px"
                        alignSelf="center"
                        mb={2}
                        mt={isPortrait ? 0 : -2}
                        borderRadius="12px"
                    >
                        <Button
                            borderRadius="12px 0 0 12px"
                            width="50%"
                            bg={
                                activeTab === 'deposit'
                                    ? 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 100%), rgba(104,65,168,0.38)'
                                    : 'rgba(162, 121, 220, 0.13)'
                            }
                            color={
                                activeTab === 'deposit'
                                    ? 'white'
                                    : 'brand.white80'
                            }
                            fontWeight={700}
                            fontSize="0.95rem"
                            h="40px"
                            boxShadow={
                                activeTab === 'deposit'
                                    ? '0 0 14px rgba(104,65,168,0.35)'
                                    : 'none'
                            }
                            border={
                                activeTab === 'deposit'
                                    ? '1px solid rgba(255,255,255,0.12)'
                                    : '1px solid rgba(255,255,255,0.06)'
                            }
                            onClick={() => setActiveTab('deposit')}
                            _hover={{
                                bg:
                                    activeTab === 'deposit'
                                        ? 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.10) 100%), rgba(104,65,168,0.5)'
                                        : 'rgba(162, 121, 220, 0.2)',
                            }}
                            _active={{
                                bg:
                                    activeTab === 'deposit'
                                        ? 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.10) 100%), rgba(104,65,168,0.5)'
                                        : 'rgba(162, 121, 220, 0.2)',
                            }}
                        >
                            Deposit
                        </Button>
                        <Button
                            borderRadius="0 12px 12px 0"
                            width="50%"
                            bg={
                                activeTab === 'withdraw'
                                    ? 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 100%), rgba(104,65,168,0.45)'
                                    : 'rgba(162, 121, 220, 0.15)'
                            }
                            color={
                                activeTab === 'withdraw'
                                    ? 'white'
                                    : 'brand.white80'
                            }
                            fontWeight={700}
                            fontSize="0.95rem"
                            h="40px"
                            boxShadow={
                                activeTab === 'withdraw'
                                    ? '0 0 18px rgba(104,65,168,0.45)'
                                    : 'none'
                            }
                            border={
                                activeTab === 'withdraw'
                                    ? '1px solid rgba(255,255,255,0.15)'
                                    : '1px solid rgba(255,255,255,0.08)'
                            }
                            onClick={() => setActiveTab('withdraw')}
                            _hover={{
                                bg:
                                    activeTab === 'withdraw'
                                        ? 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.10) 100%), rgba(104,65,168,0.5)'
                                        : 'rgba(162, 121, 220, 0.2)',
                            }}
                            _active={{
                                bg:
                                    activeTab === 'withdraw'
                                        ? 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.10) 100%), rgba(104,65,168,0.5)'
                                        : 'rgba(162, 121, 220, 0.2)',
                            }}
                        >
                            Withdraw
                        </Button>
                    </ButtonGroup>
                    {activeTab === 'deposit' ? (
                        <DepositContent />
                    ) : (
                        <WithdrawContent />
                    )}
                </VStack>
            }
            isOpen={isOpen}
            onClose={onClose}
        />
    );
};

export const BalanceCard: React.FC = () => {
    const isPortrait = useBreakpointValue({
        base: true,
        md: true,
        lg: false,
        xl: false,
    });
    const pathname = usePathname();


    return (
        <HStack
            w="100%"
            zIndex="1000"
            background="rgba(6, 8, 1, 0.75)"
            p="0.5rem"
            mr="1.5rem"
            justify="space-between"
            h="auto"
            minH="70px"
            // borderBottom="0.1px solid rgba(39, 39, 40, 0.52)"
            // borderBottom="0.1px solid rgba(39, 39, 40, 0.52)"
        >
            <HStack spacing="0.15rem">
               
            </HStack>
            <SignedIn>
                <HStack w="100%">
                    <Spacer />
                    <Box pr={isPortrait ? "0.5rem" : "1rem"}>
                        <HStack spacing="4">
                        <Box
                            p="0.1rem"
                            borderRadius="0.85rem"
                            // remove comments + keep on one line
                            bgGradient="linear(135deg, rgba(255,250,255,0.98) 0%, #F7DAFF 5%, #EDBEFF 12%, #D8A6FF 22%, #B487F5 36%, #8A66E8 52%, #6B5DEB 70%, #5C62F0 85%, #5A68F5 100%)"
                            boxShadow="0 10px 24px rgba(0,0,0,.45)"
                            >
                            <VStack
                                align="flex-start"
                                spacing="4px"
                                py="0.28rem"
                                px="0.75rem"
                                borderRadius="xl"   
                                background="linear-gradient(180deg, rgba(2, 2, 2, 0.95) 0%, rgba(12, 12, 14, 0.94) 56%, rgba(3, 2, 3, 0.95) 100%)"
                                // background="none"
                                // bgGradient="linear(180deg, rgb(50, 50, 50) 0%, rgba(0, 0, 0, 0.94) 56%, rgb(0, 0, 0) 100%)"
                                // bgGradient="linear(180deg, rgb(22, 9, 9) 0%,  hsla(240, 66.70%, 1.20%, 0.14) 56%, rgb(2, 0, 9) 100%)"
                                boxShadow="inset 0 1px 0 rgba(255,255,255,.04), inset 0 -1px 0 rgba(0,0,0,.45)"
                            >
                                <HStack h="1.7rem" alignItems="center">
                                <Image
                                    src="/GinzaCoin.webp"
                                    w="2.9rem"
                                    h="2.9rem"
                                    alt="Gold coin"
                                    ml="-28px"
                                    mb="1px"
                                />
                                <Text
                                    color="rgba(255, 255, 255, 0.9)"
                                    fontSize="1rem"
                                    fontWeight="700"
                                    draggable={false}
                                    onSelect={() => {}}
                                >
                                      $5
                                    </Text>
                                </HStack>
                            </VStack>
                            </Box>
                            <Button
                                h="2.55rem"
                                variant="walletButton2"
                                borderRadius="0.75rem"
                                onClick={() => {}}
                                cursor="pointer"
                                _active={{
                                    transform: 'translateY(2px)',
                                }}
                                filter="saturation(250%)"
                                _hover={{
                                    filter: 'saturate(1.15)',
                                }}
                            >
                                <HStack spacing="0.3rem">
                                    <Image 
                                        src="/WalletIcon.webp" 
                                        filter="brightness(1.05) contrast(1.05) saturate(.95)" 
                                        w="1.5rem" 
                                        h="1.5rem" 
                                        ml="-1px"
                                        alt="Wallet" 
                                        draggable={false}
                                        style={{
                                            filter: 'drop-shadow(0 0 8px rgba(244,120,255,.15))',
                                        }}
                                    />
                                    <Text
                                        fontSize=".9rem"
                                        fontWeight="800"
                                        color="rgba(247, 240, 249, 0.9)"
                                    >
                                        DEPOSIT
                                    </Text>
                                </HStack>
                            </Button>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: {
                                            width: '40px',
                                            height: '40px',
                                            border: '1.5px solid rgba(255, 255, 255, 0.25)',
                                        },
                                    },
                                }}
                            />
                        </HStack>
                    </Box>
                </HStack>
            </SignedIn>
            <SignedOut>
                <Box pr={isPortrait ? "0.5rem" : "1rem"}>
                    <HStack spacing="0.75rem">
                        <SignUpButton mode="modal">
                            <Button
                                variant="rewardsInactiveButton"
                                borderRadius="0.75rem"
                                fontWeight="700"
                                px="2rem"
                                py="1rem"
                                h="3rem"
                            >
                                Sign Up
                            </Button>
                        </SignUpButton>
                        <GinzaSignInButton />
                    </HStack>
                </Box>
            </SignedOut>
            {/* <DepositModal isOpen={isOpen} onClose={onClose} /> */}
        </HStack>
    );
};