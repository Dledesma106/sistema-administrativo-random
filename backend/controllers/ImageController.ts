import { type NextApiResponse } from 'next';

import { type DocumentType } from '@typegoose/typegoose';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import ImageModel from 'backend/models/Image';
import TaskModel, { type Task } from 'backend/models/Task';

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME ?? '';

const ImageController = {
    postImage: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        const file = req.file;
        const imageKey = file.key;
        const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;
        const image = await ImageModel.create({
            name: file.originalname,
            url: imageUrl,
        });

        if (image === undefined)
            return res.status(500).json({ error: 'Could not create Image' });

        const taskId = req.query.taskId as string;
        const task = (await TaskModel.findOneUndeleted({
            _id: taskId,
        })) as DocumentType<Task>;

        if (task == null) return res.status(500).json({ error: 'Task not found' });

        await TaskModel.findOneAndUpdate(
            { _id: taskId },
            {
                $push: {
                    image: image._id,
                },
            },
            {
                runValidators: true,
            },
        );

        res.status(200).json({ data: { imageId: image._id } });
    },
};

export default ImageController;
