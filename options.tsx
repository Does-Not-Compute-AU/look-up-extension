import { useEffect, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import SwitchButton from "~components/SwitchButton";
import useHttpClient from "~hooks/useHttpClient";
import useOptions from "~hooks/useOptions";
import useToken from "~hooks/useToken";
import { formatBadgeNumber } from "~utils/general";
import "./style.css";

const { sendMessage } = chrome.runtime;

function OptionsIndex() {
    const [showToken, setShowToken] = useState("password");
    const [accounts, setAccounts] = useState<any[]>();
    const [accountOptions, setAccountOptions] = useState<any[]>();
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [accountsTotal, setAccountsTotal] = useState<string>("");

    const { token, storedToken, setToken, saveToken, clearToken } = useToken();
    const { ping, getAccounts } = useHttpClient();
    const { badgeOption, setBadgeOption, lastTransactionOption, setLastTransactionOption } = useOptions();

    const testAndSave = async () => {
        const res = await ping(token);
        if (res?.meta.id) {
            saveToken().then(() => {
                    fetchAccounts();
                    sendMessage({
                        "message": "UPDATE_BADGE"
                    });
                }
            );
        }
    };

    async function fetchAccounts() {
        getAccounts().then(({ data }) => setAccounts(data));
    }

    useEffect(() => {

        if (token) {
            fetchAccounts();
        }
    }, [token]);

    useEffect(() => {
        if (badgeOption) {
            setSelectedOption(badgeOption);
        }
    }, [badgeOption]);

    useEffect(() => {
        if (accounts) {
            setAccountOptions(accounts.map(a => {
                return {
                    value: a.id,
                    text: `[${formatBadgeNumber(a.attributes.balance.value)}] ${a.attributes.displayName}`
                };
            }));
            setAccountsTotal(
                `[${formatBadgeNumber(
                    accounts.reduce((sum, x) => {
                        sum += Number(x.attributes.balance.value);
                        return sum;
                    }, 0)
                )}] `
            );
        }
    }, [accounts]);

    function handleBadgeOption(value) {
        setSelectedOption(value);
        setBadgeOption(value);
        sendMessage({
            "message": "UPDATE_BADGE_TYPE",
            "accounts": accounts
        });
    }

    return (
        <div
            className={"flex mx-auto p-8 justify-center text-[#ff7a64]"}
        >
            <div className="flex flex-col justify-center space-y-4">
                <h1 className={"text-xl font-bold"}>
                    Look Up - Settings
                </h1>
                <h2 className={"text-lg font-bold"}>Enter your API token below</h2>
                <div>
                    <input className={"w-96 rounded-md"} type={showToken} onChange={(e) => setToken(e.target.value)} value={token} />
                    <button className={"p-4 hover:text-white"} onClick={() => setShowToken(x => x === "password" ? "text" : "password")}>{showToken === "password" ?
                        <HiEye className={"icon-md"} /> : <HiEyeOff className={"icon-md"} />}</button>
                </div>
                <div className={"flex space-x-4"}>
                    <button className={"bg-[#ffef6e] py-4 px-2 w-48 hover:bg-[#E5D763] rounded-md font-bold text-base"} onClick={testAndSave}>Test & Save</button>
                    <button className={"bg-up-pink py-2 px-1 w-48 hover:bg-[#E57DA2] text-white rounded-md font-bold text-base"} onClick={clearToken}>Clear Token</button>
                </div>
                {storedToken && <div className={"mt-8 mb-2"}>
                  <div className={"text-lg font-bold mt-8"}>Options</div>
                  <div className={"p-4 text-base"}>
                    Show account balance on icon badge:
                    <div>
                      <select className={"rounded-md focus:ring-0"} value={selectedOption} onChange={(e) => handleBadgeOption(e.target.value)}>
                        <option value="total">{`${accountsTotal}Total`}</option>
                        <option value="hide" className={"hover:bg-indigo-600 focus:bg-indigo-600"}>Hide</option>
                          {accountOptions?.map(o => (
                              <option value={o.value}>{o.text}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className={"p-4 text-base"}>
                    Show last transaction in collapsed view:
                    <div>
                      <SwitchButton enabled={lastTransactionOption} setEnabled={setLastTransactionOption} />

                    </div>
                  </div>
                </div>}
            </div>
        </div>
    );
}

export default OptionsIndex;