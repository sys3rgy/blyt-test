import { NextResponse, NextRequest } from 'next/server';
import { connect2MongoDB } from 'connect2mongodb'
import bcrypt from 'bcrypt';
import serverSideSessionCheck from '@/utils/serverSideSessionCheck';
import SessionsModel from '@/models/SessionsModel';
import ReviewsModel from '@/models/ReviewsModel';
import OrdersListModel from '@/models/OrdersListModel';
import AccountsModel from '@/models/AccountsModel';
import { removeCookies } from '@/utils/removeCookies';

export async function GET(request: NextRequest) {

    //! Getting username from client-side
    const searchParams = request.nextUrl.searchParams
    const userName = searchParams.get('userName');
    const reviewsPage = searchParams.get('reviewsPage');

    const fetchingReviews = await ReviewsModel
        .find({ merchantUserName: userName })
        .skip((parseInt(reviewsPage || '1', 10) - 1) * 5)
        .limit(5)
        .sort({ createdAt: -1 })
        .select('buyerProfilePic merchantUserName merchantBusinessName merchantPackageName rating comment buyerName')

    return NextResponse.json(
        {
            message: "Reviews fetched successfully",
            statusCode: 200,
            fetchingReviews
        },
        { status: 200 }
    );
}

export async function POST(request: NextRequest) {

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

    const { orderId, buyerId, buyerName, buyerProfilePic, merchantId, merchantUserName, merchantBusinessName, merchantPackageName, rating, comment } = await request.json()

    if (!rating || !comment) {
        return NextResponse.json(
            {
                message: "Please fill all the fields.",
                statusCode: 204,
            },
            { status: 200 }
        );
    }

    // Words count length
    // Split the string into words using one or more spaces as the delimiter
    let wordsCount = comment.trim();
    const wordsCountLength = wordsCount.split(/\s+/).length


    if (wordsCountLength < 10) {
        return NextResponse.json(
            {
                message: "Express your review in more than 10 words.",
                statusCode: 204,
            },
            { status: 200 }
        );
    }

    //! Checking session in server before uploading files & updating data
    try {

        //! Checking session via DB
        const findSessionInDB = await SessionsModel.findById(isSessionExist.sessionIdCookie)

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

        //! If session exist, perform functions
        if (buyerName === findSessionInDB.userName && isSessionExist.tokenCookie === findSessionInDB.jwtToken && await bcrypt.compare(userAgent as string, findSessionInDB.userAgent) && isSessionExist.userNameCookie === findSessionInDB.userName) {

            //! Saving review
            const reviewID = await new ReviewsModel({
                buyerId,
                buyerName,
                buyerProfilePic,
                merchantId,
                merchantUserName,
                merchantBusinessName,
                merchantPackageName,
                rating,
                comment
            }).save();

            //~ Marking the order as reviewed
            await OrdersListModel.updateOne({ _id: orderId }, { orderReviewed: true, rating });

            //~ Adding the reviewed order in merchant & buyer DB
            await AccountsModel.updateOne({ userName: buyerName }, { $push: { totalReviews: { $each: [reviewID._id], $position: 0 } } });

            const findTheAverageRating = await AccountsModel.findOne({ userName: merchantUserName }).select('averageRatings totalReviewsCount').lean();

            //! Calculating the new average rating
            const newTotalReviewsCount = findTheAverageRating.totalReviewsCount + 1;
            const newAverageRating = ((findTheAverageRating.averageRatings * findTheAverageRating.totalReviewsCount) + parseInt(rating)) / newTotalReviewsCount;
            const ratingInDecimalValue = newAverageRating.toFixed(2);


            await AccountsModel.updateOne({ userName: merchantUserName },
                {
                    $push: { totalReviews: { $each: [reviewID._id], $position: 0 } },
                    $inc: { totalReviewsCount: 1 },
                    $set: { averageRatings: ratingInDecimalValue }
                });


            return NextResponse.json(
                {
                    message: "Review added successfully.",
                    statusCode: 200,
                },
                { status: 200 }
            );

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