'use client'

import { BellIcon1, CompanyLogo1, CrownIcon1, HamburgerMenuIcon1, SearchIcon1, SecurityIcon1, UserIcon1 } from '@/images/ImagesExport';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import NavBarMenuComponent from './NavBarMenuComponent';
import { poppinsFont } from '@/fonts/Fonts';
import { SearchedData } from '@/interfaces/MerchantDashboardInterface';

interface NavBar1ComponentProps {
    onLoginClick: () => void;
    onRegisterClick: () => void;
    sessionExist: boolean;
}

const NavBar1Component: React.FC<NavBar1ComponentProps> = ({ onLoginClick, onRegisterClick, sessionExist }) => {

    const router = useRouter();

    const userNameCookie = getCookie('userName');

    const [checkSession, setcheckSession] = useState(false);
    useEffect(() => {
        setcheckSession(sessionExist)
    }, [sessionExist])


    async function onLogoutClick() {
        await axios.get('/api/commonAPIs/logoutSession')
        window.location.href = "/"
    }

    async function redirectToClientPage() {
        const response = await axios.get(`/api/commonAPIs/localSessionCheck?userName=${userNameCookie}`);

        const isMerchant = response.data.isMerchant
        const statusCode = response.data.statusCode

        if (statusCode === 302) {
            if (isMerchant === true) {
                router.push(`/merchant/dashboard/${userNameCookie}`)
            } else {
                router.push(`/buyer/dashboard/${userNameCookie}`)
            }
        }
    }

    const [openHamburgerMenu, setopenHamburgerMenu] = useState(true)
    const navBarMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navBarMenuRef.current && !navBarMenuRef.current.contains(event.target as Node)) {
                // Clicked outside of NavBarMenuComponent
                setopenHamburgerMenu(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [navBarMenuRef]);

    const [searchedData, setsearchedData] = useState([]);
    const [searchTerm, setsearchTerm] = useState('');

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (searchTerm) {
            // Setting timer to execute the fetching data after 1 second of inactivity
            timer = setTimeout(async () => {
                const response = await axios.post('/api/test/search', { searchTerm });
                const data = response.data.result;

                const getRandomNumber = () => Math.random() - 0.5;
                const shuffledData = data.sort(getRandomNumber);
                setsearchedData(shuffledData);
            }, 1000);
        }

        // Clear timer after every key stroke to reset the 1 second delay
        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <>
            <section className="nav-bar-1-section bg-black">
                <div className="max-width max-w-screen-xl m-auto flex justify-between px-4 py-4 items-center">
                    <div className='md:hidden block relative'>
                        <div onClick={() => { setopenHamburgerMenu(!openHamburgerMenu) }}>
                            <HamburgerMenuIcon1 width={20} height={12} customCSS='cursor-pointer' />
                        </div>

                        <div ref={navBarMenuRef} className={`${openHamburgerMenu ? "hidden" : "block"} absolute w-max z-[100]`}>
                            <NavBarMenuComponent closeMenu={() => setopenHamburgerMenu(true)} />
                        </div>
                    </div>

                    <Link href={'/'} className="left-side flex items-center gap-2">
                        <CompanyLogo1 width={160} height={45} customCSS={'cursor-pointer md:w-[160px] w-[120px] h-auto'} />
                    </Link>

                    <section className="middle-side md:flex hidden items-center relative">
                        <input className={`${poppinsFont.className} font-light placeholder:text-gray-500 text-black bg-white pl-6 py-3 rounded-l-lg border-2 border-[#9F885E]`} type="text" placeholder='Search'
                            value={searchTerm} onChange={(e) => { setsearchTerm(e.target.value) }}
                        />
                        <span className='h-[52px] bg-[#9F885E] px-4 flex items-center rounded-r-lg'>
                            <SearchIcon1 width={20} height={20} customCSS={'cursor-pointer'} />
                        </span>
                        {(searchTerm && searchedData.length !== 0) &&
                            <div className='absolute bg-white w-max h-auto flex flex-col z-50 top-0 left-0 right-0 mt-[48px] rounded-b-lg border-2 border-[#9F885E] gap-1'>
                                {searchedData.map((items: SearchedData, index) => {
                                    return (
                                        <div key={items?._id} className='px-5 flex flex-col'>
                                            <p onClick={() => { router.push(`/merchant/${items.userName}/${items.businessName}`); setsearchTerm(''); setsearchedData([]); }} className='cursor-pointer my-2'>{items?.businessName}</p>
                                            <p onClick={() => { router.push(`/merchant/${items.userName}/${items.businessName}`); setsearchTerm(''); setsearchedData([]); }}
                                                className={`${index === (searchedData.length - 1) ? 'pb-2' : ''} cursor-pointer`}>
                                                {items?.serviceName}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </section>

                    <section className="right-side flex items-center gap-4">
                        {checkSession &&
                            <>
                                <Link href={'/vvip-deals'}>
                                    <p className='md:flex hidden item gap-2 cursor-pointer'><CrownIcon1 width={30} height={20} customCSS={''} /> <span className='uppercase text-[#9F885E] font-bold'>vvip</span></p>
                                </Link>
                                <BellIcon1 width={20} height={20} customCSS={'cursor-pointer'} />
                                <button onClick={redirectToClientPage}> <UserIcon1 width={20} height={20} customCSS={'cursor-pointer'} /> </button>
                            </>
                        }
                        <div className='flex gap-2 items-center'>
                            {checkSession &&
                                <SecurityIcon1 width={30} height={30} customCSS={'cursor-pointer'} />
                            }
                            <div className='flex flex-col capitalize text-sm'>
                                {!checkSession &&
                                    <>
                                        <span className={`${poppinsFont.className} cursor-pointer text-white`} onClick={onLoginClick}>log in</span>
                                        <span className={`${poppinsFont.className} font-semibold text-[#9F885E] cursor-pointer`} onClick={onRegisterClick}>register</span>
                                    </>
                                }
                                {checkSession &&
                                    <>
                                        <span className={`${poppinsFont.className} font-semibold cursor-pointer text-white`} onClick={onLogoutClick}>logout</span>
                                    </>
                                }
                            </div>
                        </div>
                    </section>
                </div>

                <section className="middle-side md:hidden flex items-center px-4">
                    <input className='placeholder:text-gray-500 text-black bg-white pl-6 py-2 rounded-l-lg border-2 border-[#9F885E] w-full' type="text" placeholder='Search' />
                    <span className={`${poppinsFont.className} font-light h-[44px] bg-[#9F885E] px-4 flex items-center rounded-r-lg`}>
                        <SearchIcon1 width={20} height={20} customCSS={'cursor-pointer'} />
                    </span>
                </section>
            </section>
        </>
    );
};

export default NavBar1Component;
