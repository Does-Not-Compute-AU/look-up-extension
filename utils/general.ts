export const UP_API_TOKEN_URL = 'https://api.up.com.au/getting_started'

export const formatBadgeNumber = (amount: string) => {
    if (!amount) {
        return amount;
    }
    const number = Number(amount);
    if (number >= 1_000_000) {
        return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 100_000) {
        return (number / 1000).toFixed(0) + "K";
    } else if (number >= 10_000) {
        return (number / 1000).toFixed(1) + "K";
    } else if (number >= 1_000) {
        return (number / 1000).toFixed(2) + "K";
    } else if (number >= 100) {
        return amount.toString();
        // return Math.round(number).toString()
    } else {
        return amount.toString();
    }
};

export const parseBaseUnit = (value: number) => {
    if (!value) {
        return value;
    }
    if (value < 0) {
        return "$" + Math.abs(value / 100);
    }
    return "+$" + value / 100;
};
