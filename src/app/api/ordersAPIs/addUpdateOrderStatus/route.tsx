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
let saltRounds: number;
if (process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS === undefined || process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS.length === 0 || (Number.isNaN(Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS)))) {
    throw new Error("saltRounds is either undefined or not a number")
} else {
    saltRounds = Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS);
}

export async function GET(request: NextRequest) {

    //* Connecting to MongoDB
    await connect2MongoDB();

    //! Getting username from client-side
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('orderId')

    const getMerchantContactNumber = await OrdersListModel.findById(orderId)
        .populate({
            path: 'merchantId',
        });

    return NextResponse.json(
        {
            message: "Merchant Contact Number",
            statusCode: 302,
            merchantContactNumber: getMerchantContactNumber.merchantId.phoneNumberCountryCode + getMerchantContactNumber.merchantId.phoneNumber
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

    const { merchantUserName, merchantBusinessName, merchantServiceName, merchantId, packgeToInitiate, buyerUserId, userProfilePic, referredBy, method, discountPoints } = await request.json();

    //! Checking session in server before uploading files & updating data
    try {

        //! Checking session via DB
        const findSessionInDB = await SessionsModel.findById(isSessionExist.sessionIdCookie).populate('id');
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
        if (isSessionExist.userNameCookie === findSessionInDB.userName && isSessionExist.tokenCookie === findSessionInDB.jwtToken && await bcrypt.compare(userAgent as string, findSessionInDB.userAgent) && isSessionExist.userNameCookie === findSessionInDB.userName) {

            //! Checking if that package already exist in merchant with status of "initiated contact" or "work in progress"
            const findIfSamePackageIsInTransite = await OrdersListModel.findOne({ merchantId: merchantId, buyerId: buyerUserId, packageId: packgeToInitiate }).select('orderStatus').lean();

            //! If package found with all 3 same data as above, & if their order status is "initiated contact" || "work in progress", then, don't initiate a new package
            if (findIfSamePackageIsInTransite && (findIfSamePackageIsInTransite.orderStatus === "initiated contact" || findIfSamePackageIsInTransite.orderStatus === "work in progress")) {
                return NextResponse.json(
                    {
                        message: 'Order already exist for the package',
                        statusCode: 302
                    },
                    { status: 200 }
                )
            }

            //! Find Packge Name, & First Image
            const findPackageAmoutAndFirstImage = await MerchantPackagesListModel.findById(packgeToInitiate)

            //! Checking if buyer have that much credits for discount or not
            const findBuyerCredits = await AccountsModel.findById(buyerUserId).select('blytPoints').lean();
            if (findBuyerCredits.blytPoints < parseInt(discountPoints)) {
                return NextResponse.json({ message: 'Not enough credits.', statusCode: 302 }, { status: 200 })
            }

            //! Checking if user entered more discount amount than the package price
            if (findPackageAmoutAndFirstImage.packagePrice < parseInt(discountPoints)) {
                return NextResponse.json({ message: 'Enter Discount Points less than the package price', statusCode: 302 }, { status: 200 })
            }

            //! If above condition false, then, initiate contact
            const orderId = await new OrdersListModel({
                buyerId: buyerUserId,
                buyerFullName: findSessionInDB.id.userFullName,
                buyerUserName: findSessionInDB.userName,
                buyerProfilePic: findSessionInDB.id.userProfilePic,
                merchantId: merchantId,
                merchantUserName: merchantUserName,
                userProfilePic,
                merchantBusinessName,
                serviceName: merchantServiceName,
                packageName: findPackageAmoutAndFirstImage.packageName,
                packageDescription: findPackageAmoutAndFirstImage.packageDescription,
                packageImage: findPackageAmoutAndFirstImage.packageImages[0],
                serviceCurrency: findPackageAmoutAndFirstImage.serviceCurrency,
                packageAmount: findPackageAmoutAndFirstImage.packagePrice,
                packageId: packgeToInitiate,
                orderStatus: "initiated contact",
                referredBy: referredBy || "",
                isPointsSharedToReferred: referredBy ? false : true,
                discountPoints
            }).save();

            //! Deduct Points from buyer
            await AccountsModel.updateOne({ _id: buyerUserId }, { $inc: { blytPoints: -discountPoints } });

            //! Update order id in merchant, & client document
            const fetchMerhcantEmailID = await AccountsModel.findOneAndUpdate({ _id: merchantId }, { $push: { allOrdersList: { $each: [orderId._id], $position: 0 } } }).select('userEmail').lean();
            await AccountsModel.updateOne({ _id: buyerUserId }, { $push: { allOrdersList: { $each: [orderId._id], $position: 0 } } });

            //! When contact initiated, then, send email to merchant 
            const otpStatus = await sendOTPToUser('', fetchMerhcantEmailID.userEmail, '', 'initiatedContact', '', '', findSessionInDB.userName, merchantUserName);

            if (referredBy) {
                const findReferredEmailID = await AccountsModel.findOne({ userName: referredBy }).select('userEmail').lean();
                const otpStatus = await sendOTPToUser('', findReferredEmailID.userEmail, '', 'referredBy', '', '', findSessionInDB.userName, referredBy, '');
            }

            return NextResponse.json(
                {
                    message: 'Order Initiated successfully',
                    statusCode: 200
                },
                { status: 200 }
            )

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
        console.error("Error in addUpdateOrderStatus.");
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

export async function PUT(request: NextRequest) {

    const { orderId, status } = await request.json();

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

    //! Checking session in server before uploading files & updating data
    try {

        //! Checking session via DB
        const findSessionInDB = await SessionsModel.findById(isSessionExist.sessionIdCookie);
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

        //! If session exist, check if it's the merchant or not
        if (isSessionExist.userNameCookie === findSessionInDB.userName && isSessionExist.tokenCookie === findSessionInDB.jwtToken && await bcrypt.compare(userAgent as string, findSessionInDB.userAgent) && isSessionExist.userNameCookie === findSessionInDB.userName) {

            //! Check if it's the geniune merchant tying to update the status or not
            const checkIsCorrectMerchant = await AccountsModel.findById(findSessionInDB.id);

            //! If merchant trying to mark deal as done deals, then, send OTP to buyer to verify it
            if (status === 'done deals') {

                const findOrderDetails = await OrdersListModel.findById(orderId)

                const getBuyerEmail = await AccountsModel.findOne({ userName: findOrderDetails.buyerUserName }).select("userName userEmail isMerchant").lean();

                //* Generate OTP
                const OTP = await randomStringGenerator(6);

                //! Hashing the OTP
                const hashOTP = await bcrypt.hash(OTP, saltRounds);

                const otpStatus = await sendOTPToUser(getBuyerEmail.userName, getBuyerEmail.userEmail, OTP, 'doneDeals');

                const checkOTPExistAlready = await OTPModel.exists({ userName: findOrderDetails.buyerUserName });

                //! Checking if OTP Exist In DB Or Not
                if (!checkOTPExistAlready) {

                    //* Save OTP To DB
                    await new OTPModel({
                        userName: findOrderDetails.buyerUserName,
                        OTP: hashOTP,
                        isMerchant: getBuyerEmail.isMerchant
                    }).save();

                } else if (checkOTPExistAlready) {

                    await OTPModel.updateOne({ userName: findOrderDetails.buyerUserName }, { OTP: hashOTP, });

                }

                return NextResponse.json(
                    {
                        message: "OTP sent to buyer",
                        statusCode: 402,
                    },
                    { status: 200 }
                );

                //! Else update status as per the service
            } else if (status !== 'done deals') {

                if (checkIsCorrectMerchant.isMerchant && checkIsCorrectMerchant.allOrdersList.includes(orderId)) {

                    const getBuyerUserName = await OrdersListModel.findOneAndUpdate({ _id: orderId }, { orderStatus: status }).select('buyerUserName').lean();

                    const getBuyerEmailAndUserName = await AccountsModel.findOne({ userName: getBuyerUserName.buyerUserName }).select('userEmail').lean();

                    //! When order status updated, then, send email to the buyer 
                    if (status === 'work in progress') {
                        await sendOTPToUser('', getBuyerEmailAndUserName.userEmail, '', 'workInProgress', '', '', getBuyerUserName.buyerUserName, findSessionInDB.userName);
                    }

                    return NextResponse.json(
                        {
                            message: 'Order updated successfully.',
                            statusCode: 200
                        },
                        { status: 200 }
                    )

                } else {

                    return NextResponse.json(
                        {
                            message: 'Order not found.',
                            statusCode: 200
                        },
                        { status: 200 }
                    )

                }
            }
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

export async function PATCH(request: NextRequest) {

    const { merchantUserName, buyerUserName, orderId, status, OTP } = await request.json();

    //! Checking if all cookies exist
    const isSessionExist = await serverSideSessionCheck();
    if (!isSessionExist) {
        // removeCookies();
        return NextResponse.json(
            {
                message: "No session found 1",
                statusCode: 404,
            },
            { status: 200 }
        );
    }


    //* Connecting to MongoDB
    await connect2MongoDB();

    //! Checking session in server before uploading files & updating data
    try {

        //! Checking session via DB
        const findSessionInDB = await SessionsModel.findById(isSessionExist.sessionIdCookie);
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

        //! If session exist, check if it's the merchant or not
        if (isSessionExist.userNameCookie === findSessionInDB.userName && isSessionExist.tokenCookie === findSessionInDB.jwtToken && await bcrypt.compare(userAgent as string, findSessionInDB.userAgent) && isSessionExist.userNameCookie === findSessionInDB.userName) {

            const findUserToVerify = await OTPModel.findOne({ userName: buyerUserName }).lean();
            if (await bcrypt.compare(OTP as string, findUserToVerify.OTP)) {

                await OTPModel.deleteOne({ userName: buyerUserName });
                const checkIsReferredBy = await OrdersListModel.findOneAndUpdate({ _id: orderId }, { orderStatus: status }).select('referredBy').lean();
                await AccountsModel.updateOne({ userName: merchantUserName }, { $inc: { dealsCount: 1 } });

                const fetchBuyerEmail = await AccountsModel.findOne({ userName: buyerUserName }).select('userEmail').lean();

                //! Send deal completed email to the buyer
                const otpStatus = await sendOTPToUser('', fetchBuyerEmail.userEmail, '', 'dealCompleted', '', '', buyerUserName, merchantUserName);

                if (checkIsReferredBy.referredBy) {
                    const findReferredEmailID = await AccountsModel.findOne({ userName: checkIsReferredBy.referredBy }).select('userEmail').lean();
                    const otpStatus = await sendOTPToUser('', findReferredEmailID.userEmail, '', 'referredCompleted', '', '', checkIsReferredBy.referredBy, '', '');
                }

                return NextResponse.json(
                    {
                        message: "Deal completed successfully",
                        statusCode: 202,
                    },
                    { status: 200 }
                );

            } else {

                return NextResponse.json(
                    {
                        message: "Wrong OTP",
                        statusCode: 401,
                    },
                    { status: 200 }
                );

            }

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
                message: "No session found 4",
                statusCode: 404,
            },
            { status: 200 }
        );
    }
}

export async function DELETE(request: NextRequest) {

    //* Connecting to MongoDB
    await connect2MongoDB();

    const { itemId } = await request.json();

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

    //! Checking session in server before uploading files & updating data
    try {

        //! Checking session via DB
        const findSessionInDB = await SessionsModel.findById(isSessionExist.sessionIdCookie);
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
        if (isSessionExist.userNameCookie === findSessionInDB.userName && isSessionExist.tokenCookie === findSessionInDB.jwtToken && await bcrypt.compare(userAgent as string, findSessionInDB.userAgent) && isSessionExist.userNameCookie === findSessionInDB.userName) {

            //! Deleting the order
            const getData = await OrdersListModel.findOne({ _id: itemId }).select('orderStatus merchantId buyerId discountPoints').lean();

            if (getData.orderStatus === "initiated contact") {

                const findMerchantEmailIDAndPassword = await AccountsModel.findOneAndUpdate({ _id: getData.merchantId }, { $pull: { allOrdersList: itemId } }).select('userName userEmail').lean();
                await AccountsModel.updateOne({ _id: getData.buyerId }, { $pull: { allOrdersList: itemId } });
                await OrdersListModel.deleteOne({ _id: itemId });

                //! If buyer cancels the order, then, give them their points back
                await AccountsModel.updateOne({ _id: getData.buyerId }, { $inc: { blytPoints: +getData.discountPoints } });

                //! Send email to merchant when order has been cancelled
                await sendOTPToUser('', findMerchantEmailIDAndPassword.userEmail, '', 'orderCancel', '', '', '', findMerchantEmailIDAndPassword.userName, itemId);

                return NextResponse.json(
                    {
                        message: 'Order Deleted successfully',
                        statusCode: 200
                    },
                    { status: 200 }
                )

            } else {

                return NextResponse.json(
                    {
                        message: 'Sorry order is already inititated',
                        statusCode: 200
                    },
                    { status: 200 }
                )
            }

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