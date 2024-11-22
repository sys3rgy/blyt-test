import OrdersListModel from '@/models/OrdersListModel';
import SessionsModel from '@/models/SessionsModel';
import serverSideSessionCheck from '@/utils/serverSideSessionCheck';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server'
import bcrypt from 'bcrypt';
import { removeCookies } from '@/utils/removeCookies';

export async function GET(request: NextRequest) {

    //! Getting username from client-side
    const searchParams = request.nextUrl.searchParams
    const userName = searchParams.get('userName')
    let list = searchParams.get('list')?.replace(/_/g, ' ')
    let dealsPages: number = parseInt(searchParams.get('dealsPages') || "0", 10);
    dealsPages++;

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
                    path: 'id'
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
        if (userName && userName === findSessionInDB.userName && isSessionExist.tokenCookie === findSessionInDB.jwtToken && await bcrypt.compare(userAgent as string, findSessionInDB.userAgent) && isSessionExist.userNameCookie === findSessionInDB.userName) {

            if (list === "initiated contact") {

                const findAllInitiatedContactsList = await OrdersListModel.find({ merchantUserName: userName, orderStatus: list })
                    .select('packageDescription buyerId packageId serviceName packageName packageImage serviceCurrency packageAmount orderStatus buyerFullName buyerUserName')
                    .sort({ createdAt: -1 })
                    .skip((dealsPages - 1) * 5)
                    .limit(5)

                const totalDocs = await getTotalDocs(userName, list);

                return NextResponse.json(
                    {
                        message: "Initated Contact list fetched",
                        statusCode: 200,
                        findAllInitiatedContactsList,
                        totalDocs
                    },
                    { status: 200 }
                );

            } else if (list === "work in progress") {

                const findAllWorkInProgressList = await OrdersListModel.find({ merchantUserName: userName, orderStatus: list })
                    .select('packageDescription buyerId packageId serviceName packageName packageImage serviceCurrency packageAmount orderStatus buyerFullName buyerUserName')
                    .sort({ createdAt: -1 })
                    .skip((dealsPages - 1) * 5)
                    .limit(5)

                const totalDocs = await getTotalDocs(userName, list);

                return NextResponse.json(
                    {
                        message: "Work In Progress list fetched",
                        statusCode: 200,
                        findAllWorkInProgressList,
                        totalDocs
                    },
                    { status: 200 }
                );

            } else if (list === "done deals") {

                const findAllDoneDealsList = await OrdersListModel.find({ merchantUserName: userName, orderStatus: list })
                    .select('isPointsSharedToReferred pointsSharedToReferred referredBy merchantId isPointsShared pointsShared packageDescription buyerId packageId serviceName packageName packageImage serviceCurrency packageAmount orderStatus buyerFullName buyerUserName')
                    .sort({ createdAt: -1 })
                    .skip((dealsPages - 1) * 5)
                    .limit(5)


                const totalDocs = await getTotalDocs(userName, list);

                return NextResponse.json(
                    {
                        message: "Done Deals list fetched",
                        statusCode: 200,
                        findAllDoneDealsList,
                        totalDocs
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

async function getTotalDocs(userName: string, list: string) {
    let totalDocs = await OrdersListModel.countDocuments({ merchantUserName: userName, orderStatus: list });
    return totalDocs;
}