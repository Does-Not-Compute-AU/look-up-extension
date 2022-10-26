import clsx from "clsx";
import { useEffect, useState } from "react";
import { HiChevronDown, HiExternalLink, HiEye, HiEyeOff } from "react-icons/hi";
import SwitchButton from "~components/SwitchButton";
import useHttpClient from "~hooks/useHttpClient";
import useOptions from "~hooks/useOptions";
import useToken from "~hooks/useToken";
import { formatBadgeNumber, UP_API_TOKEN_URL } from "~utils/general";
import "./style.css";

const { sendMessage } = chrome.runtime;

function OptionsIndex() {
    const [userHasToken, setUserHasToken] = useState<boolean>(true);
    const [expanded, setExpanded] = useState<boolean>(false);
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
                    setExpanded(false);
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
        if (storedToken) {
            setUserHasToken(true);
            setExpanded(false)
        } else {
            if (storedToken === undefined) {
                setUserHasToken(false);
                setExpanded(true)
            }
        }
    }, [storedToken]);

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
            className={"flex flex-row justify-center text-[#ff7a64]"}
        >
            <div
                className={"flex flex-col"}
            >
                <div className="flex flex-col justify-center p-4 mt-4 space-y-4">
                    <h1 className={"text-xl font-bold"}>
                        Look Up - Settings
                    </h1>
                    {userHasToken ? <div className={clsx("transition-all", expanded ? "max-h-[200vh]" : "max-h-4")}>
                            {expanded ? <div className={"space-y-4"}><h2 className={"text-lg font-bold"}>Enter your API token below</h2>
                                <div>
                                    <input autoFocus className={"w-96 rounded-md"} type={showToken} onChange={(e) => setToken(e.target.value)} value={token} />
                                    <button className={"p-4 hover:text-white"} onClick={() => setShowToken(x => x === "password" ? "text" : "password")}>{showToken === "password" ?
                                        <HiEye className={"icon-md"} /> : <HiEyeOff className={"icon-md"} />}
                                    </button>
                                </div>
                                <a className={"text-up-yellow text-sm hover:text-up-pink cursor-pointer inline-flex"} target={"_blank"} href={UP_API_TOKEN_URL}>
                                    Don't have an API token? Click here to create one
                                    <HiExternalLink className={"icon-md ml-2"} />
                                </a>
                                <div className={"flex space-x-4"}>
                                    <button className={"py-2 px-1 w-48 hover:bg-[#E57DA2] text-white rounded-md font-bold text-base"} onClick={clearToken}>Clear Token</button>
                                    <button className={"bg-up-orange text-black py-4 px-2 w-48 hover:bg-[#E5D763] rounded-md font-bold text-base"} onClick={testAndSave}>Test & Save
                                    </button>
                                </div>
                            </div> : <div className={"text-lg font-bold inline-flex text-up-pink hover:text-up-yellow items-center cursor-pointer"} onClick={() => setExpanded(true)}>Show Token<HiChevronDown className={'ml-2'}/></div>}
                        </div> :
                        <>

                            <h2 className={"text-lg font-bold text-up-yellow"}>Have you created an UP API token?</h2>
                            <div className={"flex space-x-4"}>
                                <button className={"bg-up-orange py-2 px-1 w-48 hover:bg-[#E57DA2] text-black rounded-md font-bold text-base"}
                                        onClick={() => setUserHasToken(true)}>Yes
                                </button>
                                <a type={"button"} className={"bg-up-orange text-black py-4 px-2 w-48 hover:bg-[#E5D763] rounded-md font-bold text-base text-center"}
                                   target={"_blank"} href={UP_API_TOKEN_URL}>
                                    No<br /><span className={"text-xs"}>(Click here to create one)</span>
                                    {/*<HiExternalLink className={"icon-md ml-2"} />*/}
                                </a>
                            </div>
                        </>
                    }
                </div>
                <div className={"flex flex-col justify-center"}>
                    {storedToken && <div className={"mt-8 mb-2 border-2 border-red-500 rounded-md p-4"}>
                      <div className={"text-lg font-bold "}>Options</div>
                      <div className={"p-4 text-base"}>
                        Show account balance on icon badge:
                        <div>
                          <select className={"rounded-md focus:ring-0 text-[#242430]"} value={selectedOption} onChange={(e) => handleBadgeOption(e.target.value)}>
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
        </div>
    );
}

export default OptionsIndex;