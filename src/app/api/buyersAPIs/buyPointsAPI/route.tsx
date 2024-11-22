import SessionsModel from '@/models/SessionsModel';
import serverSideSessionCheck from '@/utils/serverSideSessionCheck';
import { connect2MongoDB } from 'connect2mongodb';
import bcrypt from 'bcrypt';
import PointsPurchasesModel from '@/models/PointsPurchasesModel';
import axios from 'axios';
import { NextResponse, type NextRequest } from 'next/server'
import crypto from 'crypto';
import AccountsModel from '@/models/AccountsModel';
import PointsHistoryModel from '@/models/PointsHistoryModel';
import { removeCookies } from '@/utils/removeCookies';
import { fetchUserIP } from '@/utils/fetchUserIP';
import { GenerateSHA512Hash } from '@/utils/GenerateSHA512Hash';

let gkashCID: string;
if (process.env.NEXT_PUBLIC_GKASH_CID !== undefined) {
    gkashCID = process.env.NEXT_PUBLIC_GKASH_CID;
}

export async function GET(request: NextRequest) {
    const url = 'https://staging-payments.commerce.asia/api/TokenAuth/Authenticate';
    const options = {
        method: 'POST',
        headers: {
            'Abp.TenantId': `${process.env.COMMERCE_PAY_TENANT_ID}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            userNameOrEmailAddress: `${process.env.COMMERCE_PAY_ID}`,
            password: `${process.env.COMMERCE_PAY_PASSWORD}`
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        return NextResponse.json(
            {
                message: "Access token created successfully.",
                statusCode: 201,
                token: data.result.accessToken
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                message: "Payment gateway issue, try again later. #1",
                statusCode: 201,
            },
            { status: 200 }
        );
    }
}

export async function POST(request: Request) {

    //! Checking if all cookies exist
    const isSessionExist = await serverSideSessionCheck();
    if (!isSessionExist) {
        // removeCookies();
        return NextResponse.json(
            {
                message: "No session found",
                statusCode: 404,
            },
            { status: 200 }
        );
    }


    //* Connecting to MongoDB
    await connect2MongoDB();

    const { bearerToken, amount, currencyCode, customer: { email, name, username }, referenceCode, points } = await request.json();

    if (!bearerToken || !amount || !currencyCode || !email || !name || !username || !referenceCode) {
        return NextResponse.json(
            {
                message: "Please fill all the fields.",
                statusCode: 204,
            },
            { status: 200 }
        );
    }

    //! Checking session in server before uploading files & updating data
    try {

        //! Checking session via DB
        const findSessionInDB = await SessionsModel.findById(isSessionExist.sessionIdCookie).populate('id');
        //! If session not exist
        if (!findSessionInDB) {
            // removeCookies();
            return NextResponse.json(
                {
                    message: "No session found",
                    statusCode: 404,
                },
                { status: 200 }
            );
        }
        //! Comparing userAgent data
        const userAgent = request.headers.get('user-agent');
        const userIP = await fetchUserIP();

        //! If session exist, perform functions
        if (isSessionExist.userNameCookie === findSessionInDB.userName && isSessionExist.tokenCookie === findSessionInDB.jwtToken && await bcrypt.compare(userAgent as string, findSessionInDB.userAgent) && isSessionExist.userNameCookie === findSessionInDB.userName) {

            //! Generate a unique number slug
            let maxSlugCount = await PointsPurchasesModel.findOne().sort('-uniqueId').select('uniqueId');
            let uniqueId = maxSlugCount ? maxSlugCount.uniqueId + 1 : 1;

            const orderId = await PointsPurchasesModel({
                buyerName: name,
                userEmail: email,
                clientIP: userIP,
                currency: currencyCode,
                points: points,
                amount: parseInt(amount),
                buyerId: findSessionInDB.id._id,
                buyerUserName: findSessionInDB.id.userName,
                uniqueId: uniqueId
            }).save();

            const getUniqueId = (orderId.uniqueId).toString();

            const timestamp = new Date().getTime();

            const signature = GenerateSHA512Hash(JSON.stringify({ amount: (amount * 100), currencyCode: currencyCode, customer: { email: email, name: name, username: username }, ipAddress: userIP, referenceCode: getUniqueId, returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/payment-verify`, timestamp: timestamp }));

            const url = 'https://staging-payments.commerce.asia/api/services/app/PaymentGateway/RequestPayment';
            const options = {
                method: 'POST',
                headers: {
                    'cap-signature': signature,
                    Authorization: `Bearer ${bearerToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ amount: (amount * 100), currencyCode: currencyCode, customer: { email: email, name: name, username: username }, ipAddress: userIP, referenceCode: getUniqueId, returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/payment-verify`, timestamp: timestamp })
            };


            try {
                const response = await fetch(url, options as any);
                const data = await response.json();

                if (data.result.message === "Invalid Signature.") {
                    return NextResponse.json(
                        {
                            message: "Please contact admin!",
                            statusCode: 204
                        },
                        { status: 200 }
                    );
                }

                return NextResponse.json(
                    {
                        message: "Redirecting to payment page.",
                        statusCode: 201,
                        url: data.result.redirectUrl
                    },
                    { status: 200 }
                );

            } catch (error) {
                console.error(error);
                return NextResponse.json(
                    {
                        message: "Payment gateway issue, try again later. #2",
                        statusCode: 201,
                    },
                    { status: 200 }
                );
            }
        }

        // removeCookies();
        return NextResponse.json(
            {
                message: "No session found",
                statusCode: 404,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        // removeCookies();
        return NextResponse.json(
            {
                message: "No session found",
                statusCode: 404,
            },
            { status: 200 }
        );
    }
}

export async function PUT(request: Request) {

    //* Connecting to MongoDB
    await connect2MongoDB();

    const { orderId, paymentStatus } = await request.json();

    if (paymentStatus) {

        const getBuyerId = await PointsPurchasesModel.findOne({ _id: orderId }).select('isMoneyAddedToAccount buyerUserName buyerId points');

        if (getBuyerId.isMoneyAddedToAccount === true) {
            return NextResponse.json(
                {
                    message: "Points already added",
                    statusCode: 304,
                    buyerUsername: getBuyerId.buyerUserName
                },
                { status: 200 }
            );
        }

        await new PointsHistoryModel({
            userName: getBuyerId.buyerUserName,
            points: parseInt(getBuyerId.points),
            reason: 'Points purchased'
        }).save();

        await PointsPurchasesModel.updateOne({ _id: orderId }, { isPaymentDone: paymentStatus, isMoneyAddedToAccount: true, $unset: { expireAt: 1 } });

        await AccountsModel.updateOne({ _id: getBuyerId.buyerId }, { $inc: { blytPoints: getBuyerId.points } });

        return NextResponse.json(
            {
                message: "Points added successfully.",
                statusCode: 202,
            },
            { status: 200 }
        );
    } else {

        const getBuyerId = await PointsPurchasesModel.findOne({ _id: orderId }).select('buyerUserName points');

        await new PointsHistoryModel({
            userName: getBuyerId.buyerUserName,
            points: parseInt(getBuyerId.points),
            reason: 'Points purchased'
        }).save();

        return NextResponse.json(
            {
                message: "Payment failed.",
                statusCode: 403,
            },
            { status: 200 }
        );
    }
}