import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dayjs from 'dayjs';

const EXPIRE_1_HOUR = 60 * 60;

export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

export const createImageSignedUrlAsync = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Key: key,
    });

    const url = await getSignedUrl(s3Client, command, {
        expiresIn: EXPIRE_1_HOUR,
    });

    return {
        url,
        urlExpire: dayjs()
            .add(EXPIRE_1_HOUR - 120, 'second')
            .toISOString(),
    };
};

export const createFileSignedUrlAsync = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Key: key,
        ResponseContentDisposition: 'inline',
    });

    const url = await getSignedUrl(s3Client, command, {
        expiresIn: EXPIRE_1_HOUR,
    });

    return {
        url,
        urlExpire: dayjs()
            .add(EXPIRE_1_HOUR - 120, 'second')
            .toISOString(),
    };
};

export const getFileSignedUrl = async (key: string, mimeType: string) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
        ResponseContentType: mimeType,
        ResponseContentDisposition: 'inline',
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return {
        url,
        urlExpire: dayjs()
            .add(3600 - 120, 'second')
            .toISOString(),
    };
};

export const deletePhoto = async (key: string) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME as string,
            Key: key,
        });
        await s3Client.send(command);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};
