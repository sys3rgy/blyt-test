import SessionsModel from '@/models/SessionsModel';
import serverSideSessionCheck from '@/utils/serverSideSessionCheck';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server'
import bcrypt from 'bcrypt';
import AccountsModel from '@/models/AccountsModel';

export async function POST(request: NextRequest) {

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

    const { userName } = await request.json();

    //! Checking session in server before uploading files & updating data
    try {

        //! Checking session via DB
        const findSessionInDB = await SessionsModel.findById(isSessionExist.sessionIdCookie);

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

        //! If session exist, perform functions
        if (userName === findSessionInDB.userName && isSessionExist.tokenCookie === findSessionInDB.jwtToken && await bcrypt.compare(userAgent as string, findSessionInDB.userAgent) && isSessionExist.userNameCookie === findSessionInDB.userName) {

            await AccountsModel.updateOne({ userName }, { toVerify: true });

            return NextResponse.json(
                {
                    message: "Sent to verify",
                    statusCode: 200,
                },
                { status: 200 }
            );

        } else {

            return NextResponse.json(
                {
                    message: "No session found 3",
                    statusCode: 404,
                },
                { status: 200 }
            );

        }

    } catch (error) {
        console.error(error);
        // removeCookies();
        return NextResponse.json(
            {
                message: "No session found 4",
                statusCode: 404,
            },
            { status: 200 }
        );
    }
}