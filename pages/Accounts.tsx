import clsx from 'clsx'
import type { Dispatch, SetStateAction } from 'react'

import useOptions from '~hooks/useOptions'
import { formatBaseUnit, formatUpsiderUsername } from '~utils/lib'

import Account = UpAccount.Account
import Transaction = UpTransaction.Transaction

interface Props {
    accounts: Account[]
    transactions: Map<String, Transaction[]>
    raiseSelectedAccount: Dispatch<SetStateAction<string>>
}

const Accounts = ({ accounts, transactions, raiseSelectedAccount }: Props) => {
    const { lastTransactionOption } = useOptions()

    return accounts ? (
        <div className={'space-y-4 w-full my-4'}>
            {/* Accounts */}
            {accounts.map(({ id, attributes: { displayName, balance } }) => (
                <div key={id} className={'flex flex-col justify-center bg-white w-full hover:bg-zinc-900 hover:cursor-pointer group'} onClick={() => raiseSelectedAccount(id)}>
                    <div className={'flex flex-row p-2 text-base group-hover:text-up-yellow'}>
                        <div className={'w-full font-semibold'}>{displayName}</div>
                        <div className={'w-full flex justify-end font-semibold'}>{formatBaseUnit(Number(balance.value) * 100, false, balance.currencyCode)}</div>
                    </div>

                    {/* Last Transaction */}
                    {lastTransactionOption &&
                        (transactions?.[id] ? (
                            <div className={'flex flex-row bg-gray-200 p-2 group-hover:bg-zinc-700 group-hover:text-white'}>
                                {transactions[id] ? (
                                    <>
                                        <div className={'min-w-max w-full block font-semibold mr-4'}>{formatUpsiderUsername(transactions[id][0]?.attributes?.description)}</div>
                                        <div className={clsx('w-16 flex justify-end font-semibold')}>
                                            <span className={transactions[id][0]?.attributes?.amount?.valueInBaseUnits > 0 ? 'text-green-600' : ''}>
                                                {formatBaseUnit(transactions[id][0]?.attributes?.amount?.valueInBaseUnits)}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <> Loading... </>
                                )}
                            </div>
                        ) : (
                            <div className={'flex flex-row bg-gray-200 p-2 justify-between'}>
                                <div className={'w-32 h-4 bg-gray-400 rounded-md animate-pulse'}></div>
                                <div className={'w-16 h-4 bg-gray-400 rounded-md animate-pulse'}></div>
                            </div>
                        ))}
                </div>
            ))}
        </div>
    ) : (
        <div className={'w-48 h-48 text-up-orange'}>Loading...</div>
    )
}

export default Accounts
