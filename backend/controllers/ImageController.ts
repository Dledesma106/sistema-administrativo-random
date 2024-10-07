import { type NextApiResponse } from 'next';

import { type DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import ExpenseModel, { Expense } from 'backend/models/Expense';
import ImageModel from 'backend/models/Image';
import TaskModel, { type Task } from 'backend/models/Task';
import { prisma } from 'lib/prisma';
import { createImageSignedUrlAsync } from 'backend/s3Client';

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME ?? '';

const ImageController = {
    _addImageToTask: async (image: string, id: string) => {
        const task = await prisma.task.findUniqueUndeleted({
            where: {
                id,
            },
        });

        if (!task) {
            return false;
        }
        await prisma.task.update({
            where: {
                id,
            },
            data: { imagesIDs: [...task.imagesIDs, image] },
        });
        return true;
    },

    _addImageToExpense: async (image: string, id: string) => {
        const expense = await prisma.expense.findUniqueUndeleted({
            where: {
                id,
            },
        });

        if (!expense) {
            return false;
        }
        await prisma.expense.update({
            where: {
                id,
            },
            data: { imageId: image },
        });
        return true;
    },
    postImage: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { key, taskId, expenseId } = req.body;
        console.log('imagekey: ', key);
        const { url, urlExpire } = await createImageSignedUrlAsync(key);
        console.log('url: ', url);
        let image;
        try {
            image = await prisma.image.create({
                data: { key: String(key), url, urlExpire },
            });
        } catch (error) {
            console.log(error);
        }

        console.log('image: ', image);
        if (!image) {
            return res.status(500).json({
                error: 'Could not create Image',
            });
        }
        try {
            if (taskId) {
                const result = ImageController._addImageToTask(image.id, taskId);
                if (!result) {
                    return res.status(404).json({
                        error: 'Task not found',
                    });
                }
            } else if (expenseId) {
                const result = ImageController._addImageToExpense(image.id, expenseId);
                if (!result) {
                    return res.status(404).json({
                        error: 'Expense not found',
                    });
                }
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: 'Could not add image',
            });
        }
        console.log(image.id);
        return res.status(200).json({
            data: image.id,
        });
    },
};

export default ImageController;
