import MerchantDealsListModel from '@/models/MerchantDealsListModel';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {

    //! Getting username from client-side
    const searchParams = request.nextUrl.searchParams;
    const sessionExist = searchParams.get('sessionExist');

    //* Connecting to MongoDB
    await connect2MongoDB();

    var dealsList = [];

    if (sessionExist === "true") {
        dealsList = await MerchantDealsListModel.find().lean();
    } else {
        dealsList = await MerchantDealsListModel.find().select('-couponCode').lean();
    }

    return NextResponse.json(
        {
            message: "VVIP Deals Fetched.",
            statusCode: 200,
            dealsList
        },
        { status: 200 }
    );
}

export async function POST(request: NextRequest) {

    const data = await request.json();

    return NextResponse.json(
        {
            message: "Just A POST Call In vvipDealsFetchAPI.",
            statusCode: 200,
        },
        { status: 200 }
    );
}