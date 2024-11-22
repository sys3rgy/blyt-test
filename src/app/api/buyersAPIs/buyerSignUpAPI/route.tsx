import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'
import { connect2MongoDB } from 'connect2mongodb'
import AccountsModel from '@/models/AccountsModel';
import randomStringGenerator from '@/utils/randomStringGenerator';

import sendOTPToUser from '@/utils/email/sendOTPToUser';
import OTPModel from '@/models/OTPModel';

//! Checking if NEXT_PRIVATE_BCRYPT_SALT_ROUNDS is a number or not
import bcrypt from 'bcrypt';
let saltRounds: number;
if (process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS === undefined || process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS.length === 0 || (Number.isNaN(Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS)))) {
    throw new Error("saltRounds is either undefined or not a number")
} else {
    saltRounds = Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS);
}

//! Fethcing  & verifying environment variables
import jwt from 'jsonwebtoken';
import SessionsModel from '@/models/SessionsModel';
import PointsHistoryModel from '@/models/PointsHistoryModel';
import { fetchUserIP } from '@/utils/fetchUserIP';
let jwtTokenValue: string;
if (!process.env.NEXT_PRIVATE_JWT_TOKEN_VALUE) {
    throw new Error(`NEXT_PRIVATE_JWT_TOKEN_VALUE is undefined.`);
} else {
    jwtTokenValue = process.env.NEXT_PRIVATE_JWT_TOKEN_VALUE;
}

export async function POST(request: Request) {

    try {
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

        const { fullName, email, userName, password, invitedBy } = await request.json();

        const userIP = await fetchUserIP();

        //* Checking If userFullName Is Valid Or Not
        const regexForuserFullName = /^[a-zA-Z\s]+$/;
        if (!regexForuserFullName.test(fullName)) {
            return NextResponse.json(
                {
                    message: "Invalid userFullname",
                    statusCode: 400
                },
                { status: 200 }
            )
        }

        //* Checking If Email Includes 2 @ Signs
        const regexForuserEmail = /^[a-zA-Z0-9._@]+$/;
        if (email.toLowerCase().includes('@', email.toLowerCase().indexOf('@') + 1) || !regexForuserEmail.test(email)) {
            return NextResponse.json(
                {
                    message: "Invalid Email",
                    statusCode: 400
                },
                { status: 200 }
            )
        }

        //* Checking If userName Is Valid Or Not
        const regexForuserName = /^[a-zA-Z0-9_]+$/;
        if (!regexForuserName.test(userName)) {
            return NextResponse.json(
                {
                    message: "Invalid userName",
                    statusCode: 400
                },
                { status: 200 }
            )
        }

        //* Checking if password length is lesser than 8
        if (password.length < 8) {
            return NextResponse.json(
                {
                    message: "Password must be ≥ 8",
                    statusCode: 400
                },
                { status: 200 }
            )
        }

        //* Check if invite code length is 6
        if (invitedBy.length !== 6) {
            return NextResponse.json(
                {
                    message: 'Invalid Invite Code',
                    statusCode: 400
                },
                { status: 200 }
            )
        }

        //! If all of the data above verifies, then, we will start checking if any common data exist in DB or not

        //* Connecting to MongoDB
        await connect2MongoDB()

        //* Checking if email or userName or businessName exist
        const checkIfuserNameOrMailInExist = await AccountsModel.findOne({
            $or: [
                { userName: { $regex: new RegExp(userName, 'i') } },
                { userEmail: { $regex: new RegExp(email, 'i') } },
            ]
        }).select('userName userEmail').lean();

        //* If any of them exist, then, throw this message
        if (checkIfuserNameOrMailInExist) {
            if (checkIfuserNameOrMailInExist.userEmail.toLowerCase() === email.toLowerCase()) {
                return NextResponse.json({
                    message: "Email ID Already Exists.",
                    statusCode: 400
                });
            }
            if (checkIfuserNameOrMailInExist.userName.toLowerCase() === userName.toLowerCase()) {
                return NextResponse.json({
                    message: "Username Already Exists.",
                    statusCode: 400
                });
            }
        }

        //* Generate a new inviite/referral code
        const inviteCode = await generateinviteCode(invitedBy);

        //*  Find the userName linked to the inviteCode
        const invitedByUserName = await AccountsModel.findOne({ inviteCode: invitedBy }).select('userName');

        //! Hashing the password
        const hashPassword = await bcrypt.hash(password, saltRounds);

        //* Saving the user to DB
        const newUserID = await new AccountsModel({
            userFullName: fullName,
            userEmail: email,
            userName,
            userPassword: hashPassword,
            invitedBy: invitedByUserName.userName,
            inviteCode,
            isMerchant: false,
            activationStatus: true,
            "service.serviceCategory": 'deleteIt'
        }).save();

        await AccountsModel.updateOne(
            { _id: newUserID },
            { $unset: { bio: 1, businessName: 1, businessCategory: 1, businessDescription: 1, businessPhoneNumberCountryCode: 1, businessPhoneNumber: 1, businessLocation: 1, businessAddress: 1, businessCity: 1, businessPincode: 1, businessState: 1, businessPage: 1, websiteLink: 1, dealsCount: 1, profileViews: 1, totalOrders: 1, totalEarnings: 1, service: 1, packagesList: 1, averageRatings: 1, likes: 1 } }
        );

        //* Generate OTP
        const OTP = await randomStringGenerator(6);

        //! Hashing the OTP
        const hashOTP = await bcrypt.hash(OTP, saltRounds);

        //* Sending mail to user
        const otpStatus = await sendOTPToUser(userName, email, OTP, 'signUp', userAgent, userIP);
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
            OTP: hashOTP
        }).save();

        return NextResponse.json(
            {
                message: 'Account created successfully',
                statusCode: 201
            },
            { status: 200 }
        )
    } catch (error) {
        console.error(error);
        console.error("Error in buyerSignUpAPI POST Call");
    }
}

