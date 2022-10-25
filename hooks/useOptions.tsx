import { useState, useEffect } from 'react'
import { getBadgeOption, storageSetBadgeOption, getLastTransactionOption, storageSetLastTransactionOption } from "~/utils/options";

export default function useOptions() {
    const [badgeOption, _setBadgeOption] = useState<string>('');
    const [lastTransactionOption, _setLastTransactionOption] = useState<boolean>(true);

    useEffect(() => {
        getBadgeOption().then(setBadgeOption)
        getLastTransactionOption().then(setLastTransactionOption)
    }, [])

    const setBadgeOption = async (value) => {
        await storageSetBadgeOption(value)
        _setBadgeOption(value)
    }

    const setLastTransactionOption = async (value) => {
        await storageSetLastTransactionOption(value)
        _setLastTransactionOption(value)
    }

    return {badgeOption, setBadgeOption, lastTransactionOption, setLastTransactionOption}
}
