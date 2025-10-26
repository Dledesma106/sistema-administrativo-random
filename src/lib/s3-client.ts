import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Configuración del cliente S3 (funciona en frontend y backend)
const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION || process.env.AWS_REGION || 'us-east-2',
    credentials: {
        accessKeyId:
            process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ||
            process.env.AWS_ACCESS_KEY_ID ||
            '',
        secretAccessKey:
            process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ||
            process.env.AWS_SECRET_ACCESS_KEY ||
            '',
    },
});

export interface S3UploadParams {
    bucket: string;
    key: string;
    body: File | Blob | Uint8Array | string;
    contentType?: string;
    metadata?: Record<string, string>;
}

export const uploadToS3 = async (params: S3UploadParams): Promise<string> => {
    const command = new PutObjectCommand({
        Bucket: params.bucket,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
        Metadata: params.metadata,
    });

    try {
        await s3Client.send(command);

        // Construir la URL del objeto subido
        const region =
            process.env.NEXT_PUBLIC_AWS_REGION || process.env.AWS_REGION || 'us-east-2';
        const url = `https://${params.bucket}.s3.${region}.amazonaws.com/${params.key}`;

        return url;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error(
            `Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
    }
};

export { s3Client };
