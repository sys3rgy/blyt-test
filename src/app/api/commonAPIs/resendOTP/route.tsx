import { NextResponse } from 'next/server';
import { connect2MongoDB } from 'connect2mongodb'
import OTPModel from '@/models/OTPModel';
import randomStringGenerator from '@/utils/randomStringGenerator';

//! Checking if NEXT_PRIVATE_BCRYPT_SALT_ROUNDS is a number or not
import bcrypt from 'bcrypt';
import sendOTPToUser from '@/utils/email/sendOTPToUser';
import AccountsModel from '@/models/AccountsModel';
import { fetchUserIP } from '@/utils/fetchUserIP';
let saltRounds: number;
if (process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS === undefined || process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS.length === 0 || (Number.isNaN(Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS)))) {
    throw new Error("saltRounds is either undefined or not a number")
} else {
    saltRounds = Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS);
}

export async function PUT(request: Request) {

    //! Checking if user trying to access via any software like postman
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

    const { userName, email, title } = await request.json();

    const userIP = await fetchUserIP();

    //* Connecting to MongoDB
    await connect2MongoDB();

    //* Find if user exist or not
    const findOTPDocument = await OTPModel.findOne({ userName }).select('OTPCount').lean();

    //! If not, will check is verified or not
    if (!findOTPDocument) {

        const findIfUserVerified = await AccountsModel.findOne({ userName }).select('userEmail verified').lean();

        //! If verified, then, who are you?
        if (findIfUserVerified && findIfUserVerified.verified) {

            return NextResponse.json(
                {
                    message: "Who are you?",
                    statusCode: 403,
                },
                { status: 200 }
            );

            //! Make a new document & send OTP to user
        } else {

            //* Generate OTP
            const OTP = await randomStringGenerator(6);

            //! Encrypting the OTP
            const encryptedOTP = await bcrypt.hash(OTP, saltRounds);

            //* Sending mail to user
            const otpStatus = await sendOTPToUser(userName, findIfUserVerified.userEmail, OTP, title, userAgent, userIP);
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
                userName,
                OTP: encryptedOTP
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


    if (findOTPDocument.OTPCount < 2) {
        //* Generate OTP
        const OTP = await randomStringGenerator(6);

        //! Encrypting the OTP
        const encryptedOTP = await bcrypt.hash(OTP, saltRounds);

        //! If email is undefined, then, it means that, use wasn't able to verify his account in signup process, then,
        //! he is trying to verify now, so fetch his email from db, & send otp
        if (email === undefined) {
            const findUserEmail = await AccountsModel.findOne({ userName }).lean().select('userEmail').lean();
            //* Sending mail to user
            const otpStatus = await sendOTPToUser(userName, findUserEmail.userEmail, OTP, title, userAgent, userIP);
            if (!otpStatus.data) {
                return NextResponse.json(
                    {
                        message: "Server issue, please try after sometime.",
                        statusCode: 205,
                    },
                    { status: 200 }
                );
            }
        } else {
            //* Sending mail to user
            const otpStatus = await sendOTPToUser(userName, email, OTP, title, userAgent, userIP);
            if (!otpStatus.data) {
                return NextResponse.json(
                    {
                        message: "Server issue, please try after sometime.",
                        statusCode: 205,
                    },
                    { status: 200 }
                );
            }
        }


        //* Updating OTP To DB & incrementing OTPCount by 1
        await OTPModel.updateOne({ userName }, { OTP: encryptedOTP, $inc: { OTPCount: 1 } });

        return NextResponse.json(
            {
                message: "OTP Sent",
                statusCode: 200,
            },
            { status: 200 }
        );
    } else {
        return NextResponse.json(
            {
                message: "Max OTP Limit Reached, Please Try After 10 Minutes.",
                statusCode: 205,
            },
            { status: 200 }
        );
    }
}