import clsx from "clsx";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import useOptions from "~hooks/useOptions";
import { formatBaseUnit, formatUpsiderUsername } from "~utils/lib";
import Account = UpAccount.Account;
import Transaction = UpTransaction.Transaction;


interface Props {
    accounts: Account[];
    transactions: Map<String, Transaction[]>;
    raiseSelectedAccount: Dispatch<SetStateAction<string>>;
}

const Accounts = ({ accounts, transactions, raiseSelectedAccount }: Props) => {
    const [balanceTotal, setBalanceTotal] = useState<string>();
    const { lastTransactionOption } = useOptions();

    useEffect(() => {
        console.log("accounts", accounts)
        if (accounts) {
            const total = accounts.reduce((sum, acc) => sum += acc.attributes.balance.valueInBaseUnits, 0);
            const _balanceTotal = isNaN(total) ? "" : formatBaseUnit(total, false);
            setBalanceTotal(_balanceTotal);
        }
    }, [accounts]);

    return (
        <>
            {accounts ?
                <>
                    <div className={"text-up-orange font-bold text-center text-base"}>{balanceTotal}</div>
                    {accounts.map(({ id, attributes: { displayName, balance } }) =>
                        <div key={id}
                             className={"flex flex-col justify-end bg-white w-max hover:bg-zinc-900 hover:cursor-pointer group"}
                             onClick={() => raiseSelectedAccount(id)}
                        >
                            <div className={"flex flex-row p-2 text-base group-hover:text-[#ffef6e]"}>
                                <div className={"w-32 font-semibold"}>{displayName}</div>
                                <div className={"w-24 flex justify-end font-semibold"}>
                                    {`${"$" + balance.value} ${" " ?? balance.currencyCode}`}
                                </div>
                            </div>
                            {lastTransactionOption &&
                                (transactions?.[id] ?
                                        <div className={"flex flex-row bg-gray-200 p-2 group-hover:bg-zinc-700 group-hover:text-white"}>
                                            {transactions[id] ?
                                                <>
                                                    <div className={"w-32 block font-semibold"}>
                                                        {formatUpsiderUsername(transactions[id][0]?.attributes?.description)}
                                                    </div>
                                                    <div className={clsx("w-24 flex justify-end font-semibold")}>
                                                    <span
                                                        className={transactions[id][0]?.attributes?.amount?.valueInBaseUnits > 0 ? "text-green-600" : ""}
                                                    >
                                                        {formatBaseUnit(transactions[id][0]?.attributes?.amount?.valueInBaseUnits)}
                                                    </span>
                                                    </div>
                                                </>
                                                :
                                                <> Loading... </>
                                            }

                                        </div>
                                        : <div className={"flex flex-row bg-gray-200 p-2 justify-between"}>
                                            <div className={'w-32 h-4 bg-gray-400 rounded-md animate-pulse'}></div>
                                            <div className={'w-16 h-4 bg-gray-400 rounded-md animate-pulse'}></div>
                                        </div>
                                )
                            }
                        </div>
                    )}
                </>
                :
                <div className={"w-48 h-48 text-up-orange"}>Loading...</div>
            }
        </>
    );
};

export default Accounts;