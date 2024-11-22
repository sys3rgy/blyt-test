'use client'

import { CrownIcon2, HamburgerMenuIcon1, PencilIcon1 } from '@/images/ImagesExport';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import NavBarMenuComponent from './NavBarMenuComponent';
import { poppinsFont } from '@/fonts/Fonts';

const NavBar2Component: React.FC = () => {

    const pathname = usePathname();

    const navBarCSS = `text-gray-600 hover:text-[#9F885E] cursor-pointer transition-all duration-500`;

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

    const handleDocumentClick = (event: MouseEvent) => {
        const navBarMenu = document.getElementById('navBarMenu');
        if (navBarMenu && !navBarMenu.contains(event.target as Node)) {
            setopenHamburgerMenu(true);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    return (
        <>
            <section className="nav-bar-2-section lg:text-base text-sm -mt-[1px] md:py-4 pb-4 bg-black text-white">
                <section className="middle-side capitalize md:hidden flex justify-center items-center font-bold lg:gap-10 gap-6 text py-4 teeny:text-base text-xs">
                    <Link className={`${pathname.includes(`/services`) ? "!text-[#9F885E]" : ""} ${navBarCSS}`} href={'/services'}>services</Link>
                    <Link className={`${pathname.includes('/community') ? "!text-[#9F885E]" : ""} ${navBarCSS}`} href={'/community'}>community</Link>
                    <Link className={`${pathname.includes('/event') ? "!text-[#9F885E]" : ""} ${navBarCSS}`} href={'/event'}>event</Link>
                    <Link className={`${pathname.includes('/about-us') ? "!text-[#9F885E]" : ""} ${navBarCSS}`} href={'/about-us'}>about us</Link>
                    {/* <Link className={`${navBarCSS}`} href={''}>subscriptions</Link> */}
                </section>

                <div className="max-width max-w-screen-xl m-auto flex md:justify-between justify-center px-4 items-center">

                    <section ref={navBarMenuRef} className="left-side md:flex hidden items-center lg:gap-4 gap-1">
                        <div className='relative transition-all duration-500'>
                            <div onClick={() => { setopenHamburgerMenu(!openHamburgerMenu) }}>
                                <HamburgerMenuIcon1 width={20} height={12} customCSS='cursor-pointer' />
                            </div>

                            <div ref={navBarMenuRef} className={`${openHamburgerMenu ? "hidden" : "block"} absolute w-max z-[100]`}>
                                <NavBarMenuComponent closeMenu={() => setopenHamburgerMenu(true)} />
                            </div>
                        </div>
                        <span className={`${poppinsFont.className} uppercase font-bold lg:text-base md:text-xs text-base`}>all categories</span>
                    </section>

                    <section className="middle-side capitalize md:flex hidden items-center font-bold lg:gap-10 gap-4">
                        <Link className={`${poppinsFont.className} ${pathname.includes('/services') ? "!text-[#9F885E]" : ""} ${navBarCSS}`} href={'/services'}>services</Link>
                        <Link className={`${poppinsFont.className} ${pathname.includes('/community') ? "!text-[#9F885E]" : ""} ${navBarCSS}`} href={'/community'}>community</Link>
                        <Link className={`${poppinsFont.className} ${pathname.includes('/event') ? "!text-[#9F885E]" : ""} ${navBarCSS}`} href={'/event'}>event</Link>
                        <Link className={`${poppinsFont.className} ${pathname === '/about-us' ? "!text-[#9F885E]" : ""} ${navBarCSS}`} href={'/about-us'}>about us</Link>
                        {/* <Link className={`${poppinsFont.className} ${navBarCSS}`} href={''}>subscriptions</Link> */}
                    </section>

                    <section className={`${poppinsFont.className} right-side uppercase font-bold flex lg:gap-8 sm:gap-2 gap-8 sm:w-auto w-full justify-center`}>
                        <Link href={'https://docs.google.com/forms/d/e/1FAIpQLSem2rGiIwT1x6PMYVvjlTP6p1ULUWexmbrk3Zb3WGfCEFKOhw/viewform'} className='flex items-center gap-1 lg:text-base md:text-xs text-base' rel="noopener noreferrer" target="_blank"><PencilIcon1 width={20} height={20} customCSS='cursor-pointer' />feedback</Link>
                        <Link href={'/purchase-points'} className='flex items-center gap-1 lg:text-base md:text-xs text-base'><CrownIcon2 width={20} height={20} customCSS={'cursor-pointer'} />purchase points</Link>
                    </section>

                </div>
            </section>
        </>
    );
};

export default NavBar2Component;
