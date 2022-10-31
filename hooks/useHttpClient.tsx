import useToken from '~hooks/useToken'

const URL = 'https://api.up.com.au/api/v1'

export default function useHttpClient() {
    const { token, fetchToken } = useToken()

    const get = async (endpoint, _token = undefined) => {
        if (!_token) {
            _token = token ?? (await fetchToken())
        }

        return getUrl(URL + endpoint, _token)
    }

    const getUrl = async (url, _token = undefined) => {
        if (!_token) {
            _token = token ?? (await fetchToken())
        }
        if (!_token) {
            throw new Error('could not get token')
        }
        const res = await fetch(url, { headers: { Authorization: 'Bearer ' + _token } })
        return res.json()
    }

    const ping = async (testToken: string) => {
        if (testToken) {
            return get('/util/ping', testToken)
        }
    }

    const getAccounts = async () => {
        return await get('/accounts')
    }

    const getTransactions = async (id, pageSize = 20) => {
        const endpoint = '/accounts/' + id + '/transactions/' + encodeURI('?page[size]=') + pageSize
        return await get(endpoint)
    }

    const getNextTransactions = async (link) => {
        return await getUrl(link)
    }

    return { ping, getAccounts, getTransactions, getNextTransactions }
}