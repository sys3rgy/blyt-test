import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

//! Fethcing  & verifying environment variables
import jwt from 'jsonwebtoken';
import SessionsModel from '@/models/SessionsModel';
import serverSideSessionCheck from '@/utils/serverSideSessionCheck';
import { connect2MongoDB } from 'connect2mongodb';
let jwtTokenValue: string;
if (!process.env.NEXT_PRIVATE_JWT_TOKEN_VALUE) {
    throw new Error(`NEXT_PRIVATE_JWT_TOKEN_VALUE is undefined.`);
} else {
    jwtTokenValue = process.env.NEXT_PRIVATE_JWT_TOKEN_VALUE;
}

//! interface for JWTTokenData
interface JWTTokenData {
    userName: string;
    userAgent: string;
}

export async function GET(request: Request) {

    //! Getting username from client-side
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

    try {

        //* Connecting to MongoDB
        await connect2MongoDB();

        const findSession = await SessionsModel.findOne({ _id: isSessionExist.sessionIdCookie })

        if (!findSession) {
            return NextResponse.json(
                {
                    message: "No session found",
                    statusCode: 404,
                },
                { status: 200 }
            );
        }

        //! Verifying JWT Token
        const verifyingJWTToken = jwt.verify(isSessionExist.tokenCookie as string, jwtTokenValue)

        if (!verifyingJWTToken) {

            return NextResponse.json(
                {
                    message: "No session found",
                    statusCode: 404,
                },
                { status: 200 }
            );

        }

        //! Else verify details
        const userAgent = request.headers.get('user-agent');

        if (isSessionExist.userNameCookie === findSession.userName && isSessionExist.tokenCookie === findSession.jwtToken && await bcrypt.compare(userAgent as string, findSession.userAgent as string)) {

            return NextResponse.json(

                {
                    message: "Session found",
                    statusCode: 302,
                    findSession
                },
                { status: 200 }
            );

        } else {

            return NextResponse.json(
                {
                    message: "No session found",
                    statusCode: 404,
                },
                { status: 200 }
            );

        }

    } catch {
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
}