"use client";

import React, { ReactNode, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DataContext } from "@/context/DataContext";
import ToastContainerUtil from "@/utils/ToastContainerUtil";
import { poppinsFont } from "@/fonts/Fonts";
import NavBar1AdminComponent from "@/components/NavBarComponents/NavBar1AdminComponent";
import NavBar2AdminComponent from "@/components/NavBarComponents/NavBar2AdminComponent";
import { FooterAdminComponent } from "@/components/FooterComponents/FooterAdminComponent";

interface NavBarLayoutAdminProps {
	children: ReactNode;
}

const NavBarLayoutAdmin: React.FC<NavBarLayoutAdminProps> = ({ children }) => {
	const { isSessionExist } = useContext(DataContext);
	const pathname = usePathname();
	const [hideBothNavBarsAndFooter, sethideBothNavBarsAndFooter] = useState(false);

	useEffect(() => {
		const checkPathName = () => {
			if (pathname === "/admin/login") {
				sethideBothNavBarsAndFooter(false);
			} else if (pathname.includes("/admin")) {
				sethideBothNavBarsAndFooter(true);
			}
		};
		checkPathName();
	}, [pathname, hideBothNavBarsAndFooter]);

	return (
		<>
			<section className={`${poppinsFont.className} nav-bar-layout min-h-screen flex flex-col`}>
				{hideBothNavBarsAndFooter && <NavBar1AdminComponent sessionExist={isSessionExist} />}

				{hideBothNavBarsAndFooter && <NavBar2AdminComponent />}
				{children}

				{hideBothNavBarsAndFooter && <FooterAdminComponent />}

				<ToastContainerUtil />
			</section>
		</>
	);
};

export default NavBarLayoutAdmin;
