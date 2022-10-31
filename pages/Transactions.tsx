import clsx from "clsx";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { dateToTime, formatBaseUnit, formatUpsiderUsername } from "~utils/lib";

const Transactions = ({ id, account: { attributes: { displayName } }, transactions, fetchTransactions }) => {
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
            <div className={"flex flex-row p-2 justify-center text-base text-[#ffef6e]"}>
                <div className={" font-semibold text-white"}>{displayName}</div>
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
                            <div className={"bg-white flex flex-row p-2 hover:bg-gray-100"} onClick={() => console.log({ tx })}
                                 title={tx?.attributes?.foreignAmount ? `${formatBaseUnit(tx.attributes.foreignAmount.valueInBaseUnits, undefined, tx.attributes.foreignAmount.currencyCode)} ${tx.attributes.foreignAmount.currencyCode}` : ""}>
                                <div className={"w-32 font-semibold"}>

                                    <div className={"w-32 font-semibold"}>{formatUpsiderUsername(tx?.attributes?.description)}</div>
                                    <div
                                        className={"w-32 font-semibold text-xxs text-gray-600"}>{`${dateToTime(tx.attributes.createdAt)}${tx?.attributes?.message ? ", " + tx.attributes.message : ""}`}</div>
                                </div>
                                <div className={clsx("w-24 flex justify-end font-semibold")}>
                                    <span
                                        className={clsx(tx?.attributes?.amount?.valueInBaseUnits > 0 ? "text-green-500" : "",
                                            tx.attributes.foreignAmount?.currencyCode ? "underline" : "")}>{formatBaseUnit(tx?.attributes?.amount?.valueInBaseUnits) + `${tx.attributes.foreignAmount?.currencyCode ? "*" : ""}`}</span>
                                    {/*<span className={"ml-1 "}>{tx?.attributes?.amount?.currencyCode}</span>*/}
                                </div>
                            </div>)

                ))}
            </InfiniteScroll>
        </>
    );
};

export default Transactions;