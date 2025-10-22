import { Box, Grid, GridItem } from '@chakra-ui/react';

import { ActionPanel } from './ActionPanel/ActionPanel';
import CardPanel from './CardPanel/CardPanel';
import { useHotkeyBlockingDisclosure } from '../../../../hooks/useHotkeyBlockingDisclosure';
import { ChatPanel } from './ChatPanel/ChatPanel';

export const LandscapeControls = () => {
    const { isOpen, onOpen, onClose } = useHotkeyBlockingDisclosure();

    return (
        <>
            <Grid
                color="white"
                templateColumns="repeat(12, 1fr)"
                gap={2}
                h="100%"
                w="100%"
            >
                <GridItem colSpan={3} zIndex={2} h="100%" position="relative">
                    <ChatPanel
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                    />
                </GridItem>
                <GridItem
                    gridColumn="span 6"
                    bg="brand.lightGray"
                    borderRadius="0.75rem"
                    // padding="6px"
                    h="100%"
                    zIndex={10}
                >
                    <ActionPanel />
                </GridItem>
                <GridItem
                    colSpan={3}
                    position="relative"
                    borderRadius="0.85rem"
                    padding="0.125rem"
                    bg="rgba(47, 51, 58, 0.50)"
                    filter="drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.5))"
                >
                    <Box
                        h="100%"
                        bg="brand.primaryGray"
                        border="0.075rem solid"
                        borderColor="rgba(34, 34, 34, 0.95)"
                        borderRadius="0.75rem"
                        w="100%"
                    >
                        <CardPanel />
                    </Box>
                </GridItem>
            </Grid>
        </>
    );
};
