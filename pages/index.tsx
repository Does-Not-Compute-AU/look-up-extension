import clsx from "clsx";
import useOptions from "~hooks/useOptions";
import { parseBaseUnit } from "~utils/general";

const AccountSummary = ({ accounts, transactions, raiseSelectedAccount }) => {
    const { lastTransactionOption } = useOptions();

    const formatUpsiderUsername = (input: string) => {
        if (!input) {
            return input;
        }
        let formattedParts = [];
        const parts = input.split(" ");
        if (parts.some(part => part.startsWith("$"))) {
            parts.forEach(part => {
                if (part.startsWith("$")) {
                    formattedParts.push(<span className={"text-[#ff7a64] mr-0.5"}>{"$"}</span>);
                    formattedParts.push(part.replace("$", ""));
                } else {
                    formattedParts.push(part + " ");
                }
            });

        } else {
            return input;
        }

        return <div>{formattedParts.map(p => p)}</div>;
    };
    console.log("AS transactions", transactions)

    return (
        <>
            {accounts ?
                accounts.map(({ id, attributes: { displayName, balance } }) =>
                    <div key={id}
                         className={"flex flex-col justify-end bg-white w-max hover:bg-gray-800 hover:cursor-pointer transition-all group"}
                        onClick={() => raiseSelectedAccount(id)}
                    >
                        <div className={"flex flex-row p-2 text-base group-hover:text-[#ffef6e]"}>
                            <div className={"w-32 font-semibold"}>{displayName}</div>
                            <div className={"w-24 flex justify-end font-semibold"}>{`
                            ${"$" + balance.value}
                            ${" " ?? balance.currencyCode}
                            `}</div>
                        </div>
                        {transactions?.[id] && lastTransactionOption &&
                          <div className={clsx("flex flex-row bg-gray-200 p-2 group-hover:text-black ", transactions[id][0] ? "" : "animate-pulse")}>
                              {transactions[id] ?
                                  <>
                                      <div className={"w-32 block font-semibold"}>{formatUpsiderUsername(transactions[id][0]?.attributes?.description)}</div>
                                      <div className={clsx("w-24 flex justify-end font-semibold")}>
                                                <span
                                                    className={transactions[id][0]?.attributes?.amount?.valueInBaseUnits > 0 ? "text-green-600" : ""}>{parseBaseUnit(transactions[id][0]?.attributes?.amount?.valueInBaseUnits)}</span>
                                          {/*<span className={"ml-1 "}>{transactions[id][0]?.attributes?.amount?.currencyCode}</span>*/}
                                      </div>
                                  </>
                                  :
                                  <> Loading... </>
                              }

                          </div>
                        }
                    </div>
                )
                :
                <div className={"w-48 h-48"}>Loading...</div>
            }
        </>
    );
};

export default AccountSummary;