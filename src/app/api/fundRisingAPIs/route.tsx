  
import AccountsModel from '@/models/AccountsModel';
import FundRisingModel from '@/models/FundRisingModel';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server'  


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
    const fundRisingId = searchParams.get('fundRisingId');
    const username = searchParams.get('username');
    let message = '';
    let fundRising;
    let debug: { error: boolean; error_message: string | null } = { error: false, error_message: null };
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    try {
        if (fundRisingId) {
            message = "Data retrieved successfully";
            fundRising = await FundRisingModel.findById(fundRisingId)
            .populate('author')
            .lean();

            if (fundRising) {
                fundRising.id = fundRising._id;
                fundRising.author_id = fundRising.author._id;
                fundRising.author_name = fundRising.author.userFullName;
                delete fundRising._id;
                delete fundRising.author;
            }
    
    
            if (!fundRising) {
                return NextResponse.json(
                    { error: 'Fund Rising not found' },
                    { status: 404 }
                );
            } 
    
            return NextResponse.json(
                {
                    message: message,
                    data: fundRising,
                    debug
                },
                { status: 200 }
            );
        } else {
            message = "Data retrieved successfully";
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

            const totalEventManagement = await FundRisingModel.countDocuments();
            fundRising = await FundRisingModel.find()
            .populate('author')
            .skip(skip)
            .limit(limit)
            .lean();


            fundRising = fundRising.map((event: {
                author: any;
                author_name: any;
                author_id: any; id: any; _id: any; 
            }) => {
                event.id = event._id;
                event.author_id = event.author._id;
                event.author_name = event.author.userFullName;
                
                delete event._id; 
                delete event.author;

                return event;
            });
            
    
            const totalPages = Math.ceil(totalEventManagement / limit);
                return NextResponse.json(
                    {
                        message: message,
                        data: fundRising,
                        pagination: {
                            totalEventManagement,
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

export async function POST(request: NextRequest) {  
    //* Connecting to MongoDB
    await connect2MongoDB();

    try {
        // Parse the JSON body of the request
        const { title, image, description, author } = await request.json();

        const dataUser = await AccountsModel.findOne({ userName: author }).lean();
        if (!dataUser) {
            return NextResponse.json(
                { error: 'Username not found' },
                { status: 404 }
            );
        }
        const newPost = new FundRisingModel({ title, image, description, author: dataUser._id });
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
        const { title, image, description, author } = await request.json();
        
        const searchParams = request.nextUrl.searchParams;
        const fundRisingId = searchParams.get('fundRisingId');
        
        if (!fundRisingId) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        const dataUser = await AccountsModel.findOne({ userName: author }).lean();
        if (!dataUser) {
            return NextResponse.json(
                { error: 'Username not found' },
                { status: 404 }
            );
        }

        const updatedPost = await FundRisingModel.findByIdAndUpdate(
            fundRisingId,
            { title, image, description, author: dataUser._id },
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
        const fundRisingId = searchParams.get('fundRisingId');
        
        if (!fundRisingId) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        const deletedEvent = await FundRisingModel.findByIdAndDelete(fundRisingId);

        if (!deletedEvent) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json(
            { message: 'Event deleted successfully', data: deletedEvent },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } 
}