import { currencyMap } from "~utils/currencyMap";

export const UP_API_TOKEN_URL = 'https://api.up.com.au/getting_started'
const SI_KILO = "k"
const SI_MEGA = "M"

export const formatBadgeNumber = (amount: string) => {
    if (!amount) {
        return amount;
    }
    const number = Number(amount);
    if (number >= 1_000_000) {
        return (number / 1000000).toFixed(1) + SI_MEGA;
    } else if (number >= 100_000) {
        return (number / 1000).toFixed(0) + SI_KILO;
    } else if (number >= 10_000) {
        return (number / 1000).toFixed(1) + SI_KILO;
    } else if (number >= 1_000) {
        return (number / 1000).toFixed(2) + SI_KILO;
    } else if (number >= 100) {
        return "$" + Math.floor(number).toString()
    } else {
        return amount.toString();
    }
};

export const formatBaseUnit = (value: number, signed = true, currencyCode = "AUD") => {
    const sign = value > 0 && signed ? "+" : ""
    return sign + (currencyMap[currencyCode] ?? '') + Math.abs(value / 100)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+(\.|$))/g, '$&,')
        .replace('.00', '');
};



export const formatUpsiderUsername = (input: string) => {
    if (!input || !input.includes("$")) {
        return input;
    }
    let formattedParts = [];
    const parts = input.split(" ");
    if (parts.some(part => part.startsWith("$"))) {
        parts.forEach(part => {
            if (part.startsWith("$")) {
                formattedParts.push(<span className={"text-[#ff7a64] text-sm "}>{"$"}</span>);
                formattedParts.push(part.replace("$", ""));
            } else {
                formattedParts.push(part + " ");
            }
        });
    } else {
        return input;
    }

    return <div>{formattedParts.map(p => p)}</div>;
};

export const dateToTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-AU', {
        hour: 'numeric',
        minute: 'numeric',
    }).replace(' ', '')
}
