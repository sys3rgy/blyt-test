import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server'
import AccountsModel from '@/models/AccountsModel';

export async function GET(request: NextRequest) {

    //! Getting username from client-side
    const searchParams = request.nextUrl.searchParams
    const userName = searchParams.get('userName')
    var merchantCompanyName = searchParams.get('merchantCompanyName')
    const buyerName = searchParams.get('userNameCookie');

    if (!userName || !merchantCompanyName) {
        return NextResponse.json(
            {
                message: "No business found",
                statusCode: 404,
            },
            { status: 200 }
        );
    }

    //! Replacing all - with space 
    merchantCompanyName = merchantCompanyName?.replace(/-/g, ' ');

    //* Connecting to MongoDB
    await connect2MongoDB();

    //! Funding merchant data needed for front-end
    const fetchMerchantData = await AccountsModel.findOne({ userName })
        .select('socialMediaLinks likes funding service _id userFullName userName invitedBy bio isMerchant businessName websiteLink dealsCount profileViews totalOrders packagesList verified activationStatus banned userProfilePic averageRatings totalReviews totalReviewsCount')
        .populate([
            {
                path: 'packagesList',
                select: 'packageName serviceCurrency packagePrice packageDescription packageImages'
            }
        ])

    if (fetchMerchantData && fetchMerchantData.businessName === merchantCompanyName) {

        const isUserLikedIt = await AccountsModel.exists({ userName: buyerName, likesList: fetchMerchantData._id });

        let buyerLikedIt = false;
        if (isUserLikedIt) {
            buyerLikedIt = true;
        }

        const { ...merchantData } = fetchMerchantData.toObject();

        return NextResponse.json(
            {
                message: "Data fetched",
                statusCode: 200,
                merchantData,
                buyerLikedIt
            },
            { status: 200 }
        );
    }

    return NextResponse.json(
        {
            message: "No business found",
            statusCode: 404,
        },
        { status: 200 }
    );
}

export async function POST(request: NextRequest) {

    const data = await request.json();

    return NextResponse.json(
        {
            message: "Just A POST Call In publicMerchantAccountDataFetchAPI.",
            statusCode: 200,
        },
        { status: 200 }
    );
}