import serverSideSessionCheck from '@/utils/serverSideSessionCheck';
import { connect2MongoDB } from 'connect2mongodb';
import moment from 'moment';
import { NextResponse, type NextRequest } from 'next/server'
import sharp from 'sharp';
import bcrypt from 'bcrypt';

//* AWS Settings 
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { File } from 'buffer';
import SessionsModel from '@/models/SessionsModel';
import AccountsModel from '@/models/AccountsModel';
import { s3Client, uploadBlobToS3 } from '@/utils/AWSBlobUploadSettings';
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
    let userProfilePic = data.get("userProfilePic");
    let userBannerPic = data.get("userBannerPic");

    const userProfilePicBlob = userProfilePic as object | File | string | null;
    const userBannerBlob = userBannerPic as object | File | string | null;

    if (userProfilePicBlob instanceof File && userProfilePicBlob.size >= 1000 * 20480 === true) {
        // removeCookies();
        return NextResponse.json(
            {
                message: "The file exceed 1MB.",
                statusCode: 413,
            },
            { status: 200 }
        );
    }

    if (userBannerBlob instanceof File && userBannerBlob.size >= 2000 * 20480 === true) {
        // removeCookies();
        return NextResponse.json(
            {
                message: "The file exceed 2MB.",
                statusCode: 413,
            },
            { status: 200 }
        );
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
            if (!userBannerPic) {

                if (userProfilePicBlob) {
                    if (typeof userProfilePicBlob === 'string') {
                        if (userProfilePicBlob.includes(`https://s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com`)) {
                            userProfilePic = userProfilePicBlob;
                        }
                        // Handle the string case (e.g., URL string) here
                    } else if (userProfilePicBlob instanceof File) {
                        // Now TypeScript knows userProfilePicBlob is a File
                        const currentTime = moment().format('HH:mm:ss').replace(/:/g, '');
                        const randomNumber = Math.floor(Math.random() * 1000) + 1;
                        const fileExtension = '.jpg'; // or extract from userProfilePicBlob.name if needed
                        const key = `merchantProfilePicImages/${currentTime}-${isSessionExist.userNameCookie}-${randomNumber}${fileExtension}`;

                        const buffer = Buffer.from(await userProfilePicBlob.arrayBuffer());

                        // Compressing image via sharp
                        const compressedBuffer = await sharp(buffer)
                            .jpeg({ quality: 40 })
                            .toBuffer();

                        const imageURL = await uploadBlobToS3(compressedBuffer, key);
                        userProfilePic = imageURL;
                    }
                }

                const dataToRemoveOldImage = await AccountsModel.findOneAndUpdate({ userName }, { userProfilePic }).select('userProfilePic').lean();

                if (!dataToRemoveOldImage.userProfilePic) {
                    return NextResponse.json(
                        {
                            message: 'Profile pic updated successfully',
                            statusCode: 200,
                        },
                        { status: 200 }
                    )
                } else {
                    const deleteImageFromAWS = new DeleteObjectCommand({
                        Bucket: bucketName,
                        Key: `merchantProfilePicImages/${dataToRemoveOldImage.userProfilePic.substring(dataToRemoveOldImage.userProfilePic.lastIndexOf('/') + 1)}`
                    });

                    await s3Client.send(deleteImageFromAWS);
                    return NextResponse.json(
                        {
                            message: 'Profile pic updated successfully',
                            statusCode: 200,
                        },
                        { status: 200 }
                    )
                }

            } else if (userBannerPic) {

                if (userBannerBlob) {
                    if (typeof userBannerBlob === 'string') {
                        if (userBannerBlob.includes(`https://s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com`)) {
                            userBannerPic = userBannerBlob;
                        }
                        // Handle the string case (e.g., URL string) here
                    } else if (userBannerBlob instanceof File) {
                        // Now TypeScript knows userBannerBlob is a File
                        const currentTime = moment().format('HH:mm:ss').replace(/:/g, '');
                        const randomNumber = Math.floor(Math.random() * 1000) + 1;
                        const fileExtension = '.jpg'; // or extract from userBannerBlob.name if needed
                        const key = `merchantBannerImages/${currentTime}-${isSessionExist.userNameCookie}-${randomNumber}${fileExtension}`;

                        const buffer = Buffer.from(await userBannerBlob.arrayBuffer());

                        // Compressing image via sharp
                        const compressedBuffer = await sharp(buffer)
                            .jpeg({ quality: 40 })
                            .toBuffer();

                        const imageURL = await uploadBlobToS3(compressedBuffer, key);
                        userBannerPic = imageURL;
                    }
                }

                const dataToRemoveOldImage = await AccountsModel.findOneAndUpdate({ userName }, { "service.serviceBanner": userBannerPic }).select('service.serviceBanner').lean();

                if (!dataToRemoveOldImage.service.serviceBanner) {
                    return NextResponse.json(
                        {
                            message: 'Banner updated successfully',
                            statusCode: 200,
                        },
                        { status: 200 }
                    )
                } else {
                    const deleteImageFromAWS = new DeleteObjectCommand({
                        Bucket: bucketName,
                        Key: `merchantBannerImages/${dataToRemoveOldImage.service.serviceBanner.substring(dataToRemoveOldImage.service.serviceBanner.lastIndexOf('/') + 1)}`
                    });

                    await s3Client.send(deleteImageFromAWS);
                    return NextResponse.json(
                        {
                            message: 'Banner updated successfully',
                            statusCode: 200,
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

export async function DELETE(request: NextRequest) {

    const { userName } = await request.json();

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

            const deleteImage = await AccountsModel.findOneAndUpdate({ userName }, { $unset: { "service.serviceBanner": "" } });

            const deleteImageFromAWS = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: `merchantBannerImages/${deleteImage.service.serviceBanner.substring(deleteImage.service.serviceBanner.lastIndexOf('/') + 1)}`
            });

            await s3Client.send(deleteImageFromAWS);

            return NextResponse.json(
                {
                    message: "Banner removed successfully",
                    statusCode: 200,
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