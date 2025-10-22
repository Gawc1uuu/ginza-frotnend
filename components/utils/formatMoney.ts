import useViewer from '../hooks/useViewer';

export const formatMicroDollars = (amount?: number): string => {
    if (!amount) return '0.00';
    return (amount / 1e6)?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatMicroDollarsBigInt = (amount?: bigint): string => {
    if (!amount || amount === 0n) return '0.00';

    const dollars = amount / 1000000n;
    const microdollarRemainder = amount % 1000000n;

    const cents = microdollarRemainder / 10000n;

    const formattedDollars = dollars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const formattedCents = cents.toString().padStart(2, '0');

    return `${formattedDollars}.${formattedCents}`;
};

export const toMicroDollars = (amount: number): number => {
    return Math.round(amount * 1e6);
};

export const formatMicroDollarsWithCommas = (amount: number): string => {
    return (amount / 1e6)?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatMoneyWithCommas = (amount: number): string => {
    return amount?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatMoneyStringWithCommas = (amount: string): string => {
    const num = parseFloat(amount || '0');
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatBlindsWithSymbol = (
    smallBlind: number,
    bigBlind: number,
): string => {
    return `$${formatMicroDollarsWithCommas(smallBlind)}/$${formatMicroDollarsWithCommas(bigBlind)}`;
};
