import {
    Box,
    Button,
    Flex,
    HStack,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { PokerGameState } from '../../../../../client';
import CardBack from '../../../Shared/Card/CardBack';
import Card from '../../../Shared/Card/Card';
import { SUIT } from '../../../Shared/Card/Suits';
import { ViewIcon } from '@chakra-ui/icons';
import useGameData from '../../../../hooks/useGameData';

export const CommunityCards = () => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const [flipped, setFlipped] = useState<boolean[]>(Array(5).fill(false));
    const [flippedSecond, setFlippedSecond] = useState<boolean[]>(
        Array(5).fill(false),
    );

    const [shouldReveal, setShouldReveal] = useState(false);
    const {
        gameState,
        gameSettings,
        rabbitHuntBoard,
        rabbitHuntSecondBoard,
        board,
        runItTwice,
    } = useGameData();

    const rabbitHuntEnabled = gameSettings?.rabbit_hunt;
    const isShowdown = gameState === PokerGameState.SHOWDOWN;

    const cardPlacementTop = isPortrait ? '34%' : 'min(32.25%, 17vmin)';
    const cardPlacementLeft = isPortrait ? '0%' : '0%';
    const cardPlacementTopSecond = isPortrait
        ? '41%'
        : 'calc(min(33%, 17vmin) + 5.8vmin)';

    const cornerValueSize = isPortrait ? '2.3vmax' : 'min(2.9vmin, 1.85vmax)';

    let displayCards = board;
    if (shouldReveal) {
        displayCards = [...board, ...rabbitHuntBoard];
    }

    let secondBoard: any[] = [];
    {
        const mainBoardKeys = new Set(
            board.map((card: any) =>
                card ? `${card.value}_${card.suit}` : '',
            ),
        );

        // Start with slots for 5 community cards on the second board
        const slots: (any | null)[] = Array(5).fill(null);

        // Place actual second board cards into their natural indices if valid and not duplicates of main board
        const rawSecond = runItTwice?.second_board ?? [];
        for (let i = 0; i < Math.min(5, rawSecond.length); i++) {
            const c = rawSecond[i];
            if (!c) continue;
            const key = `${c.value}_${c.suit}`;
            if (mainBoardKeys.has(key)) continue;
            slots[i] = c;
        }

        // On reveal, place rabbit-hunt second-board cards specifically into the 4th/5th positions
        if (shouldReveal && Array.isArray(rabbitHuntSecondBoard)) {
            const existingKeys = new Set(
                slots.filter(Boolean).map((c: any) => `${c.value}_${c.suit}`),
            );
            const filteredRH = rabbitHuntSecondBoard.filter((c: any) => {
                if (!c) return false;
                const key = `${c.value}_${c.suit}`;
                return !mainBoardKeys.has(key) && !existingKeys.has(key);
            });

            if (filteredRH.length === 1) {
                // Single rabbit hunt card goes to the 5th slot if empty, otherwise 4th
                if (slots[4] === null) {
                    slots[4] = filteredRH[0];
                } else if (slots[3] === null) {
                    slots[3] = filteredRH[0];
                }
            } else if (filteredRH.length >= 2) {
                // Two or more: fill 4th then 5th
                if (slots[3] === null) slots[3] = filteredRH[0];
                if (slots[4] === null) slots[4] = filteredRH[1] ?? slots[4];
            }
        }

        secondBoard = slots;
    }

    const jsonCards = JSON.stringify(displayCards);
    const jsonSecondCards = JSON.stringify(secondBoard);

    useEffect(() => {
        if (displayCards.length === 0) {
            setFlipped(Array(5).fill(false));
            return;
        }
        setFlipped((prev) => {
            const newFlipped = [...prev];
            for (let i = prev.length - 1; i >= 0; i--) {
                if (i >= displayCards?.length) {
                    newFlipped[i] = false;
                }
            }
            return newFlipped;
        });
        setTimeout(() => {
            setFlipped(
                Array.from(
                    { length: 5 },
                    (_, index) => index < displayCards?.length,
                ),
            );
        }, 400);
    }, [jsonCards]);

    useEffect(() => {
        // Count only revealed (non-null) cards on the second board
        const visibleCount = secondBoard.filter((c: any) => c).length;

        if (visibleCount === 0) {
            setFlippedSecond(Array(5).fill(false));
            return;
        }

        // Ensure any empty slots are reset to not-flipped
        setFlippedSecond((prev) => {
            const next = [...prev];
            for (let i = 0; i < 5; i++) {
                if (!secondBoard[i]) {
                    next[i] = false;
                }
            }
            return next;
        });

        const t = setTimeout(() => {
            // Flip only the indices that currently have a card,
            // keep others as-is. Once flipped, do not flip again.
            setFlippedSecond((prev) =>
                prev.map((v, i) => (secondBoard[i] ? true : v)),
            );
        }, 400);

        return () => clearTimeout(t);
    }, [jsonSecondCards]);

    const handleReveal = () => {
        setShouldReveal(true);
    };

    useEffect(() => {
        if (gameState !== PokerGameState.SHOWDOWN) {
            setShouldReveal(false);
        }
    }, [gameState]);

    // Main board: use original rendering logic (with animations/positions)
    const renderMainBoard = () => (
        <HStack
            position="absolute"
            w="100%"
            justifyContent="center"
            spacing={isPortrait ? '1.25%' : '0.7vmin'}
            top={cardPlacementTop}
            left={cardPlacementLeft}
            zIndex={2}
        >
            {Array.from({ length: displayCards?.length || 0 }).map(
                (_, index) => (
                    <Box
                        key={index}
                        h={isPortrait ? '7.95vmax' : 'min(10.25vmin, 7.25vmax)'}
                        w={isPortrait ? '6vmax' : 'min(7.75vmin, 5.5vmax)'}
                        transition="all 0.5s ease"
                        position={
                            index === 1 || index === 2 ? 'relative' : 'static'
                        }
                        left={index === 1 || index === 2 ? '-10%' : '0'}
                        zIndex={index === 2 ? 2 : index === 1 ? 1 : 0}
                        animation={
                            index === 1 || index === 2
                                ? 'slideIn 0.5s forwards'
                                : 'none'
                        }
                    >
                        <Card
                            value={displayCards?.[index]?.value}
                            suit={displayCards?.[index]?.suit as SUIT}
                            state={displayCards?.[index]?.state}
                            cardIndex={index}
                            cornerSpacing={'-0.1rem'}
                            cornerSize={
                                isPortrait
                                    ? '1.5vmax'
                                    : 'min(2.1vmin, 1.35vmax)'
                            }
                            cornerValueSize={cornerValueSize}
                            cornerMarginTop={
                                isPortrait ? '-0.4vmax' : '-0.4vmin'
                            }
                            hideCursor
                            shouldAnimate
                            isFlipped={index >= 3 ? !flipped[index] : false}
                            showSecondarySuit={true}
                            cornerValueSizeBottom={
                                isPortrait
                                    ? '3.25vmax'
                                    : 'min(4.35vmin, 3.25vmax)'
                            }
                            communityCard={true}
                        />
                    </Box>
                ),
            )}
            <Flex position="relative">
                {5 - (displayCards?.length || 0) > 0 &&
                    isShowdown &&
                    rabbitHuntEnabled && (
                        <Button
                            position="absolute"
                            bg="brand.darkestGray"
                            opacity="0.95"
                            borderRadius="1rem"
                            _hover={{ bg: 'brand.lightGray' }}
                            p={isPortrait ? '0.1vmax' : '0.1vmin'}
                            w="100%"
                            top={cardPlacementTop}
                            onClick={handleReveal}
                        >
                            <HStack>
                                <ViewIcon color="brand.white70" />
                                {displayCards.length < 4 && (
                                    <Text
                                        fontSize={
                                            isPortrait ? '1.75vmax' : '1.75vmin'
                                        }
                                    >
                                        Reveal
                                    </Text>
                                )}
                            </HStack>
                        </Button>
                    )}
                {Array.from({ length: 5 - (displayCards?.length || 0) }).map(
                    (_, index) => (
                        <Box
                            key={index}
                            h={isPortrait ? '8vmax' : 'min(10.85vmin, 7.5vmax)'}
                            w={
                                isPortrait
                                    ? '6.5vmax'
                                    : 'min(8.25vmin, 5.5vmax)'
                            }
                            transition="all 0.5s ease"
                            visibility={
                                isShowdown && rabbitHuntEnabled
                                    ? 'visible'
                                    : 'hidden'
                            }
                        >
                            <CardBack fill="black" h="100%" w="100%" />
                        </Box>
                    ),
                )}
            </Flex>
        </HStack>
    );

    // Second board: always render 5 slots, with empty slots for duplicates
    const renderSecondBoard = () => {
        // Compute visible (non-null) card indices for animation
        let visibleIdx = -1;
        return (
            <HStack
                position="absolute"
                w="100%"
                justifyContent="center"
                spacing={isPortrait ? '1.25%' : '0.7vmin'}
                top={cardPlacementTopSecond}
                left={cardPlacementLeft}
                zIndex={3}
            >
                {Array.from({ length: 5 }).map((_, index) => {
                    const card = secondBoard?.[index];
                    let thisVisibleIdx = null;
                    if (card) {
                        visibleIdx += 1;
                        thisVisibleIdx = visibleIdx;
                    }
                    return (
                        <Box
                            key={index}
                            h={
                                isPortrait
                                    ? '7.95vmax'
                                    : 'min(10.25vmin, 7.25vmax)'
                            }
                            w={
                                isPortrait
                                    ? '5.95vmax'
                                    : 'min(7.75vmin, 5.5vmax)'
                            }
                            transition="all 0.5s ease"
                            position={
                                index === 1 || index === 2
                                    ? 'relative'
                                    : 'static'
                            }
                            left={index === 1 || index === 2 ? '-10%' : '0'}
                            zIndex={index === 2 ? 2 : index === 1 ? 1 : 0}
                            animation={
                                card &&
                                (thisVisibleIdx === 1 || thisVisibleIdx === 2)
                                    ? 'slideIn 0.5s forwards'
                                    : 'none'
                            }
                        >
                            {card ? (
                                <Card
                                    value={card.value}
                                    suit={card.suit as SUIT}
                                    state={card.state}
                                    cardIndex={index}
                                    cornerSpacing={'-0.1rem'}
                                    cornerSize={
                                        isPortrait
                                            ? '1.5vmax'
                                            : 'min(2.1vmin, 1.35vmax)'
                                    }
                                    cornerValueSize={cornerValueSize}
                                    cornerMarginTop={
                                        isPortrait ? '-0.4vmax' : '-0.4vmin'
                                    }
                                    hideCursor
                                    shouldAnimate
                                    isFlipped={
                                        index >= 3
                                            ? !flippedSecond[index]
                                            : false
                                    }
                                    showSecondarySuit={true}
                                    cornerValueSizeBottom={
                                        isPortrait
                                            ? '3.25vmax'
                                            : 'min(4.35vmin, 3.25vmax)'
                                    }
                                    communityCard={true}
                                    shadowTop={true}
                                />
                            ) : null}
                        </Box>
                    );
                })}
            </HStack>
        );
    };

    return (
        <>
            {renderMainBoard()}
            {secondBoard.length > 0 && renderSecondBoard()}
        </>
    );
};

const styles = `
@keyframes slideIn {
    from {
        left: -10%;
    }
    to {
        left: 0;
    }
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}
