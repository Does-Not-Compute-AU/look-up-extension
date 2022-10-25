import clsx from "clsx";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { parseBaseUnit } from "~utils/general";

const Transactions = ({ id, account: { attributes: { displayName, balance } }, transactions, fetchTransactions }) => {
    const [parsedTransactions, setParsedTransactions] = useState([]);

    useEffect(() => {
        const parsed = [];
        let date;
        transactions?.forEach(tx => {
            let _date = new Date(tx.attributes.createdAt).toUTCString().split(" ").slice(0, 3).join(" ").replace(",", "");
            if (!date || date !== _date) {
                date = _date;
                parsed.push({ date });
            }
            parsed.push(tx);

        });
        setParsedTransactions(parsed);

    }, [transactions]);

    return (
        <>
            <div className={"flex flex-row p-2 text-base text-[#ffef6e]"}>
                <div className={"w-32 font-semibold text-white"}>{displayName}</div>
                <div className={"w-24 flex justify-end font-semibold text-[#ff7a64]"}>{`
                            ${"$" + balance.value}
                            ${" " ?? balance.currencyCode}
                            `}</div>
            </div>
            <InfiniteScroll
                pageStart={1}
                initialLoad={false}
                loadMore={() => fetchTransactions(id)}
                hasMore={true}
                loader={
                    <div className={"bg-white flex flex-row p-2 h-8 animate-pulse justify-center mt-2 text-sm font-bold"}>Loading...</div>}
            >
                {parsedTransactions?.map(tx => (
                    tx.date ?
                        (
                            <div className={"bg-gray-300 flex flex-row p-2 text-xxs text-gray-600 !mt-2"}>
                                <div className={"w-32 font-semibold"}>{tx.date}</div>
                            </div>)
                        : (
                            <div className={"bg-white flex flex-row p-2"}>
                                <div className={"w-32 font-semibold"}>{tx?.attributes?.description}</div>
                                <div className={clsx("w-24 flex justify-end font-semibold")}>
                                    <span
                                        className={tx?.attributes?.amount?.valueInBaseUnits > 0 ? "text-green-500" : ""}>{parseBaseUnit(tx?.attributes?.amount?.valueInBaseUnits)}</span>
                                    {/*<span className={"ml-1 "}>{tx?.attributes?.amount?.currencyCode}</span>*/}
                                </div>
                            </div>)

                ))}
            </InfiniteScroll>
        </>
    );
};

export default Transactions;