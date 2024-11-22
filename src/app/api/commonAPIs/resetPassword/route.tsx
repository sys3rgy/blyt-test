import { NextRequest, NextResponse } from 'next/server';
import { connect2MongoDB } from 'connect2mongodb'
import OTPModel from '@/models/OTPModel';
import randomStringGenerator from '@/utils/randomStringGenerator';

//! Checking if NEXT_PRIVATE_BCRYPT_SALT_ROUNDS is a number or not
import bcrypt from 'bcrypt';
import sendOTPToUser from '@/utils/email/sendOTPToUser';
import AccountsModel from '@/models/AccountsModel';
import { removeCookies } from '@/utils/removeCookies';
let saltRounds: number;
if (process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS === undefined || process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS.length === 0 || (Number.isNaN(Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS)))) {
    throw new Error("saltRounds is either undefined or not a number")
} else {
    saltRounds = Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS);
}

export async function POST(request: NextRequest) {

    //! Comparing userAgent data
    const userAgent = request.headers.get('user-agent');
    if (!userAgent) {
        return NextResponse.json(
            {
                message: 'Method not allowed',
                statusCode: 400
            },
            { status: 200 }
        )
    }

    try {

        const { userEmail, title } = await request.json();

        //* Connecting to MongoDB
        await connect2MongoDB();

        const findOne = await AccountsModel.exists({ userEmail });

        if (!findOne) {
            // removeCookies();
            return NextResponse.json(
                {
                    message: "No E-Mail ddress exist.",
                    statusCode: 204,
                },
                { status: 200 }
            );
        } else {

            //* Generate OTP
            const OTP = await randomStringGenerator(6);

            //! Encrypting the OTP
            const encryptedOTP = await bcrypt.hash(OTP, saltRounds);

            const isOTPAlreadyExist = await OTPModel.findOne({ userEmail }).select('userName OTPCount').lean();

            if (isOTPAlreadyExist) {

                if (isOTPAlreadyExist.OTPCount < 2) {

                    await OTPModel.updateOne({ userEmail }, { OTP: encryptedOTP, $inc: { OTPCount: 1 } });

                    //* Fetch userName, & send mail to user
                    const getUsername = await AccountsModel.findOne({ userEmail }).select('userName').lean();
                    const otpStatus = await sendOTPToUser(getUsername.userName, userEmail, OTP, title, userAgent);
                    if (!otpStatus.data) {
                        return NextResponse.json(
                            {
                                message: "Server issue, please try after sometime.",
                                statusCode: 205,
                            },
                            { status: 200 }
                        );
                    }

                    return NextResponse.json(
                        {
                            message: "OTP Resent",
                            statusCode: 200,
                        },
                        { status: 200 }
                    );
                } else {
                    return NextResponse.json(
                        {
                            message: "OTP Limit Reached, please try after 10 mins.",
                            statusCode: 205,
                        },
                        { status: 200 }
                    );
                }

            } else {

                const getUsername = await AccountsModel.findOne({ userEmail }).select('userName').lean();

                //* Sending mail to user
                const otpStatus = await sendOTPToUser(getUsername.userName, userEmail, OTP, title, userAgent);
                if (!otpStatus.data) {
                    return NextResponse.json(
                        {
                            message: "Server issue, please try after sometime.",
                            statusCode: 205,
                        },
                        { status: 200 }
                    );
                }

                //* Save OTP To DB
                await new OTPModel({
                    userEmail,
                    OTP: encryptedOTP,
                    expireAt: new Date(Date.now() + 5 * 60 * 1000)
                }).save();

                return NextResponse.json(
                    {
                        message: "OTP Sent",
                        statusCode: 200,
                    },
                    { status: 200 }
                );

            }
        }

    } catch (error) {

        // removeCookies();
        console.error("An error occurred:", error);
        return NextResponse.json(
            {
                message: "Internal server error at resetPassword API POST call, please contact your administrator.",
                statusCode: 500,
            },
            { status: 500 }
        );

    }

}

export async function PUT(request: Request) {

    try {

        const { userEmail, newPassword, OTP } = await request.json();

        //* Connecting to MongoDB
        await connect2MongoDB();

        const checkIFOTPExist = await OTPModel.findOne({ userEmail }).lean();

        if (!checkIFOTPExist) {
            // removeCookies();
            return NextResponse.json(
                {
                    message: "Please try again after sometime",
                    statusCode: 403,
                },
                { status: 200 }
            );

        } else {

            if (await bcrypt.compare(OTP as string, checkIFOTPExist.OTP)) {

                await OTPModel.deleteOne({ userEmail });

                //! Hashing the password
                const hashPassword = await bcrypt.hash(newPassword, saltRounds);

                await AccountsModel.updateOne({ userEmail }, { userPassword: hashPassword });

                return NextResponse.json(
                    {
                        message: "Password updated successfully",
                        statusCode: 202,
                    },
                    { status: 200 }
                );
            } else {
                // removeCookies();
                return NextResponse.json(
                    {
                        message: "Invalid OTP",
                        statusCode: 203,
                    },
                    { status: 200 }
                );
            }
        }

    } catch (error) {

        // removeCookies();
        console.error("An error occurred:", error);
        return NextResponse.json(
            {
                message: "Internal server error at resetPassword API PUT call, please contact your administrator.",
                statusCode: 500,
            },
            { status: 500 }
        );

    }
}