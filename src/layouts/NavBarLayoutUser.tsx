"use client";

import React, { ReactNode, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { DataContext } from "@/context/DataContext";
import ToastContainerUtil from "@/utils/ToastContainerUtil";
import { FooterComponent } from "@/components/FooterComponents/FooterComponent";
import NavBar1Component from "@/components/NavBarComponents/NavBar1Component";
import NavBar2Component from "@/components/NavBarComponents/NavBar2Component";
import { poppinsFont } from "@/fonts/Fonts";
import { CompanyLogo1, CrossIcon1, SignInAndSignUpIcon1, SignInAndSignUpIcon2 } from "@/images/ImagesExport";
import IntroImage1 from "@/images/IntroImages/IntroImage1";

interface NavBarLayoutUserProps {
	children: ReactNode;
}

const NavBarLayoutUser: React.FC<NavBarLayoutUserProps> = ({ children }) => {
	const { isSessionExist } = useContext(DataContext);

	const pathname = usePathname();

	const [showSignInScene, setShowSignInScene] = useState(false);
	const [showRegisterScene, setshowRegisterScene] = useState(false);
	const [hideBothNavBarsAndFooter, sethideBothNavBarsAndFooter] = useState(false);

	useEffect(() => {
		const checkPathName = () => {
			if (
				pathname === "/" ||
				pathname.includes("/merchant/dashboard") ||
				pathname === "/about-us" ||
				pathname.includes("/services") ||
				pathname.includes("/community") ||
				pathname.includes("/event") ||
				/^\/merchant\/[^/]+\/[^/]+$/.test(pathname) ||
				pathname.includes("/buyer/dashboard/") ||
				pathname === "/purchase-points" ||
				pathname === `/purchases` ||
				pathname.includes("/vvip") ||
				pathname.includes("/admin")
			) {
				sethideBothNavBarsAndFooter(true);
			} else {
				sethideBothNavBarsAndFooter(false);
			}
		};
		checkPathName();
	}, [pathname, showSignInScene, hideBothNavBarsAndFooter]);

	function resetSceneState() {
		setShowSignInScene(false);
		setshowRegisterScene(false);
	}

	return (
		<>
			<section
				className={`${poppinsFont.className} nav-bar-layout ${
					showSignInScene || showRegisterScene ? "blur-sm pointer-events-none" : ""
				}`}
			>
				{hideBothNavBarsAndFooter && (
					<NavBar1Component
						onLoginClick={() => setShowSignInScene(!showSignInScene)}
						onRegisterClick={() => setshowRegisterScene(!showRegisterScene)}
						sessionExist={isSessionExist}
					/>
				)}

				{hideBothNavBarsAndFooter && <NavBar2Component />}

				<div>{children}</div>

				{hideBothNavBarsAndFooter && <FooterComponent />}

				<ToastContainerUtil />
			</section>

			{(showSignInScene || showRegisterScene) && (
				<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 lg:min-w-[1000px] teeny:w-[450px] w-[350px] justify-evenly bg-[#F5F5FA] py-10 z-50 drop-shadow-lg rounded-lg">
					<div className="absolute top-2 right-2" onClick={resetSceneState}>
						<CrossIcon1 width={20} height={20} customCSS={""} />
					</div>

					<div className="left-side lg:flex hidden flex-col items-center">
						<p>
							<CompanyLogo1 width={256} height={72} customCSS={""} />
						</p>
						<p className="my-16">
							<IntroImage1 width={476} height={216} customCSS={""} />
						</p>
						<p className="font-bold text-3xl">Business Loyalty For All</p>
					</div>

					<div className="right-side flex flex-col justify-evenly lg:gap-0 gap-4">
						{showSignInScene && (
							<Link
								onClick={resetSceneState}
								href={"/merchant/merchantSignIn"}
								className="login-as-merchant flex items-center sm:gap-10 gap-4 whitespace-nowrap bg-white px-9 py-6 border border-black rounded-lg drop-shadow-lg"
							>
								<SignInAndSignUpIcon1 width={71} height={71} customCSS={""} />
								<span className="font-bold sm:text-xl text-sm">Login As Merchant</span>
							</Link>
						)}

						{!showSignInScene && (
							<Link
								onClick={resetSceneState}
								href={"/merchant/merchantSignUp"}
								className="login-as-merchant flex items-center sm:gap-10 gap-4 whitespace-nowrap bg-white px-9 py-6 border border-black rounded-lg drop-shadow-lg"
							>
								<SignInAndSignUpIcon1 width={71} height={71} customCSS={""} />
								<span className="font-bold sm:text-xl text-sm">Register As Merchant</span>
							</Link>
						)}

						<p className="text-center">or</p>

						{showSignInScene && (
							<Link
								onClick={resetSceneState}
								href={"/buyer/buyerSignIn"}
								className="login-as-merchant flex items-center sm:gap-10 gap-4 whitespace-nowrap bg-white px-9 py-6 border border-black rounded-lg drop-shadow-lg"
							>
								<SignInAndSignUpIcon2 width={71} height={71} customCSS={""} />
								<span className="font-bold sm:text-xl text-sm">Login As Buyer</span>
							</Link>
						)}

						{!showSignInScene && (
							<Link
								onClick={resetSceneState}
								href={"/buyer/buyerSignUp"}
								className="login-as-merchant flex items-center sm:gap-10 gap-4 whitespace-nowrap bg-white px-9 py-6 border border-black rounded-lg drop-shadow-lg"
							>
								<SignInAndSignUpIcon2 width={71} height={71} customCSS={""} />
								<span className="font-bold sm:text-xl text-sm">Register As Buyer</span>
							</Link>
						)}

						<div
							className="text-center hover:font-bold hover:text-[#9F885E] transition-all ease-in-out duration-500 cursor-pointer"
							onClick={() => {
								setShowSignInScene(!showSignInScene);
								setshowRegisterScene(!showRegisterScene);
							}}
						>
							{!showSignInScene ? (
								<p>Already registered on BLYT? Login</p>
							) : (
								<p>Are you a new user? Register Here</p>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default NavBarLayoutUser;
