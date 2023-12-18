import multer from 'multer';
import multerS3 from 'multer-s3';

import { s3Client } from 'backend/s3Client';

const uploadImage = multer({
    storage: multerS3({
        s3: s3Client,
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
