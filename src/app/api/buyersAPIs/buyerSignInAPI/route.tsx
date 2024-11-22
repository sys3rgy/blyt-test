import AccountsModel from '@/models/AccountsModel';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse } from 'next/server'

//! Checking if NEXT_PRIVATE_BCRYPT_SALT_ROUNDS is a number or not
import bcrypt from 'bcrypt';
import randomStringGenerator from '@/utils/randomStringGenerator';
import sendOTPToUser from '@/utils/email/sendOTPToUser';
import OTPModel from '@/models/OTPModel';
import { cookies } from 'next/headers';
import SessionsModel from '@/models/SessionsModel';
let saltRounds: number;
if (process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS === undefined || process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS.length === 0 || (Number.isNaN(Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS)))) {
    throw new Error("saltRounds is either undefined or not a number")
} else {
    saltRounds = Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS);
}

import jwt from 'jsonwebtoken';
import { fetchUserIP } from '@/utils/fetchUserIP';
let jwtTokenValue: string;
if (!process.env.NEXT_PRIVATE_JWT_TOKEN_VALUE) {
    throw new Error(`NEXT_PRIVATE_JWT_TOKEN_VALUE is undefined.`);
} else {
    jwtTokenValue = process.env.NEXT_PRIVATE_JWT_TOKEN_VALUE;
}

export async function POST(request: Request) {

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

    const { userName, password } = await request.json();

    const userIP = await fetchUserIP();

    //* Connecting to MongoDB
    await connect2MongoDB();

    //* Find if user exist
    const findUser = await AccountsModel.findOne({ userName }).select('verified userEmail isMerchant userPassword').lean();

    //* If not then give this response
    if (!findUser) {
        return NextResponse.json(
            {
                message: 'No account found',
                statusCode: 400
            },
            { status: 200 }
        )
    }
    //! Checking if user is not verified
    if (!findUser.verified) {

        //* Generate OTP
        const OTP = await randomStringGenerator(6);

        //! Hashing the OTP
        const hashOTP = await bcrypt.hash(OTP, saltRounds);

        //* Sending mail to user
        const otpStatus = await sendOTPToUser(userName, findUser.userEmail, OTP, 'signIn', userAgent, userIP);
        if (!otpStatus.data) {
            return NextResponse.json(
                {
                    message: "Server issue, please try after sometime.",
                    statusCode: 205,
                },
                { status: 200 }
            );
        }

        //! Check if OTP exist
        const ifOTPExist = await OTPModel.findOne({ userName }).lean();

        if (ifOTPExist) {
            if (ifOTPExist.OTPCount < 2) {
                //* Updating OTP To DB & incrementing OTPCount by 1
                await OTPModel.updateOne({ userName }, { OTP: hashOTP, $inc: { OTPCount: 1 } });

                return NextResponse.json(
                    {
                        message: 'Please Verify Your Account',
                        statusCode: 401
                    },
                    { status: 200 }
                )
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

        //* Save OTP To DB
        await new OTPModel({
            userName,
            OTP: hashOTP,
            isMerchant: findUser.isMerchant
        }).save();

        return NextResponse.json(
            {
                message: 'Please Verify Your Account',
                statusCode: 401
            },
            { status: 200 }
        )
    }

    //! Comparing the password correct or not
    const comparePassword = await bcrypt.compare(password, findUser.userPassword)

    if (!comparePassword) {
        return NextResponse.json(
            {
                message: 'Please validate your details',
                statusCode: 400
            },
            { status: 200 }
        )
    }

    //* Generate OTP
    const OTP = await randomStringGenerator(6);

    //! Hashing the OTP
    const hashOTP = await bcrypt.hash(OTP, saltRounds);

    //* Sending mail to user
    const otpStatus = await sendOTPToUser(userName, findUser.userEmail, OTP, 'signIn', userAgent, userIP);
    if (!otpStatus.data) {
        return NextResponse.json(
            {
                message: "Server issue, please try after sometime.",
                statusCode: 205,
            },
            { status: 200 }
        );
    }

    //! Check if OTP exist
    const ifOTPExist = await OTPModel.findOne({ userName }).lean();

    //! If exist, update it
    if (ifOTPExist) {
        if (ifOTPExist.OTPCount < 2) {
            //* Updating OTP To DB & incrementing OTPCount by 1
            await OTPModel.updateOne({ userName }, { OTP: hashOTP, $inc: { OTPCount: 1 } });

            //! If limit exceeded, throw error
        } else {
            return NextResponse.json(
                {
                    message: "Max OTP Limit Reached, Please Try After 10 Minutes.",
                    statusCode: 205,
                },
                { status: 200 }
            );
        }

        //! If not exist, create new
    } else {
        //* Save OTP To DB
        await new OTPModel({
            userName,
            OTP: hashOTP,
            isMerchant: findUser.isMerchant
        }).save();
    }

    return NextResponse.json(
        {
            message: "Login successful",
            statusCode: 201,
        },
        { status: 200 }
    )
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

    const { userName, OTP } = await request.json();

    //* Connecting to MongoDB
    await connect2MongoDB()
    //* Firstly, It Will Find If User Exist In otpModel Or Not
    const getUserDetailsAndOTP = await OTPModel.findOne({ userName }).lean()

    //* If No Document's With The Given userName Exist In DB, Return 400 Status Code
    if (!getUserDetailsAndOTP) {
        return NextResponse.json(
            {
                message: "No Accounts Were Found To Verify",
                statusCode: 400
            },
            { status: 200 }
        );
    }

    //* Compare The OTP From The User
    const compareOTP = await bcrypt.compare(OTP, getUserDetailsAndOTP.OTP);

    //* If User Enters Wrong OTP
    if (compareOTP === false) {

        return NextResponse.json(
            {
                message: "Wrong OTP",
                statusCode: 400
            },
            { status: 200 }
        );

        //* If User Enters Correct OTP
    } else if (compareOTP === true) {

        //* Deleting OTP From DB
        await OTPModel.deleteOne({ userName });

        //! Hashing user agent
        const hashUserAgent = await bcrypt.hash(userAgent, saltRounds);

        //! JWT data
        const userData = {
            userName: getUserDetailsAndOTP.userName,
            userAgent: hashUserAgent,
            isMerchant: getUserDetailsAndOTP.isMerchant,
        }

        //! Generating a jwt token
        const jwtToken = jwt.sign(userData, jwtTokenValue)

        //! Find user id
        const getUserAccountId = await AccountsModel.findOne({ userName }).select('_id userFullName').lean();

        //! Sacing session to db
        const saveSession = await new SessionsModel({
            userName,
            userFullName: getUserAccountId.userFullName,
            jwtToken,
            userAgent: hashUserAgent,
            id: getUserAccountId._id,
            isMerchant: getUserDetailsAndOTP.isMerchant,
            //! Expire document from DB after 30 days
            expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }).save();

        //! Saving cookies
        cookies().set('userName', userName)
        cookies().set('token', jwtToken)
        cookies().set('isLogin', "true")
        cookies().set('sessionId', saveSession._id)

        return NextResponse.json(
            {
                message: "Account verified successfully",
                statusCode: 202,
                sessionId: saveSession.id,
                jwtToken
            },
            { status: 200 }
        );
    }
}