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
import { exit } from 'process';


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
    const communityId = searchParams.get('communityId');
    const username = searchParams.get('username');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    let message = '';
    let getCommunity;
    let debug: { error: boolean; error_message: string | null } = { error: false, error_message: null };

    try {
        if (communityId) {
            // Get specific community by ID
            message = "Data retrieved successfully";
            getCommunity = await CommunityModel.findById(communityId)
                            .populate('author')
                            .lean();
            
            if (!getCommunity) {
                return NextResponse.json(
                    { error: 'Community not found' },
                    { status: 404 }
                );
            }

            if (getCommunity) {
                getCommunity.id = getCommunity._id;
                getCommunity.author_id = getCommunity.author._id;
                getCommunity.author_name = getCommunity.author.userFullName;
                delete getCommunity._id;
                delete getCommunity.author;
            }
    

            const comments = await CommunityCommentModel.find({ community_id: communityId, $or: [
                { parent_comment_id: { $exists: false } },
                { parent_comment_id: null }
            ] })
                .populate('author')
                .lean(); 
     
            for (let comment of comments) {
                
                comment.author_id = comment.author._id;
                comment.author_name = comment.author.userFullName;
                comment.id = comment._id;
                delete comment._id;
                delete comment.author;
                comment.replies = await fetchReplies(comment.id);
            }
    
            const commentCount = await CommunityCommentModel.countDocuments({ community_id: communityId });
            const likeCount = await CommunityLikeModel.countDocuments({ community_id: communityId });

            getCommunity.comments = commentCount;
            getCommunity.likes = likeCount;
            getCommunity.replies = comments;

            return NextResponse.json(
                {
                    message: message,
                    data: getCommunity,
                    debug
                },
                { status: 200 }
            );
    
        } else {
            // Get all communities with pagination
            message = "Get All Communities with Pagination";
            // let filters = {};
            const dataUser = await AccountsModel.findOne({ userName: username }).lean();
            interface CommunityFilters {
                author?: string; 
            }
            let filters: CommunityFilters = {};
            if (typeof username !== 'undefined' && username) {
                if (dataUser) {
                    filters.author = dataUser._id;
                } else {
                    filters.author = "672ee0155653bcb714557adc";
                }
            } 

            
            const totalCommunities = await CommunityModel.countDocuments(filters);
            getCommunity = await CommunityModel.find(filters)
                .populate('author') 
                .skip(skip)
                .limit(limit)
                .lean();

            getCommunity = getCommunity.map((doc: {
                author: any;
                author_name: any;
                author_id: any; id: any; _id: any; 
            }) => {
                doc.id = doc._id;
                doc.author_id = doc.author._id;
                doc.author_name = doc.author.userFullName;

                delete doc._id; 
                delete doc.author;

                return doc;
            });
    
            for (let community of getCommunity) {
                const dataComments = await CommunityCommentModel.find({ community_id: community.id, $or: [
                    { parent_comment_id: { $exists: false } },
                    { parent_comment_id: null }
                ] })
                    .populate('author')
                    .lean();

                for (let comment of dataComments) {
                    comment.author_id = comment.author._id;
                    comment.author_name = comment.author.userFullName;
                    comment.id = comment._id;
                    delete comment._id;
                    delete comment.author;
                    comment.replies = await fetchReplies(comment.id);
                }

                const commentCount = await CommunityCommentModel.countDocuments({ community_id: community.id });
                const likeCount = await CommunityLikeModel.countDocuments({ community_id: community.id });

                community.comments = commentCount;
                community.likes = likeCount;
                community.replies = dataComments;
            }
            
            // Include pagination info
            const totalPages = Math.ceil(totalCommunities / limit);
            return NextResponse.json(
                {
                    message: message,
                    data: getCommunity,
                    pagination: {
                        totalCommunities,
                        totalPages,
                        currentPage: page,
                        limit,
                    },
                    debug
                },
                { status: 200 }
            );
        }
    
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


// Helper function to fetch replies recursively
async function fetchReplies(parentCommentId: any) {
    const replies = await CommunityCommentModel.find({ parent_comment_id: parentCommentId })
        .populate('author')
        .lean();

    for (let reply of replies) { 
        reply.id = reply._id;
        reply.author_id = reply.author._id;
        reply.author_name = reply.author.userFullName;
        delete reply.author;
        delete reply._id;
        reply.replies = await fetchReplies(reply.id); // Recursively fetch replies
    }

    return replies;
}


export async function POST(request: NextRequest) {  
    //* Connecting to MongoDB
    await connect2MongoDB();

    try {
        // Parse the JSON body of the request
        const { title, image, description, author, parent_comment_id } = await request.json();

        const dataUser = await AccountsModel.findOne({ userName: author }).lean();
     
        if (!dataUser) {
            return NextResponse.json(
                { error: 'Username not found' },
                { status: 404 }
            );
        }
        
        const newPost = new CommunityModel({ title: title || null, image: image || null, description: description || null, author:dataUser._id, parent_comment_id });
        await newPost.save();

        return NextResponse.json({
            id: newPost._id,
            title: newPost.title,
            image: newPost.image,
            description: newPost.description,
            author_id: newPost.author,
            author_name: dataUser.userFullName,
            createdAt: newPost.createdAt,
            updatedAt: newPost.updatedAt,
            comments: 0,
            likes: 0,
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
        const { title, image, description, author } = await request.json();
        
        const searchParams = request.nextUrl.searchParams;
        const communityId = searchParams.get('communityId');
        
        if (!communityId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        const dataUser = await AccountsModel.findOne({ userName: author }).lean();
     
        if (!dataUser) {
            return NextResponse.json(
                { error: 'Username not found' },
                { status: 404 }
            );
        }

        const updatedPost = await CommunityModel.findByIdAndUpdate(
            communityId,
            { title: title || null, image: image || null, description: description || null, author: dataUser._id },
            { new: true } // This option returns the updated document
        );

        if (!updatedPost) {
            return NextResponse.json({ error: 'Community not found' }, { status: 404 });
        }

        return NextResponse.json({
            id: updatedPost._id,
            title: updatedPost.title,
            image: updatedPost.image,
            description: updatedPost.description,
            author_id: updatedPost.author,
            author_name: dataUser.userFullName,
            createdAt: updatedPost.createdAt,
            updatedAt: updatedPost.updatedAt,
            comments: 0,
            likes: 0,
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