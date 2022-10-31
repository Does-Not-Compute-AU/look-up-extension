import { useState, useEffect } from 'react'
import { Storage } from "@plasmohq/storage"
import { getToken } from "~utils/options";
const storage = new Storage({
    area: "sync"
})

const TOKEN_KEY = "up-api-token";

export default function useToken() {
    const [token, setToken] = useState<string>(null);
    const [storedToken, setStoredToken] = useState<string>('');

    useEffect(() => {
        getToken().then(token => {
            setToken(token)
            setStoredToken(token)
        })
    }, [])

    const saveToken = async () => {
        await storage.set(TOKEN_KEY, token)
        setStoredToken(token)
    }

    const clearToken = async () => {
        await storage.remove(TOKEN_KEY)
        setToken('')
        setStoredToken('')
    }

    const fetchToken = async () => {
        const token = await getToken()
        setToken(token)
        setStoredToken(token)
        return token
    }

    return {token, storedToken, setToken, saveToken, clearToken, fetchToken}
}
