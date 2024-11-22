import ServiceCategoriesModel from '@/models/ServiceCategoriesModel';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse } from 'next/server'

export async function GET(request: Request) {

    //* Connecting to MongoDB
    await connect2MongoDB();

    const serviceCategoriesList = await ServiceCategoriesModel.find({}).sort({ category: 1 });

    return NextResponse.json(
        {
            message: 'Categories Fetched',
            serviceCategoriesList,
            statusCode: 200
        },
        { status: 200 }
    )
}

export async function POST(request: Request) {
}