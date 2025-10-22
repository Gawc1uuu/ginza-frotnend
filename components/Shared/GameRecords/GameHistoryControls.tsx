import React, { useCallback } from 'react';
import {
    HStack,
    Input,
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Icon,
    useBreakpointValue,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { FaSearch } from 'react-icons/fa';

interface GameHistoryControlsProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortOption: string;
    setSortOption: (option: string) => void;
    statusFilter: string;
    setStatusFilter: (filter: string) => void;
}

const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'ACTIVE', label: 'Ongoing' },
    { value: 'WITHDRAWN', label: 'Completed' },
];

const sortOptions = [
    { value: 'Latest', label: 'Latest' },
    { value: 'Oldest', label: 'Oldest' },
];

export const GameHistoryControls: React.FC<GameHistoryControlsProps> = ({
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    statusFilter,
    setStatusFilter,
}) => {
    const isLandscape = useBreakpointValue({ base: false, md: true });
    const direction = isLandscape ? 'row' : 'column';
    const inputWidth = isLandscape ? '50%' : '100%';
    const dropdownWidth = isLandscape ? '50%' : '100%';

    // Inside your component, before the return statement:

const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
}, [setSearchTerm]);

const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
}, [setStatusFilter]);

const handleSortOptionChange = useCallback((value: string) => {
    setSortOption(value);
}, [setSortOption]);


    return (
        <HStack
            w="100%"
            pb="10px"
            spacing={direction === 'column' ? 0 : 5}
            justifyContent="space-between"
            flexDirection={direction}
            alignItems={direction === 'column' ? 'stretch' : 'center'}
        >
            <InputGroup w={inputWidth} h="3.1rem">
                <Input
                    fontSize="14px"
                    placeholder="Search for Game ID"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    bg="brand.modalGray"
                    border="0.1rem solid"
                    borderColor="rgba(88, 101, 133, 0.46)"
                    borderRadius="1rem"
                    color="brand.white85"
                    height="3.1rem"
                    fontWeight="700"
                    fontFamily="Nunito Sans, sans-serif"
                    pr="44px"
                />
                <InputRightElement h="3.1rem" pr="16px" pointerEvents="none">
                    <FaSearch size={18} color="rgba(255,255,255,0.5)" />
                </InputRightElement>
            </InputGroup>
            <HStack
                spacing={isLandscape ? 2 : 3}
                w={dropdownWidth}
                flexDirection="row"
                alignItems="center"
                mt={direction === 'column' ? 3 : 0}
            >
                <Box w={isLandscape ? '50%' : '100%'}>
                    <Menu matchWidth>
                        {({ isOpen }) => (
                            <>
                                <MenuButton
                                    as={Box}
                                    w="100%"
                                    height="3.1rem"
                                    px="16px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    bg="linear-gradient(180deg, rgba(28, 31, 41, 0.95) 0%, rgba(12, 14, 22, 0.95) 100%), rgba(12, 14, 22, 0.9)"
                                    borderRadius="1rem"
                                    border="0.1rem solid"
                                    borderColor="rgba(88, 101, 133, 0.28)"
                                    color="brand.white85"
                                    fontWeight="700"
                                    fontFamily="Nunito Sans, sans-serif"
                                    fontSize="14px"
                                    cursor="pointer"
                                    boxShadow="inset 0 1px 2px rgba(255,255,255,0.06), inset 0 -2px 4px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.45)"
                                >
                                    {statusOptions.find(
                                        (opt) =>
                                            opt.value ===
                                            (statusFilter === 'All Games'
                                                ? 'All'
                                                : statusFilter),
                                    )?.label || 'All'}
                                    <Icon
                                        as={
                                            isOpen
                                                ? ChevronUpIcon
                                                : ChevronDownIcon
                                        }
                                        ml={2}
                                        color="whiteAlpha.700"
                                        boxSize={5}
                                    />
                                </MenuButton>
                                <MenuList
                                    bg="brand.gray55"
                                    borderRadius="1rem"
                                    border="0.1rem solid"
                                    borderColor="rgba(88, 101, 133, 0.2)"
                                    py={2}
                                    px={0}
                                    minW="100%"
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            onClick={() =>
                                                handleStatusFilterChange(option.value)
                                            }
                                            bg="transparent"
                                            color="white"
                                            fontWeight="700"
                                            fontFamily="Nunito Sans, sans-serif"
                                            fontSize="14px"
                                            _hover={{ bg: 'brand.gray45' }}
                                            py={3}
                                            pl={3}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </>
                        )}
                    </Menu>
                </Box>
                <Box w={isLandscape ? '50%' : '100%'}>
                    <Menu matchWidth>
                        {({ isOpen }) => (
                            <>
                                <MenuButton
                                    as={Box}
                                    w="100%"
                                    height="3.1rem"
                                    px="16px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    bg="linear-gradient(180deg, rgba(28, 31, 41, 0.95) 0%, rgba(12, 14, 22, 0.95) 100%), rgba(12, 14, 22, 0.9)"
                                    borderRadius="1rem"
                                    border="0.1rem solid"
                                    borderColor="rgba(88, 101, 133, 0.28)"
                                    color="brand.white85"
                                    fontWeight="700"
                                    fontFamily="Nunito Sans, sans-serif"
                                    fontSize="14px"
                                    cursor="pointer"
                                    boxShadow="inset 0 1px 2px rgba(255,255,255,0.06), inset 0 -2px 4px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.45)"
                                >
                                    {sortOptions.find(
                                        (opt) => opt.value === sortOption,
                                    )?.label || 'Sort'}
                                    <Icon
                                        as={
                                            isOpen
                                                ? ChevronUpIcon
                                                : ChevronDownIcon
                                        }
                                        ml={2}
                                        color="whiteAlpha.700"
                                        boxSize={5}
                                    />
                                </MenuButton>
                                <MenuList
                                    bg="brand.gray50"
                                    borderRadius="1rem"
                                    border="0.1rem solid"
                                    borderColor="rgba(88, 101, 133, 0.46)"
                                    py={2}
                                    px={0}
                                    minW="100%"
                                >
                                    {sortOptions.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            onClick={() =>
                                                handleSortOptionChange(option.value)
                                            }
                                            bg="transparent"
                                            color="white"
                                            fontWeight="700"
                                            fontFamily="Nunito Sans, sans-serif"
                                            fontSize="14px"
                                            _hover={{ bg: 'brand.gray45' }}
                                            py={3}
                                            pl={3}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </>
                        )}
                    </Menu>
                </Box>
            </HStack>
        </HStack>
    );
};

export default React.memo(GameHistoryControls);
