import AccountsModel from '@/models/AccountsModel';
import SessionsModel from '@/models/SessionsModel';
import serverSideSessionCheck from '@/utils/serverSideSessionCheck';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server'
import bcrypt from 'bcrypt';
import OrdersListModel from '@/models/OrdersListModel';
import { removeCookies } from '@/utils/removeCookies';

export async function GET(request: NextRequest) {

    //! Getting username from client-side
    const searchParams = request.nextUrl.searchParams
    const userName = searchParams.get('userName')
    const method = searchParams.get('method')

    //! Checking if all cookies exist
    const isSessionExist = await serverSideSessionCheck();

    if (!isSessionExist) {
        // removeCookies();
        return NextResponse.json(
            {
                message: "No session found 1",
                statusCode: 404,
            },
            { status: 200 }
        );
    }

    //* Connecting to MongoDB
    await connect2MongoDB();

    try {

        //! Checking session via DB
        const findSessionInDB = await SessionsModel.findById(isSessionExist.sessionIdCookie)
            .populate([
                {
                    path: 'id',
                    select: '_id userName userFullName userName blytPoints isMerchant createdAt userProfilePic'
                },
            ]);


        //! If session not exist
        if (!findSessionInDB) {

            // removeCookies();
            return NextResponse.json(
                {
                    message: "No session found 2",
                    statusCode: 404,
                },
                { status: 200 }
            );
        }

        //! Comparing userAgent data
        const userAgent = request.headers.get('user-agent');

        //! If session exist, verify details
        if (userName === findSessionInDB.userName && isSessionExist.tokenCookie === findSessionInDB.jwtToken && await bcrypt.compare(userAgent as string, findSessionInDB.userAgent) && isSessionExist.userNameCookie === findSessionInDB.userName) {

            if (method === 'buyerPointsFetch') {

                const data = await AccountsModel.findOne({ userName: findSessionInDB.userName }).select('blytPoints').lean();

                return NextResponse.json({ blytPoints: data.blytPoints, message: "Session found", statusCode: 200, }, { status: 200 });

            } else {
                const statuses = ['initiated contact', 'work in progress', 'done deals'];
                const orders = [];

                const buyerId = findSessionInDB.id._id;

                for (const status of statuses) {
                    const order = await OrdersListModel.findOne({ buyerId, orderStatus: status })
                        .select('buyerUserName packageName packageDescription packageAmount orderStatus rating orderReviewed buyerId userName buyerProfilePic')
                        .sort({ createdAt: -1 })
                        .populate({
                            path: 'merchantId',
                            select: 'userName businessName userProfilePic',
                        })
                        .populate({
                            path: 'packageId',
                            select: 'merchantUserName packageName packageAmount orderStatus orderReviewed'
                        });


                    if (order) {
                        orders.push(order);
                    }
                }

                const { ...buyerData } = findSessionInDB.id.toObject();

                return NextResponse.json(
                    {
                        message: "Session found", statusCode: 200, buyerData, orders
                    },
                    { status: 200 }
                );
            }
        }

        // removeCookies();
        return NextResponse.json(
            {
                message: "No session found 3",
                statusCode: 404,
            },
            { status: 200 }
        );

    } catch (error) {
        // removeCookies();
        console.log(error)
        return NextResponse.json(
            {
                message: "No session found 4",
                statusCode: 404,
            },
            { status: 200 }
        );

    }
}

export async function POST(request: NextRequest) {

    const { userName, merchantId } = await request.json();

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
        const findSessionInDB = await SessionsModel.findById(isSessionExist.sessionIdCookie)
            .populate([
                {
                    path: 'id',
                    select: '_id userFullName userName blytPoints isMerchant totalReviews createdAt userProfilePic'
                },
            ]);


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

            const data = await AccountsModel.exists({ userName: userName, likesList: merchantId });

            if (!data) {

                await AccountsModel.updateOne({ _id: merchantId }, { $inc: { likes: 1 } })
                await AccountsModel.updateOne({ userName }, { $push: { likesList: merchantId } });

                return NextResponse.json(
                    {
                        message: "Added to likes list.",
                        statusCode: 200,
                    },
                    { status: 200 }
                );
            } else {

                await AccountsModel.updateOne({ _id: merchantId }, { $inc: { likes: -1 } })
                await AccountsModel.updateOne({ userName }, { $pull: { likesList: merchantId } });

                return NextResponse.json(
                    {
                        message: "Removed from likes list.",
                        statusCode: 200,
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