'use client'

import ButtonComponent1 from '@/components/CommonComponents/ButtonComponent1';
import InputComonentForSignInUpPage from '@/components/CommonComponents/InputComonentForSignInUpPage';
import LeftSideSignInUpComponent from '@/components/SignUpAndSignInComponents/LeftSideSignInUpComponent';
import { LoadingGif, SignInAndSignUpIcon1, SignInUpPasswordIcon1, SignInUpUserIcon1 } from '@/images/ImagesExport';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordPage: React.FC = () => {

    const router = useRouter();

    const [userEmail, setuserEmail] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [OTP, setOTP] = useState('');

    const [loading, setloading] = useState(false);
    const [signInResponse, setsignInResponse] = useState('');
    const [updatePasswordResponse, setupdatePasswordResponse] = useState('');
    const [enterOTPAndPasswordScene, setenterOTPAndPasswordScene] = useState(false);

    const [sendButtonText, setsendButtonText] = useState('get otp')

    async function getOTP() {

        setloading(true)

        const data = { userEmail, title: "forgotPassword" }

        //* Checking if any field is empty 
        if (!userEmail) {
            setsignInResponse("All fields are required");
            setloading(false)
            return;
        }

        const response = await axios.post('/api/commonAPIs/resetPassword', data)
        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 400) {
            setsignInResponse(message)
        } else if (statusCode === 200) {
            setsignInResponse(message)
            setsendButtonText("resend otp")
            setenterOTPAndPasswordScene(true);
        } else if (statusCode === 204) {
            setsignInResponse(message)
            setenterOTPAndPasswordScene(false);
        } else if (statusCode === 205) {
            setsignInResponse(message)
            setenterOTPAndPasswordScene(false);
        }

        setloading(false)
    }

    async function updatePassword() {
        setloading(true)

        const data = { userEmail, newPassword, OTP, title: "forgotPassword" }

        if (newPassword.length < 8) {
            setupdatePasswordResponse("Password too short")
            setloading(false)
            return;
        }

        const response = await axios.put('/api/commonAPIs/resetPassword', data)
        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 403) {
            setupdatePasswordResponse(message)
        } else if (statusCode === 202) {
            toast.success(message, {});
            setupdatePasswordResponse(message)

            setTimeout(() => {
                window.location.href = '/';
            }, 2000);

        } else if (statusCode === 203) {
            setupdatePasswordResponse(message)
        }

        setloading(false)
    }

    return (
        <>
            {(!loading) &&
                <section className="merchant-sign-up-section h-screen w-full flex items-center px-4 md:max-w-screen-lg max-w-xs m-auto">
                    <div className="max-width flex gap-50 w-full justify-evenly gap-2">

                        <section className="left-side-section md:flex hidden flex-col items-center gap-y-4 justify-center">
                            <LeftSideSignInUpComponent />
                        </section>

                        <section className="right-side-section flex flex-col gap-5 md:w-1/3 w-full justify-center">
                            <section className="heading flex items-center gap-2 font-bold capitalize lg:text-xl text-base">
                                <SignInAndSignUpIcon1 width={71} height={71} customCSS={''} />
                                <p>forgot password</p>
                            </section>

                            <InputComonentForSignInUpPage
                                title="Email"
                                image={<SignInUpUserIcon1 width={20} height={20} customCSS={''} />}
                                inputType="name"
                                value={userEmail}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setuserEmail(e.target.value)} />


                            {signInResponse.length !== 0 &&
                                <p className='text-center text-red-600 font-bold'>{signInResponse}</p>
                            }

                            <div className='cursor-pointer w-1/2 flex justify-center mx-auto' onClick={getOTP}>
                                <ButtonComponent1
                                    leftSide={undefined}
                                    middleSide={sendButtonText}
                                    rightSide={undefined}
                                    customSectionCSS={'w-full'}
                                    customButtonCSS={'w-full flex justify-center'}
                                />
                            </div>

                            {enterOTPAndPasswordScene &&
                                <>
                                    <InputComonentForSignInUpPage
                                        title="OTP"
                                        image={<SignInUpUserIcon1 width={20} height={20} customCSS={''} />}
                                        inputType="name"
                                        value={OTP}
                                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setOTP(e.target.value)} />

                                    <InputComonentForSignInUpPage
                                        title="Password"
                                        image={<SignInUpUserIcon1 width={20} height={20} customCSS={''} />}
                                        inputType="password"
                                        value={newPassword}
                                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setnewPassword(e.target.value)} />

                                    {updatePasswordResponse.length !== 0 &&
                                        <p className='text-center text-red-600 font-bold'>{updatePasswordResponse}</p>
                                    }

                                    <div className='cursor-pointer w-[60%] flex justify-center mx-auto whitespace-nowrap' onClick={updatePassword}>
                                        <ButtonComponent1
                                            leftSide={undefined}
                                            middleSide={'update password'}
                                            rightSide={undefined}
                                            customSectionCSS={'w-full'}
                                            customButtonCSS={'w-full flex justify-center'}
                                        />
                                    </div>
                                </>
                            }

                        </section>

                    </div>
                </section>
            }

            {loading &&
                <section className="loading-icon absolute w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm">
                    <LoadingGif width={250} height={250} />
                </section>
            }
        </>
    )
}

export default ResetPasswordPage