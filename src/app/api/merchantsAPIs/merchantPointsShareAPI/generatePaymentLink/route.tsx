import OrdersListModel from '@/models/OrdersListModel';
import SessionsModel from '@/models/SessionsModel';
import serverSideSessionCheck from '@/utils/serverSideSessionCheck';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server'
import bcrypt from 'bcrypt';
import AccountsModel from '@/models/AccountsModel';
import PointsHistoryModel from '@/models/PointsHistoryModel';
import { removeCookies } from '@/utils/removeCookies';
import MerchantSharePointsModel from '@/models/MerchantSharePointsModel';
import { GenerateSHA512Hash } from '@/utils/GenerateSHA512Hash';
import { fetchUserIP } from '@/utils/fetchUserIP';

export async function PUT(request: NextRequest) {

    //! Getting username from client-side
    const { buyerId, merchantId, userName, pointsToShare, pointsSharedOrderId, whomToShare, referredUserName, currencyCode, email, username, bearerToken, referrerId, pointsForReferrer, name } = await request.json();

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

    try {

        //! Checking session via DB
        const findSessionInDB = await SessionsModel.findById(isSessionExist.sessionIdCookie);

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

        //! If session exist, verify details
        if (userName === findSessionInDB.userName && isSessionExist.tokenCookie === findSessionInDB.jwtToken && await bcrypt.compare(userAgent as string, findSessionInDB.userAgent) && isSessionExist.userNameCookie === findSessionInDB.userName) {

            //* First we check if merchant is that much point or not 
            const merchantPoints = await AccountsModel.findOne({ _id: merchantId }, {}).select('blytPoints userName')

            if (merchantPoints.blytPoints <= pointsToShare) {
                return NextResponse.json(
                    {
                        message: "Insufficient funds!",
                        statusCode: 403,
                    },
                    { status: 200 }
                );
            }

            //! Generate a unique number slug
            let maxSlugCount = await MerchantSharePointsModel.findOne().sort('-uniqueId').select('uniqueId');
            let uniqueId = maxSlugCount ? maxSlugCount.uniqueId + 1 : 1;

            const uniqueOrderID = await new MerchantSharePointsModel({
                orderId: pointsSharedOrderId,
                merchantId: merchantId,
                buyerId: buyerId,
                pointsToShare: pointsToShare,
                uniqueId: uniqueId,
                referredUserName: referredUserName,
                pointsForReferrer: pointsForReferrer
            }).save();

            const getUniqueId = (uniqueOrderID.uniqueId).toString();

            const timestamp = new Date().getTime();
            const userIP = await fetchUserIP();

            let signature;
            let returnURL;

            if (whomToShare === 'buyer') {

                returnURL = '/api/merchantsAPIs/merchantPointsShareAPI/verifyPointsSharePayment/buyer';
                signature = GenerateSHA512Hash(JSON.stringify({ amount: (pointsToShare * 100), currencyCode: currencyCode, customer: { email: email, name: name, username: username }, ipAddress: userIP, referenceCode: getUniqueId, returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}${returnURL}`, timestamp: timestamp }));

            } else if (whomToShare === 'referred') {

                returnURL = '/api/merchantsAPIs/merchantPointsShareAPI/verifyPointsSharePayment/referred';
                signature = GenerateSHA512Hash(JSON.stringify({ amount: (pointsToShare * 100), currencyCode: currencyCode, customer: { email: email, name: name, username: username }, ipAddress: userIP, referenceCode: getUniqueId, returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}${returnURL}`, timestamp: timestamp }));

            }

            const url = 'https://staging-payments.commerce.asia/api/services/app/PaymentGateway/RequestPayment';
            const options = {
                method: 'POST',
                headers: {
                    'cap-signature': signature,
                    Authorization: `Bearer ${bearerToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ amount: (pointsToShare * 100), currencyCode: currencyCode, customer: { email: email, name: name, username: username }, ipAddress: userIP, referenceCode: getUniqueId, returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}${returnURL}`, timestamp: timestamp })
            };

            try {
                const response = await fetch(url, options as any);
                const data = await response.json();

                if (data.result.message === "Invalid Signature.") {
                    return NextResponse.json({ message: "Please contact admin!", statusCode: 204 }, { status: 200 });
                }

                return NextResponse.json(
                    { message: "Redirecting to payment page.", statusCode: 201, url: data.result.redirectUrl }, { status: 200 }
                );

            } catch (error) {
                console.error(error);
                return NextResponse.json(
                    { message: "Payment gateway issue, try again later. #2", statusCode: 403 }, { status: 200 }
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