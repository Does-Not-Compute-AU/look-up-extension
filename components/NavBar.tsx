import { HiChevronLeft, HiCog } from 'react-icons/hi'

import useToken from '~hooks/useToken'

const NavBar = ({ selectedAccountId, setSelectedAccountId, balanceTotal }) => {
    const { token } = useToken()

    return (
        <nav className="flex flex-row justify-center py-2 fixed top-0 left-0 w-full">
            <div className={'inline-flex w-full max-w-xl'}>
                {selectedAccountId && (
                    <div className="w-full">
                        <div className={''}>
                            <div
                                onClick={() => setSelectedAccountId(undefined)}
                                className={'bg-transparent mx-4 rounded-md w-fit px-2 hover:cursor-pointer text-up-yellow hover:bg-up-yellow hover:text-[#242430]'}>
                                <HiChevronLeft className={'icon-lg w-full h-full'} />
                            </div>
                        </div>
                    </div>
                )}
                {!selectedAccountId && (
                    <div className="w-full">
                        <div className={''}>
                            <div className={'py-2 px-4'}></div>
                        </div>
                    </div>
                )}
                <div className="flex justify-center w-full text-up-orange font-bold text-base">
                    <div className={'px-2'}>{balanceTotal}</div>
                </div>
                <div className="flex justify-end w-full">
                    <div className={'px-2 relative'}>
                        <a href={'/options.html'} target={'_blank'}>
                            <HiCog className={'icon-lg text-[#4C4C56] hover:text-up-yellow hover:cursor-pointer mx-3'} />
                        </a>
                        {token === undefined && (
                            <div className={'absolute right-3 top-8'}>
                                <svg width="160" height="200" viewBox="0 0 188 252" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M2 250C6.62166 249.486 11.74 245.162 16.1111 243.444C26.2783 239.45 36.4702 233.96 45.4444 227.778C57.8988 219.198 70.1154 211.148 80.2222 199.778C88.6916 190.25 93.6598 177.318 99.4444 166C109.507 146.312 118.3 122.324 105.778 101.556C102.649 96.3668 100.63 92.5842 94.8333 90.5555C89.0406 88.5281 80.9366 90 74.8889 90C55.6756 90 38.4495 114.72 58.4444 127.444C64.9029 131.554 74.1605 132.072 81.4444 134.5C90.6574 137.571 105.922 135.289 114.222 130.778C126.994 123.837 140.999 118.74 149 105.333C153.856 97.1964 158.023 89.2718 161.5 80.4444C164.644 72.4634 165.392 64.1314 168 56C173.207 39.7656 172 22.3448 172 5.49999C172 -3.39637 164.932 10.2337 162.444 10.9444C161.338 11.2606 159.047 14.6985 160 14.2222C162.083 13.1805 163.709 11.4325 165.5 9.99999C169.173 7.06122 170.991 2.76228 176 7.05555C178.679 9.35209 182.828 12.4141 186 14"
                                        stroke="white"
                                        stroke-width="3"
                                        stroke-linecap="round"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar