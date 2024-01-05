import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

const newS3: S3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

const uploadImage = multer({
    storage: multerS3({
        s3: newS3,
        bucket: process.env.AWS_S3_BUCKET_NAME ?? '',
        key: (req, file, cb) => {
            cb(null, `${Date.now().toString()}-${String(file.originalname)}`);
        },
    }),
    // storage: multer.diskStorage({
    // 	destination: (req, file, cb) => {
    // 		cb(null, 'public/')
    // 	},
    // 	filename: (req, file, cb) => {
    // 		cb(null, `${Date.now().toString()}-${String(file.originalname)}`)
    // 	}
    // }),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
});

export default uploadImage;