export async function PUT(request: Request) {

    const pointsForNewMember = 0;
    const pointsForOldMember = 0;

    try {

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

        const userIP = await fetchUserIP();

        //* Connecting to MongoDB
        await connect2MongoDB()
        //* Firstly, It Will Find If User Exist In otpModel Or Not
        const getUserDetailsAndOTP = await OTPModel.findOne({ userName }).lean();

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

            //* Update verified status to true & give him points
            const updatedUser = await AccountsModel.findOneAndUpdate({ userName }, { $set: { verified: true }, $inc: { blytPoints: pointsForNewMember } }, { new: true }).select('userEmail isMerchant invitedBy').lean();

            //* Add the new userName to the user who referred him, & give him points
            await AccountsModel.updateOne({ userName: updatedUser.invitedBy }, { $inc: { blytPoints: pointsForOldMember }, $addToSet: { totalReferrals: userName } });

            //! Hashing user agent
            const hashUserAgent = await bcrypt.hash(userAgent, saltRounds);

            //! JWT data
            const userData = {
                userName: updatedUser.userName,
                userAgent: hashUserAgent,
                isMerchant: updatedUser.isMerchant,
            }

            //! Generating a jwt token
            const jwtToken = jwt.sign(userData, jwtTokenValue)

            //! Sacing session to db
            const saveSession = await new SessionsModel({
                userName,
                jwtToken,
                userAgent: hashUserAgent,
                id: updatedUser._id,
                isMerchant: updatedUser.isMerchant,
                //! Expire document from DB after 30 days
                expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }).save();

            //! Saving cookies
            cookies().set('userName', userName)
            cookies().set('token', jwtToken)
            cookies().set('isLogin', "true")
            cookies().set('sessionId', saveSession._id)

            const otpStatus = await sendOTPToUser(userName, updatedUser.userEmail, OTP, 'newUser', 'userAgentInbuyerSignUPAPI296', userIP);
            if (!otpStatus.data) {
                return NextResponse.json(
                    {
                        message: "Server issue, please try after sometime.",
                        statusCode: 205,
                    },
                    { status: 200 }
                );
            }

            if (pointsForNewMember !== 0 && pointsForOldMember !== 0) {
                await new PointsHistoryModel({
                    userName: userName,
                    points: pointsForNewMember,
                    reason: 'Welcome bonus'
                }).save();

                await new PointsHistoryModel({
                    userName: updatedUser.invitedBy,
                    points: pointsForNewMember,
                    reason: `Referral for ${userName}`
                }).save();
            }

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
    } catch (error) {
        console.error(error);
        console.error("Error in buyerSignUpAPI PUT Call");
    }
}

//! This will check if invite code exist in DB or not
//! If exist, then, recreate & check
//! If not then return
async function generateinviteCode(invitedBy: string) {
    const generatedinviteCode = await randomStringGenerator(6);
    const findIfInviteCodeExist = await AccountsModel.exists({ inviteCode: generatedinviteCode })
    if (findIfInviteCodeExist) {
        await generateinviteCode(invitedBy)
    } else {
        return generatedinviteCode;
    }
}
