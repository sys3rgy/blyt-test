import serverSideSessionCheck from '@/utils/serverSideSessionCheck';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server'
import bcrypt from 'bcrypt';
import sharp from 'sharp';

//* AWS Settings 
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { File } from 'buffer';
import moment from 'moment';
import SessionsModel from '@/models/SessionsModel';
import AccountsModel from '@/models/AccountsModel';
import MerchantPackagesListModel from '@/models/MerchantPackagesListModel';
import { s3Client, uploadBlobToS3 } from '@/utils/AWSBlobUploadSettings';
import SuggestionsModel from '@/models/SuggestionsModel';
import { removeCookies } from '@/utils/removeCookies';

const bucketName = process.env.NEXT_PUBLIC_BUCKET || "";

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

    const data = await request.formData()

    const userName = data.get("userName");
    const packageName = data.get("packageName");
    let packagePriceString = data.get("packagePrice");
    const packageDescription = data.get("packageDescription");
    const packageImages = data.getAll("packageImages");

    //! Checking if any field is missing
    let missingField = null;

    if (!userName) {
        missingField = "userName";
    } else if (!packageName) {
        missingField = "packageName";
    } else if (!packagePriceString) {
        missingField = "packagePrice";
    } else if (!packageDescription) {
        missingField = "packageDescription";
    } else if (!packageImages || packageImages.length === 0) {
        missingField = "packageImages";
    }

    if (missingField) {
        return NextResponse.json(
            {
                message: `Please add ${missingField}.`,
                statusCode: 204,
            },
            { status: 200 }
        );
    }

    //! If everything is fine, then, converting the price from string to number
    let packagePrice: number | null = null;
    if (typeof packagePriceString === 'string') {
        packagePrice = parseFloat(packagePriceString);
    }

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

            //~ Uploading packageImages To AWS & getting AWS link in return
            var uploadedImageUrls: string[] = [];
            const imagesBlob = packageImages as object | File | string | null;
            if (imagesBlob && Array.isArray(imagesBlob)) {
                for (let i = 0; i < imagesBlob.length; i++) {
                    if (typeof imagesBlob[i] !== 'object' && imagesBlob[i].includes(`https://s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com`)) {
                        uploadedImageUrls.push(imagesBlob[i]);
                    } else {
                        const currentTime = moment().format('HH:mm:ss').replace(/:/g, '');
                        const randomNumber = Math.floor(Math.random() * 1000) + 1;
                        const fileExtension = imagesBlob[i].name.slice(-4);

                        const key = `merchantPackageImages/${currentTime}-${i}-${isSessionExist.userNameCookie}-${randomNumber}${fileExtension}`;

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

            const getCurrency = await AccountsModel.findOne({ _id: findSessionInDB.id }).select('service.serviceName service.serviceCurrency businessName').lean();

            //! It means we are updating personal information
            const packageId = await new MerchantPackagesListModel({
                merchantId: findSessionInDB.id,
                merchantUserName: isSessionExist.userNameCookie,
                packageName: packageName,
                packagePrice: packagePrice,
                serviceCurrency: getCurrency.service.serviceCurrency,
                packageDescription: packageDescription,
                packageImages: uploadedImageUrls,
                packageCategory: findSessionInDB.id.service.serviceCategory
            }).save({ new: true });

            //! Add merchant data to suggestions model
            await new SuggestionsModel({
                userName: isSessionExist.userNameCookie,
                businessName: getCurrency.businessName,
                serviceCategory: findSessionInDB.id.service.serviceCategory,
                serviceName: getCurrency.serviceName,
                packageName: packageName
            }).save();

            await AccountsModel.updateOne({ _id: findSessionInDB.id }, { $push: { packagesList: packageId } });

            return NextResponse.json(
                {
                    message: 'Package added successfully',
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

    const data = await request.formData()

    const userName = data.get("userName");
    const packageName = data.get("packageName");
    const packageDescription = data.get("packageDescription");
    const packageId = data.get("packageId");
    const packageImages = data.getAll("packageImages");

    let packagePriceString = data.get("packagePrice");

    //! If everything is fine, then, converting the price from string to number
    let packagePrice: number | null = null;
    if (typeof packagePriceString === 'string') {
        packagePrice = parseFloat(packagePriceString);
    }

    //* Connecting to MongoDB
    await connect2MongoDB();

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

            //~ Uploading packageImages To AWS & getting AWS link in return
            let uploadedImageUrls: string[] = [];
            for (let i = 0; i < packageImages.length; i++) {
                const image = packageImages[i];

                // Check if the item is a string and a URL
                if (typeof image === 'string' && image.startsWith('https://')) {
                    uploadedImageUrls.push(image);
                } else if (typeof image === 'object' && 'name' in image) {
                    // Assuming 'image' is a File object here, upload it and get the URL
                    const currentTime = moment().format('HH:mm:ss').replace(/:/g, '');
                    const randomNumber = Math.floor(Math.random() * 1000) + 1;
                    const fileExtension = image.name.slice(-4);
                    const key = `merchantPackageImages/${currentTime}-${i}-${isSessionExist.userNameCookie}-${randomNumber}${fileExtension}`;

                    const buffer = Buffer.from(await image.arrayBuffer());

                    // Compression image via sharp
                    const compressedBuffer = await sharp(buffer)
                        .jpeg({ quality: 40 })
                        .toBuffer();

                    const imageURL = await uploadBlobToS3(compressedBuffer, key);
                    uploadedImageUrls.push(imageURL);
                } else {
                    console.error('Invalid image type');
                }
            }

            //! It means we are updating personal information
            const updatedData = await MerchantPackagesListModel.findByIdAndUpdate(packageId, { packageName, packageDescription, packagePrice, $set: { packageImages: uploadedImageUrls } });

            //! If new packageImages uploaded, then, delete old packageImages from AWS
            for (let i = 0; i < updatedData.packageImages.length; i++) {
                const imageUrl = updatedData.packageImages[i]

                if (!uploadedImageUrls.includes(imageUrl)) {
                    const deleteImageFromAWS = new DeleteObjectCommand({
                        Bucket: bucketName,
                        Key: `merchantPackageImages/${updatedData.packageImages[i].substring(updatedData.packageImages[i].lastIndexOf('/') + 1)}`
                    });

                    await s3Client.send(deleteImageFromAWS);
                }
            }

            //! Update merchant data to suggestions model
            await SuggestionsModel.updateOne(
                { packageName: updatedData.packageName },
                { userName: isSessionExist.userNameCookie, serviceCategory: findSessionInDB.id.service.serviceCategory, packageName }
            )

            return NextResponse.json(
                {
                    message: 'Package updated successfully',
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