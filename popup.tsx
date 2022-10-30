import clsx from "clsx";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiCog } from "react-icons/hi";
import useHttpClient from "~hooks/useHttpClient";
import useOptions from "~hooks/useOptions";
import useToken from "~hooks/useToken";
import Accounts from "~pages/Accounts";
import Transactions from "~pages/Transactions";
import "./style.css";
import Transaction = UpTransaction.Transaction;

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
    const [transactions, setTransactions] = useState<Map<String, Transaction[]>>(new Map());
    const [nextLinks, setNextLinks] = useState<Map<String, String>>();
    const [selectedAccount, setSelectedAccount] = useState<string>();

    const { token } = useToken();
    const { getAccounts, getTransactions, getNextTransactions } = useHttpClient();
    const { lastTransactionOption } = useOptions();

    useEffect(() => {
        async function fetchAccounts() {
            console.log("fetchAccounts() token", token);
            const { data } = await getAccounts();
            console.log("data", data);
            setAccounts(() => data);

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
    };

    return (
        <div className={""}>
            <div className="flex flex-row w-full py-1">
                {selectedAccount &&
                  <div className="w-full">
                    <div className={""}>
                      <div onClick={() => setSelectedAccount(undefined)}
                           className={"bg-transparent mx-4 rounded-md w-fit px-2 hover:cursor-pointer text-up-yellow hover:bg-up-yellow hover:text-[#242430]"}>
                        <HiChevronLeft className={"icon-lg w-full h-full"} />
                      </div>
                    </div>
                  </div>}
                <div className="flex justify-end w-full">
                    <a href={"/options.html"} target={"_blank"}>
                        <HiCog className={"icon-lg text-[#4C4C56] hover:text-up-yellow hover:cursor-pointer mx-3"} />
                    </a>
                </div>
            </div>
            <div
                className={"flex flex-row justify-center"}
            >
                <div
                    className={clsx("flex flex-col px-4 pb-4 pt-2", selectedAccount ? "space-y-0" : "space-y-4")}
                >
                    {!selectedAccount
                        ? <Accounts accounts={accounts} transactions={transactions} raiseSelectedAccount={setSelectedAccount} />
                        : <Transactions id={selectedAccount} account={accounts.find(a => a.id === selectedAccount)} transactions={transactions[selectedAccount]}
                                        fetchTransactions={fetchTransactions} setSelectedAccount={setSelectedAccount} />
                    }
                </div>
            </div>
        </div>
    );
}

export default IndexPopup;
