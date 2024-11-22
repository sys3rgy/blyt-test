'use client'

import ButtonComponent1 from '@/components/CommonComponents/ButtonComponent1';
import InputComonentForSignInUpPage from '@/components/CommonComponents/InputComonentForSignInUpPage';
import LeftSideSignInUpComponent from '@/components/SignUpAndSignInComponents/LeftSideSignInUpComponent';
import { EyeIcon1, LoadingGif, SignInAndSignUpIcon1, SignInUpBriefcaseIcon1, SignInUpEmailSignIcon1, SignInUpInviteCodeIcon1Props, SignInUpPasswordIcon1, SignInUpUserIcon1 } from '@/images/ImagesExport';
import React, { use, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DataContext } from '@/context/DataContext';

const BuyerSignUpPage: React.FC = () => {

    const { isSessionExist } = useContext(DataContext);

    const router = useRouter();

    const [fullName, setfullName] = useState<string>('');
    const [email, setemail] = useState<string>('');
    const [userName, setuserName] = useState<string>('');
    const [password, setpassword] = useState<string>('');
    const [invitedBy, setinvitedBy] = useState<string>('');

    const [loading, setloading] = useState(false)
    const [signUpresponseMessage, setsignUpresponseMessage] = useState('')

    const [OTP, setOTP] = useState('')
    const [signUpVerify, setsignUpVerify] = useState(false)
    const [signUpVerifyResponse, setsignUpVerifyResponse] = useState('OTP Sent To Mail, Please Check Spam Too')

    const [showHidePassword, setshowHidePassword] = useState(true);

    //! Signup user
    async function signUpUser() {
        setloading(true)

        //* Checking if any field is empty 
        if (!fullName || !email || !userName || !password || !invitedBy) {
            setsignUpresponseMessage("All fields are required");
            setloading(false)
            return;
        }

        const data = { fullName, email, userName, password, invitedBy };

        const response = await axios.post('/api/buyersAPIs/buyerSignUpAPI', data);

        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 400) {
            setsignUpresponseMessage(message)
        } else if (statusCode === 201) {
            setsignUpresponseMessage(message)
            setsignUpVerify(true)
        }

        setloading(false)
    }

    //! Verify user
    async function verifyUser() {
        setloading(true)

        if (!OTP) {
            setsignUpVerifyResponse("Please enter OTP")
            setloading(false)
            return;
        }

        const data = { userName, OTP };

        const response = await axios.put('/api/buyersAPIs/buyerSignUpAPI', data);

        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 400) {
            setsignUpVerifyResponse(message)
        } else if (statusCode === 202) {
            setsignUpVerifyResponse(message)
            setsignUpVerify(true)
            setTimeout(() => {
                window.location.href = "/"
            }, 1000);
            return;
        }

        setloading(false)
    }

    useEffect(() => {
        setsignUpresponseMessage('')
    }, [fullName, email, userName, password, invitedBy])

    //! Show/Hide signUpVerifyResponse if called more than twice
    const [countOfI, setcountOfI] = useState(0)
    useEffect(() => {
        setcountOfI(prevCount => prevCount + 1);
    }, [OTP]);
    useEffect(() => {
        if (countOfI > 2) {
            setsignUpVerifyResponse('');
        }
    }, [countOfI]);

    //! Resend OTP
    async function resendOTP() {
        setloading(true);

        const data = { userName, email, title: 'signUp' };

        const response = await axios.put('/api/commonAPIs/resendOTP', data)

        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 205) {
            setsignUpVerifyResponse(message)
        } else {
            setsignUpVerifyResponse(message)
        }

        setloading(false);
    }

    //! Session check on user side
    async function localSessionCheck() {
        if (isSessionExist === true) {
            router.push('/')
        }
    }

    useEffect(() => {
        localSessionCheck();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>
            {(!loading && !signUpVerify) &&
                <section className="merchant-sign-up-section h-screen w-full flex items-center px-4 md:max-w-screen-lg max-w-xs m-auto">
                    <div className="max-width flex gap-50 w-full justify-evenly gap-2">

                        <section className="left-side-section md:flex hidden flex-col items-center gap-y-4 justify-center">
                            <LeftSideSignInUpComponent />
                        </section>

                        <section className="right-side-section flex flex-col gap-5 w-full">
                            <section className="heading flex items-center gap-2 font-bold capitalize lg:text-xl text-base">
                                <SignInAndSignUpIcon1 width={71} height={71} customCSS={''} />
                                <p>register as buyer</p>
                            </section>

                            <InputComonentForSignInUpPage
                                title="full name"
                                image={<SignInUpUserIcon1 width={20} height={20} customCSS={''} />}
                                inputType="name"
                                value={fullName}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setfullName(e.target.value)} />

                            <InputComonentForSignInUpPage
                                title="e-mail"
                                image={<SignInUpEmailSignIcon1 width={20} height={20} customCSS={''} />}
                                inputType="email"
                                value={email}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setemail(e.target.value)} />

                            <InputComonentForSignInUpPage
                                title="username"
                                image={<SignInUpUserIcon1 width={20} height={20} customCSS={''} />}
                                inputType="name"
                                value={userName}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setuserName(e.target.value)} />

                            <div className='password-input-field relative'>
                                <InputComonentForSignInUpPage
                                    title="password"
                                    image={<SignInUpPasswordIcon1 width={20} height={20} customCSS={''} />}
                                    inputType={showHidePassword ? "password" : "username"}
                                    value={password}
                                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setpassword(e.target.value)} />
                                <div onClick={() => setshowHidePassword(!showHidePassword)} className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer'>
                                    <EyeIcon1 width={30} height={30} customCSS={''} />
                                </div>
                            </div>

                            <InputComonentForSignInUpPage
                                title="invited by"
                                image={<SignInUpInviteCodeIcon1Props width={20} height={20} customCSS={''} />}
                                inputType="name"
                                value={invitedBy}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setinvitedBy(e.target.value)} />

                            {signUpresponseMessage.length !== 0 &&
                                <p className='text-center text-red-600 font-bold'>{signUpresponseMessage}</p>
                            }

                            <div className='cursor-pointer w-1/2 flex justify-center mx-auto' onClick={signUpUser}>
                                <ButtonComponent1
                                    leftSide={undefined}
                                    middleSide={'sign up'}
                                    rightSide={undefined}
                                    customSectionCSS={'w-full'}
                                    customButtonCSS={'w-full flex justify-center'}
                                />
                            </div>
                        </section>

                    </div>
                </section>
            }

            {loading &&
                <section className="loading-icon absolute w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm">
                    <LoadingGif width={250} height={250} />
                </section>
            }

            {(!loading && signUpVerify) &&
                <section className="merchant-sign-up-section h-screen w-full flex items-center px-4 md:max-w-screen-lg max-w-xs m-auto">
                    <div className="max-width flex gap-50 w-full justify-evenly gap-2">
                        <section className="right-side-section flex flex-col gap-5 ">
                            <InputComonentForSignInUpPage
                                title="OTP"
                                image={<SignInUpUserIcon1 width={20} height={20} customCSS={''} />}
                                inputType="name"
                                value={OTP}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setOTP(e.target.value)} />

                            {signUpVerifyResponse.length !== 0 &&
                                <p className='text-center text-red-600 font-bold'>{signUpVerifyResponse}</p>
                            }

                            <div className='cursor-pointer w-1/2 flex justify-center mx-auto' onClick={verifyUser}>
                                <ButtonComponent1
                                    leftSide={undefined}
                                    middleSide={'verify'}
                                    rightSide={undefined}
                                    customSectionCSS={'w-full'}
                                    customButtonCSS={'w-full flex justify-center'}
                                />
                            </div>

                            <p className='text-center font-bold cursor-pointer' onClick={resendOTP}>Resend OTP</p>
                        </section>
                    </div>
                </section>
            }
        </>
    );
};

export default BuyerSignUpPage;