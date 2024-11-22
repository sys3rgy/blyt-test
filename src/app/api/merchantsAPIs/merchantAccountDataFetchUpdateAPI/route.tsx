import SessionsModel from '@/models/SessionsModel';
import serverSideSessionCheck from '@/utils/serverSideSessionCheck';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server'
import bcrypt from 'bcrypt';
import { PDFDocument } from 'pdf-lib';

//* AWS Settings 
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { File } from 'buffer';
import AccountsModel from '@/models/AccountsModel';
import moment from 'moment';
import sharp from 'sharp';
import MerchantPackagesListModel from '@/models/MerchantPackagesListModel';
import OrdersListModel from '@/models/OrdersListModel';
import MerchantDealsListModel from '@/models/MerchantDealsListModel';
import { s3Client, uploadBlobToS3 } from '@/utils/AWSBlobUploadSettings';
import SuggestionsModel from '@/models/SuggestionsModel';
import { removeCookies } from '@/utils/removeCookies';

const bucketName = process.env.NEXT_PUBLIC_BUCKET || "";

export async function GET(request: NextRequest) {

    //! Getting username from client-side
    const searchParams = request.nextUrl.searchParams
    const userName = searchParams.get('userName')
    const packageId = searchParams.get('packageId')

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

    try {

        //! Checking session via DB
        const findSessionInDB = await SessionsModel.findById(isSessionExist.sessionIdCookie)
            .populate([
                {
                    path: 'id',
                    select: 'allOrdersList socialMediaLinks likes funding invitedBy service userFullName userEmail userName inviteCode totalReferrals bio phoneNumberCountryCode phoneNumber blytPoints isMerchant businessName websiteLink dealsCount profileViews totalOrders totalEarnings totalReviewsCount averageRatings packagesList verified activationStatus banned userProfilePic businessAddress businessCity businessLocation businessPincode businessState dealsList toVerify',
                    populate: [
                        {
                            path: 'packagesList',
                            options: { limit: 5 },
                            select: 'packageName serviceCurrency packagePrice packageDescription packageImages packageCategory'
                        },
                        {
                            path: 'allOrdersList',
                            options: { limit: 1, sort: { 'createdAt': -1 } },
                        },
                        {
                            path: 'dealsList',
                        }
                    ],
                },
            ]);

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

        //! If session exist, verify details

        if (userName === findSessionInDB.userName && isSessionExist.tokenCookie === findSessionInDB.jwtToken && await bcrypt.compare(userAgent as string, findSessionInDB.userAgent) && isSessionExist.userNameCookie === findSessionInDB.userName) {
            if (packageId) {

                const fetchPackageData = await MerchantPackagesListModel.findById(packageId)
                    .populate([
                        {
                            path: 'merchantId',
                            select: 'service userName'
                        },
                    ]);

                if (fetchPackageData.merchantId.userName === userName) {

                    return NextResponse.json(
                        {
                            message: "Package exist",
                            statusCode: 202,
                            fetchPackageData,
                            isMerchant: findSessionInDB.isMerchant
                        },
                        { status: 200 }
                    );

                } else {

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

            const { ...merchantData } = findSessionInDB.toObject();

            return NextResponse.json(
                {
                    message: "Session exist",
                    statusCode: 202,
                    merchantData: merchantData.id
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
        // console.error(error);
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

    const data = await request.formData()

    const fullName = data.get("fullName");

    const merchantId = data.get("merchantId");

    let businessName = data.get("businessName");
    const newBusinessName = data.get("newBusinessName");
    if (newBusinessName) {
        businessName = newBusinessName;
    }

    const isPersonalInformation = data.get("isPersonalInformation");
    const location = data.get("location");
    const bio = data.get("bio");

    const instagramLink = data.get("instagramLink");
    const twitterLink = data.get("twitterLink");
    const linkedinLink = data.get("linkedinLink");
    const facebookLink = data.get("facebookLink");

    const phoneNumberCountryCode = data.get("phoneNumberCountryCode");
    const phoneNumber = data.get("phoneNumber");
    const userName = data.get("userName");
    const address = data.get("address");
    const city = data.get("city");
    const state = data.get("state");
    const pincode = data.get("pincode");

    const isServiceInformation = data.get("isServiceInformation");
    const serviceCategory = data.get("serviceCategory");
    const serviceName = data.get("serviceName");
    const serviceDescription = data.get("serviceDescription");
    const serviceImages = data.getAll("serviceImages");
    const serviceCurrency = data.getAll("currency");
    let serviceVideo = data.get("serviceVideo");
    let serviceDeck = data.get("serviceDeck");

    const isFundingInformation = data.get("isFundingInformation");
    const fundingStage = data.get("fundingStage");
    const fundingCurrency = data.get("fundingCurrency");
    const fundingAmount = data.get("fundingAmount");
    const fundingDescription = data.get("fundingDescription");
    const fundingPDF = data.get("fundingPDF");

    const isVVIPDeals = data.get("isVVIPDeals");
    const discountValue = data.get("discountValue");
    const couponCode = data.get("couponCode");
    const couponDescription = data.get("couponDescription");
    const stepsToRedeem = data.get("stepsToRedeem");
    let dealPicture = data.get("dealPicture");
    const dealPictureBlob = dealPicture as object | File | string | null;

    //! Converting price range from string to number
    let minPriceFormData = data.get("minPrice");
    let minPrice: number | null = minPriceFormData !== null ? parseInt(minPriceFormData as string, 10) : null;
    let maxPriceFormData = data.get("maxPrice");
    let maxPrice: number | null = maxPriceFormData !== null ? parseInt(maxPriceFormData as string, 10) : null;

    //! Checking session in server before uploading files & updating data
    try {

        //! Checking session via DB
        const findSessionInDB = await SessionsModel.findById(isSessionExist.sessionIdCookie).populate('id');

        //! If session not exist
        if (!findSessionInDB) {
            // removeCookies();
            return NextResponse.json(
                {
                    message: "No session found 1",
                    statusCode: 404,
                },
                { status: 200 }
            );
        }

        //! Comparing userAgent data
        const userAgent = request.headers.get('user-agent');

        //! If session exist, perform functions
        if (userName === findSessionInDB.userName && isSessionExist.tokenCookie === findSessionInDB.jwtToken && await bcrypt.compare(userAgent as string, findSessionInDB.userAgent) && isSessionExist.userNameCookie === findSessionInDB.userName) {

            //~ Uploading serviceImages To AWS & getting AWS link in return
            var uploadedImageUrls: string[] = [];
            const imagesBlob = serviceImages as object | File | string | null;
            if (imagesBlob && Array.isArray(imagesBlob)) {
                for (let i = 0; i < imagesBlob.length; i++) {
                    if (typeof imagesBlob[i] !== 'object' && imagesBlob[i].includes(`https://s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com`)) {
                        uploadedImageUrls.push(imagesBlob[i]);
                    } else {
                        const currentTime = moment().format('HH:mm:ss').replace(/:/g, '');
                        const randomNumber = Math.floor(Math.random() * 1000) + 1;
                        const fileExtension = imagesBlob[i].name.slice(-4);

                        const key = `merchantServiceImages/${currentTime}-${isSessionExist.userNameCookie}-${randomNumber}${fileExtension}`;

                        const buffer = Buffer.from(await imagesBlob[i].arrayBuffer());

                        //! Compression image via sharp
                        const compressedBuffer = await sharp(buffer)
                            .jpeg({ quality: 40 })
                            .toBuffer();

                        const imageURL = await uploadBlobToS3(compressedBuffer, key);

                        uploadedImageUrls.push(imageURL);
                    }
                }
            }

            //! It means we are updating personal information
            if (isPersonalInformation) {

                if (newBusinessName) {

                    const findIfBusinessNameExist = await AccountsModel.exists({ businessName })

                    if (!findIfBusinessNameExist) {

                        let websiteLink = `https://www.blyt.world/merchant/${userName}/${businessName}`;
                        websiteLink = websiteLink.replace(/\s+/g, '-')

                        await AccountsModel.updateOne(
                            { userName: isSessionExist.userNameCookie },
                            {
                                userFullName: fullName, businessName, businessLocation: location, bio, businessAddress: address, businessCity: city, businessPincode: pincode, businessState: state, phoneNumberCountryCode, phoneNumber, websiteLink,
                                "socialMediaLinks.instagram": instagramLink, "socialMediaLinks.twitter": twitterLink, "socialMediaLinks.linkedin": linkedinLink, "socialMediaLinks.facebook": facebookLink
                            }
                        );

                        return NextResponse.json(
                            {
                                message: 'Personal Information updated successfully',
                                statusCode: 200
                            },
                            { status: 200 }
                        )

                    } else if (findIfBusinessNameExist) {

                        return NextResponse.json(
                            {
                                message: 'Business name already exist.',
                                statusCode: 409
                            },
                            { status: 200 }
                        )

                    }

                } else {

                    await AccountsModel.updateOne(
                        { userName: isSessionExist.userNameCookie },
                        {
                            userFullName: fullName, businessName, businessLocation: location, bio, businessAddress: address, businessCity: city, businessPincode: pincode, businessState: state, phoneNumberCountryCode, phoneNumber,
                            "socialMediaLinks.instagram": instagramLink, "socialMediaLinks.twitter": twitterLink, "socialMediaLinks.linkedin": linkedinLink, "socialMediaLinks.facebook": facebookLink
                        }
                    );

                    return NextResponse.json(
                        {
                            message: 'Personal Information updated successfully',
                            statusCode: 200
                        },
                        { status: 200 }
                    )
                }
                //! It means we are updating service information
            } else if (isServiceInformation) {

                const videoBlob = serviceVideo as File | string | null;
                if (videoBlob instanceof File) {
                    const currentTime = moment().format('HH:mm:ss').replace(/:/g, '');
                    const randomNumber = Math.floor(Math.random() * 1000) + 1;
                    const fileExtension = videoBlob.name.slice(-4);

                    const key = `merchantServiceVideo/${currentTime}-${isSessionExist.userNameCookie}-${randomNumber}${fileExtension}`;

                    const buffer = Buffer.from(await videoBlob.arrayBuffer());

                    const videoURL = await uploadBlobToS3(buffer, key);

                    serviceVideo = videoURL;
                }

                //~ Uplaoding deckPDF To AWS & getting AWS link in return
                const deckPDFBlob = serviceDeck as File | string | null;
                if (typeof deckPDFBlob === 'object' && deckPDFBlob instanceof File) {
                    // Convert the File to a PDFDocument
                    const existingPdfBytes = await deckPDFBlob.arrayBuffer();
                    const pdfDoc = await PDFDocument.load(existingPdfBytes);

                    //! Compressing the PDF
                    const compressedPdfBytes = await pdfDoc.save();
                    const compressedPdfBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
                    const buffer = Buffer.from(await compressedPdfBlob.arrayBuffer());

                    const currentTime = moment().format('HH:mm:ss').replace(/:/g, '');
                    const randomNumber = Math.floor(Math.random() * 1000) + 1;
                    const fileExtension = deckPDFBlob.name.slice(-4);

                    const key = `merchantServiceDeck/${currentTime}-${isSessionExist.userNameCookie}-${randomNumber}${fileExtension}`;

                    const deckPDFURL = await uploadBlobToS3(buffer, key);

                    serviceDeck = deckPDFURL;
                }

                const updatedData = await AccountsModel.findOneAndUpdate(
                    { userName: isSessionExist.userNameCookie },
                    {
                        "service.serviceCategory": serviceCategory,
                        "service.serviceName": serviceName,
                        "service.serviceDescription": serviceDescription,
                        "service.serviceVideo": serviceVideo,
                        "service.serviceDeck": serviceDeck,
                        "service.serviceCurrency": serviceCurrency[0],
                        "service.serviceMinPrice": minPrice,
                        "service.serviceMaxPrice": maxPrice,
                        $set: {
                            "service.serviceImages": uploadedImageUrls
                        }
                    },
                    { upsert: true }
                ).lean().select('service');

                //! If new video uploaded, then, delete old video from AWS
                if (updatedData.service.serviceVideo && serviceVideo) {
                    if (updatedData.service.serviceVideo !== serviceVideo) {
                        const deleteImageFromAWS = new DeleteObjectCommand({
                            Bucket: bucketName,
                            Key: `merchantServiceVideo/${updatedData.service.serviceVideo.substring(updatedData.service.serviceVideo.lastIndexOf('/') + 1)}`
                        });

                        await s3Client.send(deleteImageFromAWS);
                    }
                } else if (!serviceVideo && updatedData.service.serviceVideo) {
                    const deletedeckPDFFromAWS = new DeleteObjectCommand({
                        Bucket: bucketName,
                        Key: `merchantServiceVideo/${updatedData.service.serviceVideo.substring(updatedData.service.serviceVideo.lastIndexOf('/') + 1)}`
                    });

                    await s3Client.send(deletedeckPDFFromAWS);
                }

                //! If new deckPDF uploaded, then, delete old video from AWS
                if (updatedData.service.serviceDeck && serviceDeck) {
                    if (updatedData.service.serviceDeck !== serviceDeck) {
                        const deletedeckPDFFromAWS = new DeleteObjectCommand({
                            Bucket: bucketName,
                            Key: `merchantServiceDeck/${updatedData.service.serviceDeck.substring(updatedData.service.serviceDeck.lastIndexOf('/') + 1)}`
                        });

                        await s3Client.send(deletedeckPDFFromAWS);
                    }
                } else if (!serviceDeck && updatedData.service.serviceDeck) {
                    const deletedeckPDFFromAWS = new DeleteObjectCommand({
                        Bucket: bucketName,
                        Key: `merchantServiceDeck/${updatedData.service.serviceDeck.substring(updatedData.service.serviceDeck.lastIndexOf('/') + 1)}`
                    });

                    await s3Client.send(deletedeckPDFFromAWS);
                }

                //! If new serviceImages uploaded, then, delete old serviceImages from AWS
                for (let i = 0; i < updatedData.service.serviceImages.length; i++) {
                    const imageUrl = updatedData.service.serviceImages[i]

                    if (!uploadedImageUrls.includes(imageUrl)) {
                        const deleteImageFromAWS = new DeleteObjectCommand({
                            Bucket: bucketName,
                            Key: `merchantServiceImages/${updatedData.service.serviceImages[i].substring(updatedData.service.serviceImages[i].lastIndexOf('/') + 1)}`
                        });

                        await s3Client.send(deleteImageFromAWS);
                    }
                }

                return NextResponse.json(
                    {
                        message: 'Service Information updated successfully',
                        statusCode: 200
                    },
                    { status: 200 }
                )

            } else if (isFundingInformation) {

                const fundingPDF = serviceDeck as File | string | null;
                if (typeof fundingPDF === 'object' && fundingPDF instanceof File) {
                    // Convert the File to a PDFDocument
                    const existingPdfBytes = await fundingPDF.arrayBuffer();
                    const pdfDoc = await PDFDocument.load(existingPdfBytes);

                    //! Compressing the PDF
                    const compressedPdfBytes = await pdfDoc.save();
                    const compressedPdfBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
                    const buffer = Buffer.from(await compressedPdfBlob.arrayBuffer());

                    const currentTime = moment().format('HH:mm:ss').replace(/:/g, '');
                    const randomNumber = Math.floor(Math.random() * 1000) + 1;
                    const fileExtension = fundingPDF.name.slice(-4);

                    const key = `merchantFundingPDF/${currentTime}-${isSessionExist.userNameCookie}-${randomNumber}${fileExtension}`;

                    const deckPDFURL = await uploadBlobToS3(buffer, key);

                    serviceDeck = deckPDFURL;
                } else {
                    serviceDeck = fundingPDF;
                }

                if (!fundingStage || !fundingAmount || !fundingDescription || !fundingPDF || !fundingCurrency) {
                    return NextResponse.json(
                        {
                            message: 'Please fill all the forms',
                            statusCode: 206
                        },
                        { status: 200 }
                    )
                }

                const updateAndGetOldPDFLink = await AccountsModel.findOneAndUpdate(
                    { userName },
                    { "funding.fundingStage": fundingStage, "funding.fundingCurrency": fundingCurrency, "funding.fundingAmount": fundingAmount, "funding.fundingDescription": fundingDescription, "funding.fundingDeck": serviceDeck },
                ).select("funding.fundingDeck").lean();

                if (updateAndGetOldPDFLink) {
                    const deleteFundingDeckFromAWS = new DeleteObjectCommand({
                        Bucket: bucketName,
                        Key: `merchantFundingPDF/${updateAndGetOldPDFLink.funding.fundingDeck.substring(updateAndGetOldPDFLink.funding.fundingDeck.lastIndexOf('/') + 1)}`
                    });

                    await s3Client.send(deleteFundingDeckFromAWS);
                }

                return NextResponse.json(
                    {
                        message: 'Funding information updated!',
                        statusCode: 200
                    },
                    { status: 200 }
                )

            } else if (isVVIPDeals) {

                if (!discountValue || !couponCode || !couponDescription || !stepsToRedeem || dealPicture === 'undefined') {
                    return NextResponse.json(
                        {
                            message: "Fill all the fields.",
                            statusCode: 413,
                        },
                        { status: 200 }
                    );
                }

                if (typeof discountValue === 'string' && discountValue.length > 20) {
                    return NextResponse.json(
                        {
                            message: "Discount Value max characters allowed is 20.",
                            statusCode: 413,
                        },
                        { status: 200 }
                    );
                }

                if (typeof couponCode === 'string' && couponCode.length > 6) {
                    return NextResponse.json(
                        {
                            message: "Max Coupon Code length allowed is 6.",
                            statusCode: 413,
                        },
                        { status: 200 }
                    );
                }

                if (typeof couponDescription === 'string' && couponDescription.length > 40) {
                    return NextResponse.json(
                        {
                            message: "Coupon Description max characters allowed is 40.",
                            statusCode: 413,
                        },
                        { status: 200 }
                    );
                }

                if (typeof stepsToRedeem === 'string' && stepsToRedeem.length > 240) {
                    return NextResponse.json(
                        {
                            message: "Steps To Redeem max characters allowed is 240.",
                            statusCode: 413,
                        },
                        { status: 200 }
                    );
                }

                if (dealPictureBlob instanceof File && dealPictureBlob.size >= 1000 * 20480 === true) {
                    return NextResponse.json(
                        {
                            message: "The dealPic exceed 1MB.",
                            statusCode: 413,
                        },
                        { status: 200 }
                    );
                }

                const checkDealsCountForTheUser = await AccountsModel.findOne({ userName }).select("dealsList");

                if (checkDealsCountForTheUser.dealsList.length < 3) {

                    if (dealPictureBlob) {
                        if (typeof dealPictureBlob === 'string') {
                            if (dealPictureBlob.includes(`https://s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com`)) {
                                dealPicture = dealPictureBlob;
                            }
                            // Handle the string case (e.g., URL string) here
                        } else if (dealPictureBlob instanceof File) {
                            // Now TypeScript knows dealPictureBlob is a File
                            const currentTime = moment().format('HH:mm:ss').replace(/:/g, '');
                            const randomNumber = Math.floor(Math.random() * 1000) + 1;
                            const fileExtension = '.jpg'; // or extract from dealPictureBlob.name if needed
                            const key = `merchantDealsPicture/${currentTime}-${isSessionExist.userNameCookie}-${randomNumber}${fileExtension}`;

                            const buffer = Buffer.from(await dealPictureBlob.arrayBuffer());

                            // Compressing image via sharp
                            const compressedBuffer = await sharp(buffer)
                                .jpeg({ quality: 40 })
                                .toBuffer();

                            const imageURL = await uploadBlobToS3(compressedBuffer, key);
                            dealPicture = imageURL;
                        }
                    }

                    const dealId = await new MerchantDealsListModel({
                        merchantId,
                        merchantUserName: userName,
                        discountValue,
                        couponCode,
                        couponDescription,
                        stepsToRedeem,
                        dealPicture,
                        serviceCategory
                    }).save();

                    await AccountsModel.updateOne({ userName }, { $push: { dealsList: dealId._id } });

                    return NextResponse.json(
                        {
                            message: 'VVIP information updated!',
                            statusCode: 200
                        },
                        { status: 200 }
                    )

                } else {
                    return NextResponse.json(
                        {
                            message: 'Max 3 deals can be added to your account.',
                            statusCode: 401
                        },
                        { status: 200 }
                    )
                }
            } else {

                return NextResponse.json(
                    {
                        message: 'Who are you?',
                        statusCode: 619
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
        // console.error(error);
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

export async function DELETE(request: NextRequest) {

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

    const { userName, id, functionToPerform } = await request.json();

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
        if (userName === findSessionInDB.userName && isSessionExist.tokenCookie === findSessionInDB.jwtToken && await bcrypt.compare(userAgent as string, findSessionInDB.userAgent) && isSessionExist.userNameCookie === findSessionInDB.userName) {

            if (functionToPerform === 'deletePackage') {

                const checkIfPackageStillExistsInTransit = await OrdersListModel.exists({
                    $and: [
                        { packageId: id },
                        { orderStatus: { $in: ["initiated contact", "work in progress"] } }
                    ]
                })

                if (checkIfPackageStillExistsInTransit) {
                    return NextResponse.json(
                        {
                            message: "Please complete all the orders for this package, then try to delete it",
                            statusCode: 206,
                        },
                        { status: 200 }
                    );
                }

                //! Deleting the package
                const deletePackage = await MerchantPackagesListModel.findByIdAndDelete(id).select('packageImages packageName');

                //! Delete the packageId fron Merchant Account Model
                await AccountsModel.updateOne({ userName }, { $pull: { packagesList: deletePackage._id } });
                await OrdersListModel.updateMany({ packageId: deletePackage._id }, { $unset: { packageImage: 1 } });

                //! Delete all the images from AWS S3
                for (let i = 0; i < deletePackage.packageImages.length; i++) {
                    const deleteImageFromAWS = new DeleteObjectCommand({
                        Bucket: bucketName,
                        Key: `merchantPackageImages/${deletePackage.packageImages[i].substring(deletePackage.packageImages[i].lastIndexOf('/') + 1)}`
                    });

                    s3Client.send(deleteImageFromAWS);
                }

                //! Delete merchant data from suggestions model
                await SuggestionsModel.deleteOne({ packageName: deletePackage.packageName })

                return NextResponse.json(
                    {
                        message: "Package deleted successfully",
                        statusCode: 200,
                    },
                    { status: 200 }
                );

            } else if (functionToPerform === 'deleteDeal') {

                //! Deleting the Deal
                const deleteDeal = await MerchantDealsListModel.findByIdAndDelete(id).select('dealPicture');

                //! Delete the dealID fron Merchant Account Model
                await AccountsModel.updateOne({ userName }, { $pull: { dealsList: deleteDeal._id } });

                const deleteDealImageFromAWS = new DeleteObjectCommand({
                    Bucket: bucketName,
                    Key: `merchantDealsPicture/${deleteDeal.dealPicture.substring(deleteDeal.dealPicture.lastIndexOf('/') + 1)}`
                });

                s3Client.send(deleteDealImageFromAWS);

                return NextResponse.json(
                    {
                        message: "Deal deleted successfully",
                        statusCode: 200,
                    },
                    { status: 200 }
                );

            }
        } else {

            return NextResponse.json(
                {
                    message: "No session found",
                    statusCode: 404,
                },
                { status: 200 }
            );

        }

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