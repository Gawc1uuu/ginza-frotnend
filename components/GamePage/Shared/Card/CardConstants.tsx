import { SUIT, VALUE } from './Suits';

const valueToString = {
    [VALUE.TWO]: '2',
    [VALUE.THREE]: '3',
    [VALUE.FOUR]: '4',
    [VALUE.FIVE]: '5',
    [VALUE.SIX]: '6',
    [VALUE.SEVEN]: '7',
    [VALUE.EIGHT]: '8',
    [VALUE.NINE]: '9',
    [VALUE.TEN]: '10',
    [VALUE.JACK]: 'J',
    [VALUE.QUEEN]: 'Q',
    [VALUE.KING]: 'K',
    [VALUE.ACE]: 'A',
};

// Subtle top-left → bottom-right gradients tuned per suit to match the reference look
const fourColorDeckBackgroundColors = {
    [SUIT.SPADES]: 'linear-gradient(160deg, #33383D 0%, #191E22 100%)',
    [SUIT.CLUBS]: 'linear-gradient(160deg, #379649 0%, #134F27 100%)',
    [SUIT.HEARTS]: 'linear-gradient(160deg, #C33A2B 0%, #731A12 100%)',
    [SUIT.DIAMONDS]: 'linear-gradient(160deg, #2F66C7 0%, #12305E 100%)',
};

// Split border colors so top/left can be lighter and bottom/right darker
const fourColorDeckLightBorderColors = {
    [SUIT.SPADES]: '#5A6068',
    [SUIT.CLUBS]: '#5BA76A',
    [SUIT.HEARTS]: '#D05544',
    [SUIT.DIAMONDS]: '#5A81C4',
};

const fourColorDeckDarkBorderColors = {
    [SUIT.SPADES]: '#0F1215',
    [SUIT.CLUBS]: '#0C2F18',
    [SUIT.HEARTS]: '#4F120C',
    [SUIT.DIAMONDS]: '#0F274E',
};

export {
    valueToString,
    fourColorDeckBackgroundColors,
    fourColorDeckLightBorderColors,
    fourColorDeckDarkBorderColors,
};
