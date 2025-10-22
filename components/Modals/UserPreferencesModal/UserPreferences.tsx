import React from 'react';
import {
    VStack,
    FormControl,
    FormLabel,
    Text,
    useToast,
    useBreakpointValue,
    Box,
    HStack,
} from '@chakra-ui/react';
import useViewer from '../../hooks/useViewer';
import { SwitchWithIcon } from './SwitchWithIcon';
import Image from 'next/image';
import { useWSMutation } from '../../websocket/hooks/useWSMutation';

export const UserPreferences = () => {
    const isPortrait = useBreakpointValue({
        base: true,
        md: true,
        lg: false,
        xl: false,
    });

    // const updatePreferences = useMutation(api.users.updateUserPreferences);


    // const handleStraddleToggle = async (
    //     e: React.ChangeEvent<HTMLInputElement>,
    // ) => {
    //     try {
    //         await updatePreferences({
    //             pokerPreferences: {
    //                 theme: 'GREEN',
    //                 autoStraddle: e.target.checked ?? false, // Default to false if undefined
    //                 fourColorDeck:
    //                     user?.pokerPreferences?.fourColorDeck ?? false, // Default to false if undefined
    //                 displayAmountsInBigBlinds:
    //                     user?.pokerPreferences?.displayAmountsInBigBlinds ??
    //                     false, // Default to false if undefined
    //                 autoActivateExtraTime:
    //                     user?.pokerPreferences?.autoActivateExtraTime ?? true, // Default to true if undefined
    //                 keyboardShortcuts:
    //                     user?.pokerPreferences?.keyboardShortcuts ?? true, // Default to true if undefined
    //             },
    //         });
    //     } catch (error) {
    //         // More detailed error message
    //         const errorMessage =
    //             error instanceof Error ? error.message : 'Unknown error';
    //         console.error('Error updating preferences:', errorMessage);
    //     }
    // };

    // const handleFourColorDeckToggle = async (
    //     e: React.ChangeEvent<HTMLInputElement>,
    // ) => {
    //     try {
    //         await updatePreferences({
    //             pokerPreferences: {
    //                 theme: 'GREEN',
    //                 autoStraddle: user?.pokerPreferences?.autoStraddle ?? false, // Default to false if undefined
    //                 fourColorDeck: e.target.checked ?? false, // Default to false if undefined
    //                 displayAmountsInBigBlinds:
    //                     user?.pokerPreferences?.displayAmountsInBigBlinds ??
    //                     false, // Default to false if undefined
    //                 autoActivateExtraTime:
    //                     user?.pokerPreferences?.autoActivateExtraTime ?? true, // Default to true if undefined
    //                 keyboardShortcuts:
    //                     user?.pokerPreferences?.keyboardShortcuts ?? true, // Default to true if undefined
    //             },
    //         });
    //     } catch (error) {
    //         const errorMessage =
    //             error instanceof Error ? error.message : 'Unknown error';
    //         console.error('Error updating preferences:', errorMessage);
    //     }
    // };

    // const handleDisplayAmountsInBigBlindsToggle = async (
    //     e: React.ChangeEvent<HTMLInputElement>,
    // ) => {
    //     try {
    //         updatePreferences({
    //             pokerPreferences: {
    //                 theme: 'GREEN',
    //                 autoStraddle: user?.pokerPreferences?.autoStraddle ?? false, // Default to false if undefined
    //                 fourColorDeck:
    //                     user?.pokerPreferences?.fourColorDeck ?? false, // Default to false if undefined
    //                 displayAmountsInBigBlinds: e.target.checked ?? false, // Default to false if undefined
    //                 autoActivateExtraTime:
    //                     user?.pokerPreferences?.autoActivateExtraTime ?? true, // Default to true if undefined
    //                 keyboardShortcuts:
    //                     user?.pokerPreferences?.keyboardShortcuts ?? true, // Default to true if undefined
    //             },
    //         });
    //     } catch (error) {
    //         const errorMessage =
    //             error instanceof Error ? error.message : 'Unknown error';
    //         console.error('Error updating preferences:', errorMessage);
    //     }
    // };

    // const handleAutoActivateExtraTimeToggle = async (
    //     e: React.ChangeEvent<HTMLInputElement>,
    // ) => {
    //     try {
    //         await updatePreferences({
    //             pokerPreferences: {
    //                 theme: 'GREEN',
    //                 autoStraddle: user?.pokerPreferences?.autoStraddle ?? false,
    //                 fourColorDeck:
    //                     user?.pokerPreferences?.fourColorDeck ?? false,
    //                 displayAmountsInBigBlinds:
    //                     user?.pokerPreferences?.displayAmountsInBigBlinds ??
    //                     false,
    //                 autoActivateExtraTime: e.target.checked ?? true,
    //                 keyboardShortcuts:
    //                     user?.pokerPreferences?.keyboardShortcuts ?? true,
    //             },
    //         });
    //     } catch (error) {
    //         const errorMessage =
    //             error instanceof Error ? error.message : 'Unknown error';
    //         console.error('Error updating preferences:', errorMessage);
    //     }
    // };

    // const handleKeyboardShortcutsToggle = async (
    //     e: React.ChangeEvent<HTMLInputElement>,
    // ) => {
    //     try {
    //         await updatePreferences({
    //             pokerPreferences: {
    //                 theme: 'GREEN',
    //                 autoStraddle: user?.pokerPreferences?.autoStraddle ?? false,
    //                 fourColorDeck:
    //                     user?.pokerPreferences?.fourColorDeck ?? false,
    //                 displayAmountsInBigBlinds:
    //                     user?.pokerPreferences?.displayAmountsInBigBlinds ??
    //                     false,
    //                 autoActivateExtraTime:
    //                     user?.pokerPreferences?.autoActivateExtraTime ?? true,
    //                 keyboardShortcuts: e.target.checked ?? true,
    //             },
    //         });
    //     } catch (error) {
    //         const errorMessage =
    //             error instanceof Error ? error.message : 'Unknown error';
    //         console.error('Error updating preferences:', errorMessage);
    //     }
    // };

    return (
        <VStack
            spacing={2}
            align="stretch"
            width="100%"
            p={1}
            minW={isPortrait ? '320px' : '480px'}
        >
            <Box
                bg="brand.gray50"
                borderRadius="lg"
                border="0.1rem solid"
                borderColor="brand.gray45"
                p={3.5}
                mb={0.5}
            >
                <FormControl
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <VStack align="start" spacing={0.5}>
                        <FormLabel color="whiteAlpha.800" htmlFor="auto-straddle" mb="0">
                            Auto-Straddle UTG
                        </FormLabel>
                        <Text fontSize="sm" color="gray.500">
                            Place 2BB straddle bet from UTG position
                        </Text>
                    </VStack>
                            {/* <SwitchWithIcon
                                id="auto-straddle"
                                isChecked={!!user?.pokerPreferences?.autoStraddle}
                                onChange={handleStraddleToggle}
                            /> */}
                </FormControl>
            </Box>
            <Box
                bg="brand.gray50"
                borderRadius="lg"
                border="0.1rem solid"
                borderColor="brand.gray45"
                p={3.5}
                mb={0.5}
            >
                <FormControl
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <VStack align="start" spacing={0.5}>
                        <FormLabel color="whiteAlpha.800" htmlFor="four-color-deck" mb="0">
                            Four Color Deck
                        </FormLabel>
                        <Text fontSize="sm" color="gray.500">
                            Use a four color deck for better card visibility
                        </Text>
                    </VStack>
                    <SwitchWithIcon
                        id="four-color-deck"
                        isChecked={false}
                        onChange={() => {}}
                    />
                </FormControl>
            </Box>
            <Box
                bg="brand.gray50"
                borderRadius="lg"
                border="0.1rem solid"
                borderColor="brand.gray45"
                p={3.5}
                mb={0.5}
            >
                <FormControl
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <VStack align="start" spacing={0.5}>
                        <FormLabel color="whiteAlpha.800" htmlFor="display-amounts-in-big-blinds" mb="0">
                            Display Amounts in Big Blinds
                        </FormLabel>
                        <Text fontSize="sm" color="gray.500">
                            Show amounts in big blinds instead of dollars
                        </Text>
                    </VStack>
                    <SwitchWithIcon
                        id="display-amounts-in-big-blinds"
                        isChecked={
                            false
                        }
                        onChange={() => {}}
                    />
                </FormControl>
            </Box>
            <Box
                bg="brand.gray50"
                borderRadius="lg"
                border="0.1rem solid"
                borderColor="brand.gray45"
                p={3.5}
                mb={0.5}
            >
                <FormControl
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <VStack align="start" spacing={0.5}>
                        <FormLabel color="whiteAlpha.800" htmlFor="auto-activate-extra-time" mb="0">
                            Auto Activate Extra Time
                        </FormLabel>
                        <Text fontSize="sm" color="gray.500">
                            Default activate extra time when it is your turn
                        </Text>
                    </VStack>
                    <SwitchWithIcon
                        id="auto-activate-extra-time"
                        isChecked={
                            true
                        }
                        onChange={() => {}}
                    />
                </FormControl>
            </Box>
            <Box
                bg="brand.gray50"
                borderRadius="lg"
                border="0.1rem solid"
                borderColor="brand.gray45"
                p={3.5}
                mb={0.5}
            >
                <FormControl
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <VStack align="start" spacing={0.5}>
                        <FormLabel color="whiteAlpha.800" htmlFor="keyboard-shortcuts" mb="0">
                            Keyboard Shortcuts
                        </FormLabel>
                        <Text fontSize="sm" color="gray.500">
                            Enable keyboard shortcut hotkeys for poker actions
                        </Text>
                    </VStack>
                    <SwitchWithIcon
                        id="keyboard-shortcuts"
                        isChecked={
                            true
                        }
                        onChange={() => {}}
                    />
                </FormControl>
            </Box>
        </VStack>
    );
};
