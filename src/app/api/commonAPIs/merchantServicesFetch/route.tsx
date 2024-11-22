import AccountsModel from '@/models/AccountsModel';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {

    //* Connecting to MongoDB
    await connect2MongoDB();

    //! Getting username from client-side
    const searchParams = request.nextUrl.searchParams
    const serachCategory = searchParams.get('category')?.replace(/_/g, ' ').replace(/-/g, '&');

    if (!serachCategory) {
        const servicesList = await AccountsModel.find({
            isMerchant: true,
            activationStatus: true,
            banned: false
        })
            .select({ 'service.serviceImages': { $slice: 1 }, 'service.serviceCategory': 1, 'service.serviceName': 1, 'service.serviceBanner': 1, '_id': 1, 'userName': 1, 'businessName': 1, 'websiteLink': 1, 'averageRatings': 1, 'totalReviewsCount': 1 })
            .lean()
            .limit(20);

        return NextResponse.json(
            {
                message: "Data fetched",
                statusCode: 200,
                servicesList
            },
            { status: 200 }
        );

    } else if (serachCategory) {
        const servicesList = await AccountsModel.find({ "service.serviceCategory": serachCategory, isMerchant: true, activationStatus: true, banned: false })
            .limit(10)
            .select({ 'service.serviceImages': { $slice: 1 }, 'service.serviceCategory': 1, 'service.serviceName': 1, 'service.serviceBanner': 1, '_id': 1, 'userName': 1, 'businessName': 1, 'websiteLink': 1, 'averageRatings': 1, 'totalReviewsCount': 1 })
            .lean();

        return NextResponse.json(
            {
                message: "Services fetched as per category",
                statusCode: 200,
                servicesList
            },
            { status: 200 }
        );

    }
}

export async function POST(request: Request) {
}