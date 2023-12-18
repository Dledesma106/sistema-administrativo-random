import { NextApiResponse } from 'next';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import formidable from 'formidable';
import fs from 'fs';
import { Types as MongooseTypes } from 'mongoose';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import ExpenseModel from 'backend/models/Expense';
import ImageModel, { Image } from 'backend/models/Image';
import TaskModel from 'backend/models/Task';
import { ExpenseStatus, ExpenseType, PaySource } from 'backend/models/types';
import { createImageSignedUrl, s3Client } from 'backend/s3Client';

type PostTechFormData = {
    fields: {
        taskId: [string];
        expenseType: [ExpenseType];
        paySource: [PaySource];
        amount: [string];
    };
    files: { image: [formidable.File] };
};

const ExpenseController = {
    getTech: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        try {
            const { id } = req.query;

            const expense = await ExpenseModel.findOne({
                _id: new MongooseTypes.ObjectId(id as string),
                doneBy: req.user._id.toString(),
                deleted: false,
            })
                .populate({
                    path: 'image',
                    select: 'url',
                })
                .lean()
                .exec();

            if (!expense) {
                return res.status(400).json({
                    error: 'Expense not found',
                });
            }

            const expenseData = {
                ...expense,
                image: {
                    url: await createImageSignedUrl(expense.image as Image),
                },
            };

            return res.status(200).json({
                data: expenseData,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: (err as Error).message,
            });
        }
    },
    postTech: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        try {
            const data = await new Promise<PostTechFormData>((resolve, reject) => {
                const form = formidable();
                form.parse<
                    keyof PostTechFormData['fields'],
                    keyof PostTechFormData['files']
                >(req, (err, fields, files) => {
                    if (err) return reject(err);
                    resolve({
                        fields: fields as any,
                        files: files as any,
                    });
                });
            });

            const formidableImageFile = data.files.image[0];
            const expenseType = data.fields.expenseType[0];
            const paySource = data.fields.paySource[0];
            const amount = data.fields.amount[0];
            const taskId = data.fields.taskId[0];

            const user = req.user;
            const userTask = await TaskModel.find({
                _id: new MongooseTypes.ObjectId(taskId),
                assigned: user._id.toString(),
            });

            if (!userTask) {
                return res.status(400).json({
                    error: 'Task not found',
                });
            }

            const fileContent = fs.readFileSync(formidableImageFile.filepath);
            const originalFilename = formidableImageFile.originalFilename;
            const s3Filename = `${Date.now()}-${originalFilename}`;

            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME as string,
                Key: s3Filename,
                Body: fileContent,
                ContentType: formidableImageFile.mimetype || undefined,
            };

            await s3Client.send(new PutObjectCommand(uploadParams));

            const image = await ImageModel.create({
                name: uploadParams.Key,
                url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${uploadParams.Key}`,
                key: uploadParams.Key,
            });

            const expense = await ExpenseModel.create({
                task: taskId,
                doneBy: user._id.toString(),
                expenseType,
                paySource,
                image: image._id,
                amount: parseInt(amount, 10),
                status: ExpenseStatus.Enviado,
            });

            return res.status(200).json({
                data: expense,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: (err as Error).message,
            });
        }
    },
};

export default ExpenseController;
