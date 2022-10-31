import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiCog } from "react-icons/hi";
import NavBar from "~components/NavBar";
import useHttpClient from "~hooks/useHttpClient";
import useOptions from "~hooks/useOptions";
import useToken from "~hooks/useToken";
import Accounts from "~pages/Accounts";
import Transactions from "~pages/Transactions";
import { formatBaseUnit } from "~utils/lib";
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
    const [selectedAccountId, setSelectedAccountId] = useState<string>();
    const [balanceTotal, setBalanceTotal] = useState<string>();

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

    useEffect(() => {
        if (accounts) {
            let total: number;
            if (selectedAccountId) {
                total = accounts.find(x => x.id === selectedAccountId)?.attributes.balance.valueInBaseUnits;
            } else {
                total = accounts.reduce((sum, acc) => sum += acc.attributes.balance.valueInBaseUnits, 0);
            }
            const _balanceTotal = isNaN(total) ? "" : formatBaseUnit(total, false);
            setBalanceTotal(_balanceTotal);
        }
    }, [accounts, selectedAccountId]);

    const fetchTransactions = async (id) => {
        let { data: txs, links } = await getNextTransactions(nextLinks[id]);
        setTransactions(prev => ({ ...prev, [id]: [...prev[id], ...txs] }));
        setNextLinks(prev => ({ ...prev, [id]: links.next }));
    };

    return (
        <div className={"w-80 mx-auto"}>
            <NavBar selectedAccountId={selectedAccountId} setSelectedAccountId={setSelectedAccountId} balanceTotal={balanceTotal} />
            {token === undefined ?
                <div className={'flex flex-col justify-items-end items-center h-96 mt-24'}>
                    <div className={'h-full w-full flex flex-col items-center justify-center text-center text-white text-sm'}>
                        <div className={'p-2 w-full'}> No UP API token found!</div>
                        <div className={'p-2 w-full'}> Open settings to create and save one.</div>
                    </div>
                </div>
                :
            <div
                className={"flex flex-row justify-center"}
            >
                <div
                    className={"flex flex-col px-6 pb-4 pt-2 mt-10 w-full max-w-sm"}
                >
                    <Transition
                        show={!selectedAccountId}
                        enter="transition-opacity duration-175"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-350"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        {!selectedAccountId && <Accounts accounts={accounts} transactions={transactions} raiseSelectedAccount={setSelectedAccountId} />}
                    </Transition>
                    <Transition
                        show={!!selectedAccountId}
                        enter="transition-opacity duration-175"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-350"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        {selectedAccountId &&
                          <Transactions id={selectedAccountId} account={accounts.find(a => a.id === selectedAccountId)} transactions={transactions[selectedAccountId]}
                                        fetchTransactions={fetchTransactions} />}
                    </Transition>
                </div>
            </div>
            }
        </div>
    );
}

export default IndexPopup;
