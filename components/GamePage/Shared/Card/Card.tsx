import { Box, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

import { oswald } from '../../../../tools/fonts';
import Cloves from '../../../../public/Cards/Cloves.svg';
import Diamonds from '../../../../public/Cards/Diamonds.svg';
import Hearts from '../../../../public/Cards/Hearts.svg';
import Spades from '../../../../public/Cards/Spades.svg';
import { useShowCard } from '../../../hooks/useShowCard';

import { CardState } from '../../../../client';
import { getCardStyles } from '../../../utils/getCardStyles';
import { SUIT, VALUE } from './Suits';
import { CardCorner } from './CardCorner';
import {
    valueToString,
    fourColorDeckBackgroundColors,
    fourColorDeckLightBorderColors,
    fourColorDeckDarkBorderColors,
} from './CardConstants';
import useViewer from '../../../hooks/useViewer';

interface CardProps {
    cardIndex: number;
    cornerSize?: string;
    cornerValueSize?: string;
    cornerMarginTop?: string;
    cornerSpacing?: string;
    suit: SUIT;
    value: VALUE;
    state?: CardState;
    isFlipped: boolean;
    hideCursor?: boolean;
    shouldAnimate?: boolean;
    showSuit?: boolean;
    showSecondarySuit?: boolean;
    cornerValueSizeBottom?: string;
    communityCard?: boolean;
    shadowTop?: boolean;
}

const suitToSVG = {
    [SUIT.SPADES]: Spades,
    [SUIT.CLUBS]: Cloves,
    [SUIT.HEARTS]: Hearts,
    [SUIT.DIAMONDS]: Diamonds,
};

export const Card = ({
    value,
    suit,
    state,
    cardIndex,
    cornerSize = '1.75rem',
    cornerValueSize = '2.75rem',
    cornerMarginTop = '-0.5rem',
    cornerSpacing = '-0.5rem',
    isFlipped,
    hideCursor = false,
    shouldAnimate = false,
    showSuit = true,
    showSecondarySuit = true,
    cornerValueSizeBottom,
    communityCard = false,
    shadowTop = false,
}: CardProps) => {
    const { showCard } = useShowCard();
    const { user } = useViewer();
    const SuitSVG = suitToSVG[suit];
    const isPortrait = useBreakpointValue({
        base: true,
        sm: true,
        lg: false,
        xl: false,
    });

    const isFourColorDeck = user?.pokerPreferences?.fourColorDeck ?? false;
    const cardTextColor = isFourColorDeck ? 'white' : 'black';
    const cardBackgroundColor = isFourColorDeck
        ? fourColorDeckBackgroundColors[suit]
        : 'white';
    const lightBorder = isFourColorDeck
        ? fourColorDeckLightBorderColors[suit]
        : '#E5E5E5';
    const darkBorder = isFourColorDeck
        ? fourColorDeckDarkBorderColors[suit]
        : '#A0A0A0';

    return (
        <Flex
            className={`card ${isFlipped ? 'flipped' : ''} ${oswald.className} ${hideCursor ? 'hide-cursor' : ''}`}
            fontFamily={oswald.style.fontFamily}
            w="100%"
            h="100%"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            // transition="all 0.3s ease"
            position="relative"
            onClick={() => showCard(cardIndex)}
            style={getCardStyles(state ?? CardState.NORMAL, shouldAnimate)}
            color={cardTextColor}
        >
            <Box
                borderRadius="6px"
                w="100%"
                h="100%"
                className={`card-inner ${isFlipped ? 'flip-animation' : ''}`}
            >
                {/* Card Front */}
                <Box
                    bg={cardBackgroundColor}
                    borderRadius={isPortrait ? '0.5vmax' : '0.55vmin'}
                    width="100%"
                    height="100%"
                    className="card-front"
                    boxShadow={
                        shadowTop
                            ? `${communityCard ? '0px 2.25px 1.25px 0px #16261E, ' : ''}0 -8px 16px -8px rgba(0,0,0,0.5)`
                            : communityCard
                              ? '0px 2.25px 0.5px #16261E, 0 8px 14px -6px rgba(0,0,0,0.5)'
                              : 'none'
                    }
                    style={{
                        backfaceVisibility: 'hidden',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        transform: isFlipped
                            ? 'rotateY(120deg)'
                            : 'rotateY(0deg)',
                        transition: 'transform 0.25s',
                    }}
                >
                    <Flex
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        position="absolute"
                        top={cornerMarginTop}
                        left="0"
                        mb={isPortrait ? '0.3vmax' : '0.5vmax'}
                        ml={isPortrait ? '0.4vmax' : '0.4vmin'}
                    >
                        <CardCorner
                            cornerSize={cornerSize}
                            cornerValueSize={cornerValueSize}
                            cornerSpacing={cornerSpacing}
                            value={value as VALUE}
                            suit={suit as SUIT}
                            showSecondarySuit={showSecondarySuit}
                            isFourColorDeck={isFourColorDeck}
                        />
                    </Flex>
                    {/* Simulated bevel: light on top/left, dark on bottom/right */}
                    {isFourColorDeck && (
                        <Box
                            pointerEvents="none"
                            position="absolute"
                            inset={0}
                            borderRadius={isPortrait ? '0.5vmax' : '0.55vmin'}
                            boxShadow={`inset 0px 1px 0.5px 0px ${lightBorder}, inset 1px 0 0.5px 0px ${lightBorder}, inset 0 1px 0.5px -2px ${lightBorder}, inset 0.5px 0 0.25px -0.5px ${darkBorder}`}
                        />
                    )}
                    {/* Left edge gradient: lighter at top, darker at bottom (applies to all cards) */}
                    <Box
                        pointerEvents="none"
                        position="absolute"
                        top={0}
                        left={-0.5}
                        h="100%"
                        // w="100%"
                        ml="0.125rem"
                        borderTopLeftRadius={
                            isPortrait ? '0.5vmax' : '0.55vmin'
                        }
                        borderBottomLeftRadius={
                            isPortrait ? '1.5vmax' : '0.55vmin'
                        }
                        background={`linear-gradient(180deg, ${lightBorder} 0%, ${darkBorder} 100%)`}
                        // opacity={0.9}
                    />
                    <Flex
                        position="absolute"
                        right="0"
                        bottom="0"
                        mr={
                            isFourColorDeck
                                ? isPortrait
                                    ? '0.65vmax'
                                    : '0.75vmin'
                                : isPortrait
                                  ? '0.3vmax'
                                  : '0.3vmin'
                        }
                        mb={
                            isFourColorDeck
                                ? isPortrait
                                    ? '0.15vmax'
                                    : '0.1vmin'
                                : isPortrait
                                  ? '0.3vmax'
                                  : '0.3vmin'
                        }
                        zIndex={100}
                    >
                        {showSuit &&
                            (isFourColorDeck ? (
                                <Box>
                                    <Text
                                        fontSize={cornerValueSizeBottom}
                                        fontWeight="700"
                                        fontFamily={oswald.style.fontFamily}
                                        color={cardTextColor}
                                        textShadow="0 0 0.5px"
                                    >
                                        {valueToString[value]}
                                    </Text>
                                </Box>
                            ) : (
                                SuitSVG && <SuitSVG
                                    height="100%"
                                    width="100%"
                                    alt={`${suit} symbol`}
                                    style={{ fill: cardTextColor }}
                                />
                            ))}
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};

export default Card;
