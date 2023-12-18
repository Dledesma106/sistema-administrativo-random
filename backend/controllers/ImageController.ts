import { type NextApiResponse } from 'next';

import { type DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import ExpenseModel, { Expense } from 'backend/models/Expense';
import ImageModel from 'backend/models/Image';
import TaskModel, { type Task } from 'backend/models/Task';

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME ?? '';

const ImageController = {
    _addImageToTask: async (image: string | Types.ObjectId, id: string) => {
        const task = (await TaskModel.findOneUndeleted({
            _id: id,
        })) as DocumentType<Task>;

        if (!task) {
            return false;
        }
        await TaskModel.findOneAndUpdate(
            { _id: id },
            {
                $push: {
                    image: image,
                },
            },
            {
                runValidators: true,
            },
        );
        return true;
    },

    _addImageToExpense: async (image: string | Types.ObjectId, id: string) => {
        const expense = (await ExpenseModel.findOneUndeleted({
            _id: id,
        })) as DocumentType<Expense>;

        if (!expense) return false;

        await ExpenseModel.findOneAndUpdate(
            { _id: id },
            {
                image: image,
            },
            {
                runValidators: true,
            },
        );
        return true;
    },
    postImage: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        const file = req.file;
        const imageKey = file.key;
        const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;
        const image = await ImageModel.create({
            name: file.originalname,
            url: imageUrl,
            key: imageKey,
        });

        if (!image) return res.status(500).json({ error: 'Could not create Image' });

        if (req.query.taskId) {
            const taskId = req.query.taskId as string;
            const result = ImageController._addImageToTask(image._id, taskId);
            if (!result) {
                return res.status(404).json({ error: 'Task not found' });
            }
        } else if (req.query.expenseId) {
            const expenseId = req.query.expenseId as string;
            const result = ImageController._addImageToExpense(image._id, expenseId);
            if (!result) {
                res.status(404).json({ error: 'Expense not found' });
            }
        }

        res.status(200).json({
            data: image._id,
        });
    },
};

export default ImageController;
