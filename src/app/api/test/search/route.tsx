import AccountsModel from '@/models/AccountsModel';
import SuggestionsModel from '@/models/SuggestionsModel';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {

    await connect2MongoDB();

    const updateData = await AccountsModel.find({ isMerchant: true })
        .select('userName  businessName service.serviceCategory service.serviceName');

    for (let i = 0; i < updateData.length; i++) {
        await new SuggestionsModel({
            userName: updateData[i].userName,
            businessName: updateData[i].businessName,
            serviceCategory: updateData[i].service.serviceCategory,
            serviceName: updateData[i].service.serviceName,
        }).save();
    }

    return NextResponse.json(
        {
            message: "OK",
            statusCode: 200,
        },
        { status: 200 }
    );
}

export async function POST(request: NextRequest) {

    await connect2MongoDB();

    const { searchTerm } = await request.json();

    // const updateData = await AccountsModel.find({ isMerchant: true })
    //     .select('userName  businessName service.serviceCategory service.serviceName');

    // for (let i = 0; i < updateData.length; i++) {
    //     await new SuggestionsModel({
    //         userName: updateData[i].userName,
    //         businessName: updateData[i].businessName,
    //         serviceCategory: updateData[i].service.serviceCategory,
    //         serviceName: updateData[i].service.serviceName,
    //     }).save();
    // }

    const searchTermsArray = searchTerm.split(' ').filter(Boolean); // Split the search term into an array of words and remove any empty strings

    const regexArray = searchTermsArray.map((term: string | RegExp) => new RegExp(term, 'i'));

    const result = await SuggestionsModel.find({
        $or: [
            { userName: { $in: regexArray } },
            { businessName: { $in: regexArray } },
            { serviceName: { $in: regexArray } },
            { serviceCategory: { $in: regexArray } },
        ]
    })
        .select('userName businessName serviceName')
        .limit(10)
        .lean();

    // const result = await SuggestionsModel.find(
    //     { $text: { $search: searchTerm } },
    //     { score: { $meta: 'textScore' } }
    // )
    //     .select('userName businessName serviceName score')
    //     .sort({ score: { $meta: 'textScore' } })
    //     .limit(10)
    //     .lean();

    return NextResponse.json(
        {
            message: "OK",
            statusCode: 200,
            result
        },
        { status: 200 }
    );


}