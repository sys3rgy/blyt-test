import AccountsModel from '@/models/AccountsModel';
import PointsHistoryModel from '@/models/PointsHistoryModel';
import PointsPurchasesModel from '@/models/PointsPurchasesModel';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server'
import crypto from 'crypto';

let saltRounds: number;
if (process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS === undefined || process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS.length === 0 || (Number.isNaN(Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS)))) {
    throw new Error("saltRounds is either undefined or not a number")
} else {
    saltRounds = Number(process.env.NEXT_PRIVATE_BCRYPT_SALT_ROUNDS);
}

export async function GET(request: NextRequest) {

    console.clear();

    //* Connecting to MongoDB
    await connect2MongoDB();

    //* Getting referenceCode & transactionNumber from returnAPI
    const searchParams = request.nextUrl.searchParams;
    const referenceCode = searchParams.get('ReferenceCode')
    const transactionNumber = searchParams.get('TransactionNumber')

    console.log(searchParams)

    if (!referenceCode || !transactionNumber) {
        return NextResponse.json(
            {
                message: "ReferenceCode or TransactionNumber is missing",
                statusCode: 400,
            },
            { status: 400 }
        );
    }

    //! Generating Bearer token
    const bearerToken = await generateBearerToken();

    const timestamp = new Date().getTime();

    const signature = generateSHA512Hash(JSON.stringify({ timestamp: timestamp, transactionNumber: transactionNumber }))

    const url = `https://staging-payments.commerce.asia/api/services/app/PaymentGateway/Query?Timestamp=${timestamp}&TransactionNumber=${transactionNumber}`;
    const options = {
        method: 'GET',
        headers: {
            'cap-signature': signature,
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    const paymentStatus = data.result.status;

    if (paymentStatus === 1) {

        const getBuyerId = await PointsPurchasesModel.findOne({ uniqueId: parseInt(referenceCode) }).select('isMoneyAddedToAccount buyerUserName buyerId points amount currency');

        if (getBuyerId.isMoneyAddedToAccount === true) {

            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/`, {
                status: 301
            });
        }

        await new PointsHistoryModel({
            userName: getBuyerId.buyerUserName,
            points: parseInt(getBuyerId.points),
            reason: 'Points purchased'
        }).save();

        await PointsPurchasesModel.updateOne({ uniqueId: parseInt(referenceCode) }, { isPaymentDone: true, isMoneyAddedToAccount: true, $unset: { expireAt: 1 } });

        await AccountsModel.updateOne({ _id: getBuyerId.buyerId }, { $inc: { blytPoints: getBuyerId.points } });

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/purchases/${paymentStatus}`, {
            status: 301
        });
    } else {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/purchases/${paymentStatus}`, {
            status: 301
        });
    }
}

function generateSHA512Hash(dataString: any) {
    const secret = `${process.env.COMMERCE_PAY_SECRET_KEY}`;
    const message = `https://staging-payments.commerce.asia/api/services/app/PaymentGateway/Query${dataString}`.toLowerCase();
    const hash = crypto.createHmac('sha256', secret)
        .update(message)
        .digest('hex');
    return (hash);
}

async function generateBearerToken() {
    const url = 'https://staging-payments.commerce.asia/api/TokenAuth/Authenticate';
    const options = {
        method: 'POST',
        headers: {
            'Abp.TenantId': `${process.env.COMMERCE_PAY_TENANT_ID}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            userNameOrEmailAddress: `${process.env.COMMERCE_PAY_ID}`,
            password: `${process.env.COMMERCE_PAY_PASSWORD}`
        })
    };

    const response = await fetch(url, options);
    const data = await response.json();
    return data.result.accessToken;
}