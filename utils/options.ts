import { Storage } from "@plasmohq/storage";

const storage = new Storage({
    area: "sync"
});

const TOKEN_KEY = "up-api-token";
const BADGE_OPTION_KEY = "badge-display-option";
const LAST_TRANSACTION_KEY = "show-last-transaction";

const defaults = {
    BADGE_OPTION: "total",
    LAST_TRANSACTION_OPTION: true
}


export const getToken = async () => {
    return await storage.get(TOKEN_KEY);
};

export const getBadgeOption = async () => {
    return await storage.get(BADGE_OPTION_KEY) ?? defaults.BADGE_OPTION;
};

export const getLastTransactionOption = async () => {
    return await storage.get(LAST_TRANSACTION_KEY) ?? defaults.LAST_TRANSACTION_OPTION;
};

export const storageSetBadgeOption = async (value) => {
    await storage.set(BADGE_OPTION_KEY, value);
};

export const storageSetLastTransactionOption = async (value) => {
    await storage.set(LAST_TRANSACTION_KEY, value);
};
