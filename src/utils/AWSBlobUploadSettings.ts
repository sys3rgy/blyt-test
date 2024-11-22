import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

if (!process.env.NEXT_PRIVATE_ACCESS_SECRET || !process.env.NEXT_PRIVATE_ACCESS_KEY || !process.env.NEXT_PUBLIC_REGION || !process.env.NEXT_PUBLIC_BUCKET) {
    throw new Error('AWS credentials issue.');
}

const bucketName = process.env.NEXT_PUBLIC_BUCKET;

export const s3Client = new S3Client({
    credentials: {
        secretAccessKey: process.env.NEXT_PRIVATE_ACCESS_SECRET,
        accessKeyId: process.env.NEXT_PRIVATE_ACCESS_KEY,
    },
    region: process.env.NEXT_PUBLIC_REGION,
});

export async function uploadBlobToS3(file: any, key: string) {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file,
    };

    try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        const fileLink = `https://s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com/${bucketName}/${key}`;
        return fileLink;
    } catch (error) {
        throw error;
    }
}
