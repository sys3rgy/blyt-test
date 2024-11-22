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


let saltRounds: number;
if (process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS === undefined || process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS.length === 0 || (Number.isNaN(Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS)))) {
    throw new Error("saltRounds is either undefined or not a number")
} else {
    saltRounds = Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS);
}


export async function GET(request: NextRequest) {
    //* Connecting to MongoDB
    await connect2MongoDB();

    const searchParams = request.nextUrl.searchParams;
    const communityId = searchParams.get('communityId');
    let message = '';
    let getCommunity;

    if (communityId) {
        message = "Get Detail Community";
        getCommunity = await CommunityModel.findById(communityId).populate({
            path: '_id',  
        });

        if (!getCommunity) {
            return NextResponse.json(
                { error: 'Community not found' },
                { status: 404 }
            );
        }
    } else {
        message = "Get All Community";
        getCommunity = await CommunityModel.find();
    }

    return NextResponse.json(
        {
            message: message,
            data: getCommunity
        },
        { status: 200 }
    );
}

export async function POST(request: NextRequest) {  
    //* Connecting to MongoDB
    await connect2MongoDB();

    try {
        // Parse the JSON body of the request
        const { postTitle, coverImage, description, merchantId } = await request.json();

        const newPost = new CommunityModel({ postTitle, coverImage, description, merchantId });
        await newPost.save();

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } 
}

export async function PUT(request: NextRequest) {  
    //* Connecting to MongoDB
    await connect2MongoDB();

    try {
        const { postTitle, coverImage, description, merchantId } = await request.json();
        
        const searchParams = request.nextUrl.searchParams;
        const communityId = searchParams.get('communityId');
        
        if (!communityId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        const updatedPost = await CommunityModel.findByIdAndUpdate(
            communityId,
            { postTitle, coverImage, description, merchantId },
            { new: true } // This option returns the updated document
        );

        if (!updatedPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } 
}
 
export async function DELETE(request: NextRequest) {  
    //* Connecting to MongoDB
    await connect2MongoDB();

    try {
        const searchParams = request.nextUrl.searchParams;
        const communityId = searchParams.get('communityId');
        
        if (!communityId) {
            return NextResponse.json({ error: 'Community ID is required' }, { status: 400 });
        }

        const deletedCommunity = await CommunityModel.findByIdAndDelete(communityId);

        if (!deletedCommunity) {
            return NextResponse.json({ error: 'Community not found' }, { status: 404 });
        }

        return NextResponse.json(
            { message: 'Community deleted successfully', data: deletedCommunity },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } 
}