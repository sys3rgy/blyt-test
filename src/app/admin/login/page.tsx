// eslint-disable-next-line react-hooks/exhaustive-deps

"use client";

import ResetPassowordButtonComponent from "@/components/ButtonsComponents/ResetPassowordButtonComponent";
import ButtonComponent1 from "@/components/CommonComponents/ButtonComponent1";
import InputComonentForSignInUpPage from "@/components/CommonComponents/InputComonentForSignInUpPage";
import LeftSideSignInUpComponent from "@/components/SignUpAndSignInComponents/LeftSideSignInUpComponent";
import { DataContext } from "@/context/DataContext";
import {
	EyeIcon1,
	LoadingGif,
	SignInAndSignUpIcon1,
	SignInUpPasswordIcon1,
	SignInUpUserIcon1,
} from "@/images/ImagesExport";
import axios from "axios";
import router from "next/router";
import React, { useContext, useEffect, useState } from "react";

const AdminLogin: React.FC = () => {
	const { user } = useContext(DataContext);

	const [userName, setuserName] = useState("");
	const [password, setpassword] = useState("");
	const [OTP, setOTP] = useState("");

	const [loading, setloading] = useState(false);
	const [signInVerify, setsignInVerify] = useState(false);
	const [signUpVerify, setsignUpVerify] = useState(false);
	const [signInResponse, setsignInResponse] = useState("");
	const [signInVerifyResponse, setsignInVerifyResponse] = useState("OTP Sent To Mail, Please Check Spam Too");

	const [showHidePassword, setshowHidePassword] = useState(true);

	async function signIn() {
		setloading(true);

		//* Checking if any field is empty
		if (!userName || !password) {
			setsignInResponse("All fields are required");
			setloading(false);
			return;
		}

		const data = { userName, password };

		const response = await axios.post("/api/adminAPIs/adminLoginAPI", data);
		const statusCode = response.data.statusCode;
		const message = response.data.message;

		if (statusCode === 400) {
			setsignInResponse(message);
		} else if (statusCode === 401) {
			setsignInResponse(message);
			setsignUpVerify(true);
		} else if (statusCode === 201) {
			setsignInResponse(message);
			setsignInVerify(true);
		} else if (statusCode === 205) {
			setsignInResponse(message);
		}

		setloading(false);
	}

	//! Show/Hide signUpVerifyResponse if called more than twice
	const [countOfI, setcountOfI] = useState(0);
	useEffect(() => {
		setcountOfI((prevCount) => prevCount + 1);
	}, [OTP]);
	useEffect(() => {
		if (countOfI > 2) {
			setsignInVerifyResponse("");
		}
	}, [countOfI]);

	//! Verify user whose account not verified
	async function verifyUserWhoseAccNotVerified() {
		setloading(true);

		if (!OTP) {
			setsignInVerifyResponse("Please enter OTP");
			setloading(false);
			return;
		}

		const data = { userName, OTP };

		const response = await axios.put("/api/adminAPIs/adminLoginAPI", data);
		const statusCode = response.data.statusCode;
		const message = response.data.message;

		if (statusCode === 400) {
			setsignInVerifyResponse(message);
		} else if (statusCode === 202) {
			setsignInVerifyResponse(message);
			setsignInVerify(true);
			setTimeout(() => {
				window.location.href = "/admin";
			}, 1000);
		}

		setloading(false);
	}

	//! Verify user whose account are verified
	async function verifyUserWhoseAccAreVerified() {
		setloading(true);

		if (!OTP) {
			setsignInVerifyResponse("Please enter OTP");
			setloading(false);
			return;
		}

		const data = { userName, OTP };

		const response = await axios.put("/api/adminAPIs/adminLoginAPI", data);
		const statusCode = response.data.statusCode;
		const message = response.data.message;

		if (statusCode === 400) {
			setsignInVerifyResponse(message);
		} else if (statusCode === 202) {
			setsignInVerifyResponse(message);
			setsignInVerify(true);
			setTimeout(() => {
				window.location.href = "/admin";
			}, 1000);
		}

		setloading(false);
	}

	//! Resend OTP
	async function resendOTP() {
		setloading(true);

		const data = { userName, title: "signIn" };

		const response = await axios.put("/api/commonAPIs/resendOTP", data);

		const statusCode = response.data.statusCode;
		const message = response.data.message;

		if (statusCode === 205) {
			setsignInVerifyResponse(message);
		} else {
			setsignInVerifyResponse(message);
		}

		setloading(false);
	}

	//! Session check on user side
	async function localSessionCheck() {
		if (user?.isAdmin === true) {
			window.location.href = "/admin";
		}
	}

	useEffect(() => {
		localSessionCheck();
	}, [user]);

	return (
		<>
			{!loading && !signInVerify && !signUpVerify && (
				<section className="merchant-sign-up-section h-screen w-full flex items-center px-4 md:max-w-screen-lg max-w-xs m-auto">
					<div className="max-width flex gap-50 w-full justify-evenly gap-2">
						<section className="left-side-section md:flex hidden flex-col items-center gap-y-4 justify-center">
							<LeftSideSignInUpComponent />
						</section>

						<section className="right-side-section flex flex-col gap-5 md:w-1/3 w-full justify-center">
							<section className="heading flex items-center gap-2 font-bold capitalize lg:text-xl text-base">
								<SignInAndSignUpIcon1 width={71} height={71} customCSS={""} />
								<p>admin login</p>
							</section>

							<InputComonentForSignInUpPage
								title="username"
								image={<SignInUpUserIcon1 width={20} height={20} customCSS={""} />}
								inputType="name"
								value={userName}
								onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
									setuserName(e.target.value)
								}
							/>

							<div className="password-input-field relative">
								<InputComonentForSignInUpPage
									title="password"
									image={<SignInUpPasswordIcon1 width={20} height={20} customCSS={""} />}
									inputType={showHidePassword ? "password" : "username"}
									value={password}
									onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
										setpassword(e.target.value)
									}
								/>
								<div
									onClick={() => setshowHidePassword(!showHidePassword)}
									className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
								>
									<EyeIcon1 width={30} height={30} customCSS={""} />
								</div>
							</div>

							{signInResponse.length !== 0 && (
								<p className="text-center text-red-600 font-bold">{signInResponse}</p>
							)}

							<div className="cursor-pointer w-1/2 flex justify-center mx-auto" onClick={signIn}>
								<ButtonComponent1
									leftSide={undefined}
									middleSide={"login"}
									rightSide={undefined}
									customSectionCSS={"w-full"}
									customButtonCSS={"w-full flex justify-center"}
								/>
							</div>

							<ResetPassowordButtonComponent />
						</section>
					</div>
				</section>
			)}

			{loading && (
				<section className="loading-icon absolute w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm">
					<LoadingGif width={250} height={250} />
				</section>
			)}

			{!loading && signUpVerify && (
				<section className="merchant-sign-up-verify-section h-screen w-full flex items-center px-4 md:max-w-screen-lg max-w-xs m-auto">
					<div className="max-width flex gap-50 w-full justify-evenly gap-2">
						<section className="right-side-section flex flex-col gap-5 ">
							<InputComonentForSignInUpPage
								title="OTP"
								image={<SignInUpUserIcon1 width={20} height={20} customCSS={""} />}
								inputType="name"
								value={OTP}
								onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
									setOTP(e.target.value)
								}
							/>

							{setsignInVerifyResponse.length !== 0 && (
								<p className="text-center text-red-600 font-bold">{signInVerifyResponse}</p>
							)}

							<div
								className="cursor-pointer w-1/2 flex justify-center mx-auto"
								onClick={verifyUserWhoseAccNotVerified}
							>
								<ButtonComponent1
									leftSide={undefined}
									middleSide={"verify"}
									rightSide={undefined}
									customSectionCSS={"w-full"}
									customButtonCSS={"w-full flex justify-center"}
								/>
							</div>

							<p className="text-center font-bold cursor-pointer" onClick={resendOTP}>
								Resend OTP
							</p>
						</section>
					</div>
				</section>
			)}

			{!loading && signInVerify && (
				<section className="merchant-sign-in-verify-section h-screen w-full flex items-center px-4 md:max-w-screen-lg max-w-xs m-auto">
					<div className="max-width flex gap-50 w-full justify-evenly gap-2">
						<section className="right-side-section flex flex-col gap-5 ">
							<InputComonentForSignInUpPage
								title="OTP"
								image={<SignInUpUserIcon1 width={20} height={20} customCSS={""} />}
								inputType="name"
								value={OTP}
								onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
									setOTP(e.target.value)
								}
							/>

							{setsignInVerifyResponse.length !== 0 && (
								<p className="text-center text-red-600 font-bold">{signInVerifyResponse}</p>
							)}

							<div
								className="cursor-pointer w-1/2 flex justify-center mx-auto"
								onClick={verifyUserWhoseAccAreVerified}
							>
								<ButtonComponent1
									leftSide={undefined}
									middleSide={"verify"}
									rightSide={undefined}
									customSectionCSS={"w-full"}
									customButtonCSS={"w-full flex justify-center"}
								/>
							</div>

							<p className="text-center font-bold cursor-pointer" onClick={resendOTP}>
								Resend OTP
							</p>
						</section>
					</div>
				</section>
			)}
		</>
	);
};

export default AdminLogin;
