"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import NavBarLayoutAdmin from "./NavBarLayoutAdmin";
import NavBarLayoutUser from "./NavBarLayoutUser";

interface NavBarLayoutProps {
	children: ReactNode;
}

const NavBarLayout: React.FC<NavBarLayoutProps> = ({ children }) => {
	const pathname = usePathname();

	if (pathname.includes("/admin")) {
		return <NavBarLayoutAdmin children={children} />;
	}
	return <NavBarLayoutUser children={children} />;
};

export default NavBarLayout;
