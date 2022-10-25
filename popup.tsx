import clsx from "clsx";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { HiChevronLeft, HiCog } from "react-icons/hi";
import useHttpClient from "~hooks/useHttpClient";
import useOptions from "~hooks/useOptions";
import useToken from "~hooks/useToken";
import Transactions from "~pages/Transactions";
import AccountSummary from "~pages/index";
import "./style.css";

const { sendMessage } = chrome.runtime;

const loadingAccountPlaceholder = [
    {
        id: "0000000001",
        attributes: {
            displayName: "Loading...",
            balance: {
                value: 0,
                currencyCode: "AUD"
            }
        }

    },
    {
        id: "0000000002",
        attributes: {
            displayName: "Loading...",
            balance: {
                value: 0,
                currencyCode: "AUD"
            }
        }

    }
];

function IndexPopup() {
    const [accounts, setAccounts] = useState<any[]>(loadingAccountPlaceholder);
    const [transactions, setTransactions] = useState<{}>({});
    const [nextLinks, setNextLinks] = useState<{}>({});
    const [selectedAccount, setSelectedAccount] = useState();

    const { token } = useToken();
    const { getAccounts, getTransactions, getNextTransactions } = useHttpClient();
    const { lastTransactionOption } = useOptions();

    useEffect(() => {
        async function fetchAccounts() {
            console.log("fetchAccounts() token", token);
            const { data } = await getAccounts();
            console.log("data", data);
            setAccounts(data);

            sendMessage({
                "message": "UPDATE_BADGE",
                "accounts": data
            });
            if (lastTransactionOption) {
                data.forEach(async (account) => {
                    let { data: txs, links } = await getTransactions(account.id);
                    setTransactions(prev => ({ ...prev, [account.id]: txs }));
                    setNextLinks(prev => ({ ...prev, [account.id]: links.next }));
                });
            }
        }

        if (token) {
            fetchAccounts();
        }

    }, [token]);
    
    const fetchTransactions = async (id) => {
        let { data: txs, links } = await getNextTransactions(nextLinks[id]);
        setTransactions(prev => ({ ...prev, [id]: [...prev[id], ...txs] }));
        setNextLinks(prev => ({ ...prev, [id]: links.next }));
    }

    return (
        <div className={""}>
            <div className="flex flex-row w-full py-2">
                {selectedAccount &&
                  <div className="w-full">
                    <div className={""}>
                      <div onClick={() => setSelectedAccount(undefined)}
                           className={"bg-up-yellow mx-4 rounded-md w-fit px-2 hover:cursor-pointer text-[#B75748] hover:bg-up-pink hover:text-[#242430]"}>
                        <HiChevronLeft className={"icon-lg w-full h-full"} />
                      </div>
                    </div>
                  </div>}
                <div className="flex justify-end w-full">
                    <a href={"/options.html"} target={"_blank"}>
                        <HiCog className={"icon-lg text-up-yellow hover:text-up-pink hover:cursor-pointer mx-3"} />
                    </a>
                </div>
            </div>
            <div
                className={clsx("flex flex-col px-4 pb-8 pt-2 justify-center", selectedAccount ? "space-y-0" : "space-y-4")}
            >
                {!selectedAccount
                    ? <AccountSummary accounts={accounts} transactions={transactions} raiseSelectedAccount={setSelectedAccount} />
                    : <Transactions id={selectedAccount} account={accounts.find(a => a.id === selectedAccount)} transactions={transactions[selectedAccount]} fetchTransactions={fetchTransactions} />
                }
            </div>
            <div className={"flex flex-row justify-center pb-2 text-[#4C4C56] "}>
                <div className={'px-4 py-1 hover:text-up-yellow cursor-pointer'}
                     onClick={() => window.open("https://github.com/Does-Not-Compute-AU/look-up-extension", "_blank")}>
                <FaGithub className={"icon-md"} />

                </div>
            </div>
        </div>
    );
}

export default IndexPopup;
