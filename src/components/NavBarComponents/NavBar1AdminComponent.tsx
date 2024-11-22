"use client";

import { CompanyLogo1, HamburgerMenuIcon1, SecurityIcon1, UserIcon1 } from "@/images/ImagesExport";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/navigation";
import NavBarMenuComponent from "./NavBarMenuComponent";
import { poppinsFont } from "@/fonts/Fonts";

interface NavBar1AdminComponentProps {
	sessionExist: boolean;
}

const NavBar1AdminComponent: React.FC<NavBar1AdminComponentProps> = ({ sessionExist }) => {
	const router = useRouter();
	const userNameCookie = getCookie("userName");
	const [checkSession, setcheckSession] = useState(false);

	useEffect(() => {
		setcheckSession(sessionExist);
	}, [sessionExist]);

	async function onLogoutClick() {
		await axios.get("/api/commonAPIs/logoutSession");
		window.location.href = "/";
	}

	async function redirectToClientPage() {
		alert("admin profile");
		// const response = await axios.get(`/api/commonAPIs/localSessionCheck?userName=${userNameCookie}`);
		// const isMerchant = response.data.isMerchant;
		// const statusCode = response.data.statusCode;
		// if (statusCode === 302) {
		// 	if (isMerchant === true) {
		// 		router.push(`/merchant/dashboard/${userNameCookie}`);
		// 	} else {
		// 		router.push(`/buyer/dashboard/${userNameCookie}`);
		// 	}
		// }
	}

	const [openHamburgerMenu, setopenHamburgerMenu] = useState(true);
	const navBarMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (navBarMenuRef.current && !navBarMenuRef.current.contains(event.target as Node)) {
				setopenHamburgerMenu(true);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [navBarMenuRef]);

	return (
		<>
			<section className="nav-bar-1-section bg-black">
				<div className="max-width max-w-screen-xl m-auto flex justify-between px-4 py-4 items-center">
					<div className="md:hidden block relative">
						<div
							onClick={() => {
								setopenHamburgerMenu(!openHamburgerMenu);
							}}
						>
							<HamburgerMenuIcon1 width={20} height={12} customCSS="cursor-pointer" />
						</div>

						<div
							ref={navBarMenuRef}
							className={`${openHamburgerMenu ? "hidden" : "block"} absolute w-max z-[100]`}
						>
							<NavBarMenuComponent closeMenu={() => setopenHamburgerMenu(true)} />
						</div>
					</div>

					<Link href={"/admin"} className="left-side flex items-center gap-2">
						<CompanyLogo1
							width={160}
							height={45}
							customCSS={"cursor-pointer md:w-[160px] w-[120px] h-auto"}
						/>
					</Link>

					<section className="right-side flex items-center gap-4">
						{checkSession && (
							<>
								<button onClick={redirectToClientPage}>
									<UserIcon1 width={20} height={20} customCSS={"cursor-pointer"} />
								</button>
							</>
						)}
						<div className="flex gap-2 items-center">
							{checkSession && <SecurityIcon1 width={30} height={30} customCSS={"cursor-pointer"} />}
							<div className="flex flex-col capitalize text-sm">
								{checkSession && (
									<>
										<span
											className={`${poppinsFont.className} font-semibold cursor-pointer text-white`}
											onClick={onLogoutClick}
										>
											logout
										</span>
									</>
								)}
							</div>
						</div>
					</section>
				</div>
			</section>
		</>
	);
};

export default NavBar1AdminComponent;
