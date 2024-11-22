import PointsPriceModel from '@/models/PointsPriceModel';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    //* Connecting to MongoDB
    await connect2MongoDB();

    const pointsPriceList = await PointsPriceModel.find({})

    return NextResponse.json(
        {
            message: "Points prices fetched successfully.",
            statusCode: 200,
            pointsPriceList
        },
        { status: 200 }
    );
}

export async function POST(request: Request) {
}