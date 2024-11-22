"use client";

import { CrownIcon2, HamburgerMenuIcon1, PencilIcon1 } from "@/images/ImagesExport";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import NavBarMenuComponent from "./NavBarMenuComponent";
import { poppinsFont } from "@/fonts/Fonts";

const NavBar2AdminComponent: React.FC = () => {
	const pathname = usePathname();

	const navBarCSS = `text-gray-600 hover:text-[#9F885E] cursor-pointer transition-all duration-500`;

	const [openHamburgerMenu, setopenHamburgerMenu] = useState(true);
	const navBarMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (navBarMenuRef.current && !navBarMenuRef.current.contains(event.target as Node)) {
				// Clicked outside of NavBarMenuComponent
				setopenHamburgerMenu(true);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [navBarMenuRef]);

	const handleDocumentClick = (event: MouseEvent) => {
		const navBarMenu = document.getElementById("navBarMenu");
		if (navBarMenu && !navBarMenu.contains(event.target as Node)) {
			setopenHamburgerMenu(true);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleDocumentClick);

		return () => {
			document.removeEventListener("click", handleDocumentClick);
		};
	}, []);

	return (
		<>
			<section className="nav-bar-2-section lg:text-base text-sm -mt-[1px] md:py-4 pb-4 bg-black text-white">
				<div className="max-width max-w-screen-xl m-auto flex md:justify-between justify-center px-4 items-center">
					<section className="middle-side capitalize md:flex hidden items-center font-bold lg:gap-10 gap-4">
						<Link
							className={`${poppinsFont.className} ${
								pathname.includes("/admin") ? "!text-[#9F885E]" : ""
							} ${navBarCSS}`}
							href={"/admin"}
						>
							Dashboard
						</Link>
						<Link
							className={`${poppinsFont.className} ${
								pathname.includes("/admin/community") ? "!text-[#9F885E]" : ""
							} ${navBarCSS}`}
							href={"/services"}
						>
							Community Management
						</Link>
						<Link
							className={`${poppinsFont.className} ${
								pathname.includes("/admin/event") ? "!text-[#9F885E]" : ""
							} ${navBarCSS}`}
							href={"/admin/event"}
						>
							Event Management
						</Link>
						<Link
							className={`${poppinsFont.className} ${
								pathname === "/admin/fund-raising" ? "!text-[#9F885E]" : ""
							} ${navBarCSS}`}
							href={"/admin/fund-raising"}
						>
							Fund Raising Management
						</Link>
						<Link
							className={`${poppinsFont.className} ${
								pathname === "/admin/agen" ? "!text-[#9F885E]" : ""
							} ${navBarCSS}`}
							href={"/admin/agen"}
						>
							Agent Management
						</Link>
					</section>
				</div>
			</section>
		</>
	);
};

export default NavBar2AdminComponent;
