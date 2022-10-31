import { Listbox, Transition } from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'
import { HiCheck, HiChevronDown } from 'react-icons/hi'

const BadgeDisplayOption = ({ selected, setSelected, accountOptions }) => {
    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <>
                    <Listbox.Label className="block text-sm font-medium text-up-orange">Show account balance on icon badge</Listbox.Label>
                    <div className="relative mt-1">
                        <Listbox.Button
                            className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                            {selected && (
                                <span className="block truncate text-black">
                                    {selected.badgeText && (
                                        <span className={clsx('font-semibold hover:text-grey-900 px-2 py-1 rounded-lg', selected.badgeColour ?? '')}>{selected.badgeText}</span>
                                    )}
                                    <span className={'ml-2'}>{selected.text}</span>
                                </span>
                            )}
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <HiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>
                        <Transition show={open} as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options
                                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {accountOptions?.map((account) => (
                                    <Listbox.Option
                                        key={account.value}
                                        className={({ active }) => clsx(active ? 'bg-gray-800 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4 ')}
                                        value={account}>
                                        {({ selected, active }) => (
                                            <>
                                                <span className={clsx(selected ? 'font-semibold' : 'font-normal', 'block truncate hover:text-grey-900')}>
                                                    {account.badgeText && (
                                                        <span className={clsx('!text-grey-900 font-semibold hover:text-grey-900 px-2 py-1 rounded-lg', account.badgeColour ?? '')}>
                                                            {account.badgeText}
                                                        </span>
                                                    )}
                                                    <span className={'ml-2'}>{account.text}</span>
                                                </span>
                                                {selected ? (
                                                    <span className={clsx(active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 left-0 flex items-center pl-1.5')}>
                                                        <HiCheck className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}

export default BadgeDisplayOption