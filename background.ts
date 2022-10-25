const { setBadgeText, setBadgeBackgroundColor, setIcon, setTitle, getTitle } = chrome.action;
import { Storage } from "@plasmohq/storage";
import { formatBadgeNumber } from "~utils/general";
import { getBadgeOption, getToken } from "~utils/options";

const storage = new Storage({
    area: "sync"
});
const TOKEN_KEY = "up-api-token";
const URL = "https://api.up.com.au/api/v1";

let token = "";
let badgeOption = "";
getToken().then(res => {
    token = res;
    getAccounts();
});
getBadgeOption().then(res => badgeOption = res);

async function getAccounts(data?: any) {
    if (!token) {
        token = await getToken();
    }
    const get = async (endpoint, _token = token) => {
        const res = await fetch(URL + endpoint, { headers: { Authorization: "Bearer " + _token } });
        return res.json();
    };
    if (!data) {
        let res = await get("/accounts");
        data = res.data;
    }

    if (data) {
        console.log("badgeOption", badgeOption);
        let badgeText = "";
        if (badgeOption === "total") {
            badgeText = formatBadgeNumber(
                data.reduce((sum, x) => {
                    sum += Number(x.attributes.balance.value);
                    return sum;
                }, 0)
            );
            console.log("badgeText", badgeText);
        } else if (badgeOption === "hide") {
            badgeText = "";
        } else if (badgeOption) {
            let accountToShow = data.find(a => a.id === badgeOption);
            if (accountToShow) {
                badgeText = formatBadgeNumber(accountToShow.attributes.balance.value);
            }
        }
        setBadgeText({ "text": badgeText });
    }
}

// setBadgeText({"text": formatBadgeNumber('992834.45')})
setBadgeBackgroundColor({ color: "#ff7a64" });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "UPDATE_BADGE") {
        console.log("badgeOption", badgeOption);
        getAccounts(request.accounts);
    } else if (request.message === "UPDATE_BADGE_TYPE") {
        getBadgeOption().then(res => {
            badgeOption = res;
            getAccounts(request.accounts);
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    storage.get(TOKEN_KEY).then(token => {
        if (!token) {
            chrome.tabs.create({ url: "/options.html" }, tab => {
                console.log("Opening settings...");
            });
        }
    });
});

chrome.alarms.create({
    delayInMinutes: 30,
    periodInMinutes: 30
});
chrome.alarms.onAlarm.addListener(() => {
    getAccounts();
});

export {};