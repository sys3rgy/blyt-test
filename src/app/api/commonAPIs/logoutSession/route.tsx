import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'
import SessionsModel from '@/models/SessionsModel';
import bcrypt from 'bcrypt';
import { connect2MongoDB } from 'connect2mongodb';
import serverSideSessionCheck from '@/utils/serverSideSessionCheck';

export async function GET(request: Request) {

    const isSessionExist = await serverSideSessionCheck();
    if (!isSessionExist) {
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

    //! Verifying if correct user trying to logout his session
    const checkIsCorrectUserTryingToLogout = await SessionsModel.findById(isSessionExist.sessionIdCookie).select('userAgent');

    //! If no session found in db, then, just delete the cookies
    if (!checkIsCorrectUserTryingToLogout) {

        const cookieStore = cookies()
        cookieStore.delete('userName');
        cookieStore.delete('token');
        cookieStore.delete('isLogin');
        cookieStore.delete('sessionId');

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

    //! If same detele session & cookies

    if (await bcrypt.compare(userAgent as string, checkIsCorrectUserTryingToLogout.userAgent)) {

        await SessionsModel.deleteOne({ _id: isSessionExist.sessionIdCookie });

        const cookieStore = cookies()
        cookieStore.delete('userName');
        cookieStore.delete('token');
        cookieStore.delete('isLogin');
        cookieStore.delete('sessionId');

        return NextResponse.json(
            {
                message: "Session exist",
                statusCode: 202,
            },
            { status: 200 }
        );
        //! Else no session exist
    } else {
        return NextResponse.json(
            {
                message: "No session found",
                statusCode: 404,
            },
            { status: 200 }
        );
    }
}

export async function POST(request: Request) {
    return NextResponse.json({ message: "Just A POST call in logoutSession.tsx", statusCode: 404, }, { status: 200 });
}