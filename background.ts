import { formatBadgeNumber } from '~utils/lib'
import { getBadgeOption, getToken } from '~utils/options'

const { setBadgeText, setBadgeBackgroundColor } = chrome.action

const URL = 'https://api.up.com.au/api/v1'

let token = ''
let badgeOption = ''
getToken().then((res) => {
    token = res
    getAccounts()
})
getBadgeOption().then((res) => (badgeOption = res))

async function getAccounts(data?: any) {
    if (!token) {
        token = await getToken()
    }
    if (!token) {
        setBadgeText({ text: '' })
        return
    }
    const get = async (endpoint, _token = token) => {
        const res = await fetch(URL + endpoint, { headers: { Authorization: 'Bearer ' + _token } })
        return res.json()
    }
    if (!data) {
        let res = await get('/accounts')
        data = res.data
    }

    if (data) {
        let badgeText = ''
        let badgeColour = '#ff7a64'
        if (badgeOption === 'total') {
            badgeText = formatBadgeNumber(data.reduce((sum, x) => (sum += Number(x.attributes.balance.value)), 0))
        } else if (badgeOption === 'hide') {
            badgeText = ''
        } else if (badgeOption) {
            let accountToShow = data.find((a) => a.id === badgeOption)
            if (accountToShow) {
                badgeText = formatBadgeNumber(accountToShow.attributes.balance.value)
                if (accountToShow.attributes.ownershipType === 'JOINT') {
                    badgeColour = '#ffef6b'
                }
            }
        }
        setBadgeBackgroundColor({ color: badgeColour })
        setBadgeText({ text: badgeText })
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'UPDATE_BADGE') {
        getAccounts(request.accounts)
    } else if (request.message === 'UPDATE_BADGE_TYPE') {
        getBadgeOption().then((res) => {
            badgeOption = res
            getAccounts(request.accounts)
        })
    }
})

chrome.runtime.onInstalled.addListener(() => {
    getToken().then((token) => {
        if (!token) {
            chrome.tabs.create({ url: '/options.html' }, (tab) => {
                console.log('Opening settings...')
            })
        }
    })
})

// set 30min interval to update badge
chrome.alarms.create({
    delayInMinutes: 30,
    periodInMinutes: 30
})
chrome.alarms.onAlarm.addListener(() => {
    getAccounts()
})

export {}
