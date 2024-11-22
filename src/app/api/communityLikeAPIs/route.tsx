import SessionsModel from '@/models/SessionsModel';
import serverSideSessionCheck from '@/utils/serverSideSessionCheck';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server'
import OrdersListModel from '@/models/OrdersListModel';
import AccountsModel from '@/models/AccountsModel';
import MerchantPackagesListModel from '@/models/MerchantPackagesListModel';
import sendOTPToUser from '@/utils/email/sendOTPToUser';
import randomStringGenerator from '@/utils/randomStringGenerator';
import bcrypt from 'bcrypt';
import OTPModel from '@/models/OTPModel';
import { removeCookies } from '@/utils/removeCookies';
import CommunityModel from '@/models/CommunityModel';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import CommunityCommentModel from '@/models/CommunityCommentModel';
import CommunityLikeModel from '@/models/CommunityLikeModel';


let saltRounds: number;
if (process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS === undefined || process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS.length === 0 || (Number.isNaN(Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS)))) {
    throw new Error("saltRounds is either undefined or not a number")
} else {
    saltRounds = Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS);
}


export async function GET(request: NextRequest) {
    //* Connect to MongoDB
    await connect2MongoDB();

    const searchParams = request.nextUrl.searchParams; 
    let message = '';
    let getCommunity;
    let debug: { error: boolean; error_message: string | null } = { error: false, error_message: null };

    try {
        message = "Get All Like";
            getCommunity = await CommunityLikeModel.find().lean();
    
        return NextResponse.json(
            {
                message: message,
                data: getCommunity,
                debug
            },
            { status: 200 }
        );
    } catch (errors) {
        debug = { 
        error: true, 
        error_message: errors instanceof Error ? errors.message : String(errors)
    };

    return NextResponse.json(
            {
                error: 'An unexpected error occurred',
                debug
            },
            { status: 500 }
        );
    }

    
}
 


export async function POST(request: NextRequest) {  
    await connect2MongoDB();

    try {
        const { community_id, author } = await request.json();

        const dataUser = await AccountsModel.findOne({ userName: author }).lean();
     console.log(dataUser);
        if (!dataUser) {
            return NextResponse.json(
                { error: 'Username not found' },
                { status: 404 }
            );
        }

        const deletedLike = await CommunityLikeModel.findOneAndDelete({ community_id, author: dataUser._id }).lean();

        if (deletedLike) {
            return NextResponse.json({ message: 'Like removed successfully', data: deletedLike }, { status: 200 });
        } else {
            const newLike = new CommunityLikeModel({ community_id, author: dataUser._id });
            await newLike.save();

            return NextResponse.json({ message: 'New like added', data: newLike }, { status: 201 });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } 
}