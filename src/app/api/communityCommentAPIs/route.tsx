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
    const commentId = searchParams.get('commentId');
    let message = '';
    let getComment;

    if (commentId) {
        message = "Get Detail Comment";
        getComment = await CommunityCommentModel.findById(commentId).populate({
            path: '_id',  
        });

        if (!getComment) {
            return NextResponse.json(
                { error: 'Comment not found' },
                { status: 404 }
            );
        }
    } else {
        message = "Get All Comment";
        getComment = await CommunityCommentModel.find();
    }

    return NextResponse.json(
        {
            message: message,
            data: getComment
        },
        { status: 200 }
    );
}

export async function POST(request: NextRequest) {  
    //* Connecting to MongoDB
    await connect2MongoDB();

    try {
        // Parse the JSON body of the request
        const { community_id, author, text, avatar, parent_comment_id } = await request.json();

        const dataUser = await AccountsModel.findOne({ userName: author }).lean();
     
        if (!dataUser) {
            return NextResponse.json(
                { error: 'Username not found' },
                { status: 404 }
            );
        }

        const newPost = new CommunityCommentModel({ community_id, author: dataUser._id, text, avatar, parent_comment_id });
        await newPost.save(); 

        return NextResponse.json({
            community_id: newPost.community_id,
            text: newPost.text,
            avatar: newPost.avatar,
            parent_comment_id: newPost.parent_comment_id,
            createdAt: newPost.createdAt,
            updatedAt: newPost.updatedAt,
            author_id: newPost.author,
            author_name: dataUser.userFullName,
            id: newPost.id,
            replies: []
        }, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } 
}

export async function PUT(request: NextRequest) {  
    //* Connecting to MongoDB
    await connect2MongoDB();

    try {
        const { community_id, author, text, avatar } = await request.json();
        
        const searchParams = request.nextUrl.searchParams;
        const communityId = searchParams.get('commentId');
        
        if (!communityId) {
            return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
        }

        const dataUser = await AccountsModel.findOne({ userName: author }).lean();
     
        if (!dataUser) {
            return NextResponse.json(
                { error: 'Username not found' },
                { status: 404 }
            );
        }
        const updatedPost = await CommunityCommentModel.findByIdAndUpdate(
            communityId,
            { community_id, author: dataUser._id, text, avatar },
            { new: true } // This option returns the updated document
        );

        if (!updatedPost) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }

        return NextResponse.json({
            community_id: updatedPost.community_id,
            text: updatedPost.text,
            avatar: updatedPost.avatar,
            parent_comment_id: updatedPost.parent_comment_id,
            createdAt: updatedPost.createdAt,
            updatedAt: updatedPost.updatedAt,
            author_id: updatedPost.author,
            author_name: dataUser.userFullName,
            id: updatedPost.id,
            replies: []
        }, { status: 200 });
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
        const communityId = searchParams.get('commentId');
        
        if (!communityId) {
            return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
        }

        const deletedCommunity = await CommunityCommentModel.findByIdAndDelete(communityId);

        if (!deletedCommunity) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }

        return NextResponse.json(
            { message: 'Comment deleted successfully', data: deletedCommunity },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } 
}