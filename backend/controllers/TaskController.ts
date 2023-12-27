import { type NextApiResponse } from 'next';

import { FilterQuery, Types as MongooseTypes } from 'mongoose';

import { type NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import { formatIds } from '@/lib/utils';
import ExpenseModel from 'backend/models/Expense';
import ImageModel, { Image } from 'backend/models/Image';
import TaskModel, { Task } from 'backend/models/Task';
import { TaskStatus } from 'backend/models/types';
import { type User } from 'backend/models/User';
import { createImageSignedUrl } from 'backend/s3Client';

const getTaskById = async (taskId: string, userId: string) => {
    const task = await TaskModel.findOne({
        deleted: false,
        _id: new MongooseTypes.ObjectId(taskId),
        assigned: userId,
    })
        .populate([
            {
                path: 'branch',
                select: 'number',
                populate: {
                    path: 'client',
                    select: 'name',
                },
            },
            {
                path: 'business',
                select: 'name',
            },
            {
                path: 'image',
            },
        ])
        .lean()
        .exec();

    if (!task) {
        return null;
    }

    let images = task.image as undefined | Pick<Image, 'url' | '_id'>[];
    if (!images) {
        images = [];
    } else {
        images = await Promise.all(
            images.map(async (image) => {
                const url = await createImageSignedUrl(image);

                return {
                    ...image,
                    url,
                };
            }),
        );
    }

    const expenses = await ExpenseModel.find({
        task: task._id,
        deleted: false,
    })
        .populate([
            {
                path: 'image',
                select: 'url',
            },
            {
                path: 'auditor',
                select: 'name',
            },
        ])
        .lean()
        .exec();

    (task as any).images = images;
    (task as any).expenses = expenses;
    delete task.image;

    return task;
};

const TaskController = {
    putTask: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { body } = req;
        await dbConnect();
        const {
            _id,
            branch,
            business,
            assigned,
            taskType,
            openedAt,
            status,
            description,
            participants,
            auditor,
            activity,
            operatorName,
            image,
            workOrderNumber,
            closedAt,
        } = body;
        const assignedIds = assigned.map((user: User) => user._id);
        const taskForm = {
            branch,
            business,
            assigned: assignedIds,
            taskType,
            openedAt,
            status,
            description,
            participants,
            auditor,
            activity,
            operatorName,
            image,
            workOrderNumber,
            closedAt,
        };

        try {
            const newTask = await TaskModel.findByIdAndUpdate(_id, taskForm, {
                new: true,
                runValidators: true,
            });
            if (newTask == null) {
                res.json({ statusCode: 500, error: 'could not update Task' });
            }

            res.json({
                statusCode: 200,
                data: { task: formatIds(newTask), message: 'updated Task succesfully' },
            });
        } catch (error) {
            return res.json({ statusCode: 500, error: 'could not update Task' });
        }
    },
    postTask: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { body } = req;
        await dbConnect();
        const {
            branch,
            business,
            assigned,
            taskType,
            description,
            participants,
            activity,
            operatorName,
            image,
            workOrderNumber,
            closedAt,
        } = body;
        const openedAt = new Date();
        const status = 'Pendiente';
        const assignedIds = assigned.map((user: User) => user._id);
        const taskForm = {
            branch,
            business,
            assigned: assignedIds,
            taskType,
            openedAt,
            status,
            description,
            participants,
            activity,
            operatorName,
            image,
            workOrderNumber,
            closedAt,
        };
        try {
            const newTask = await TaskModel.create(taskForm);
            if (newTask === undefined) {
                return res.json({ statusCode: 500, error: 'could not create Task' });
            }

            return res.json({
                statusCode: 200,
                data: { task: formatIds(newTask), message: 'created Task succesfully' },
            });
        } catch (error) {
            return res.json({ statusCode: 500, error: 'could not create Task' });
        }
    },
    deleteTask: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { body } = req;
        await dbConnect();
        const deletedTask = await TaskModel.findById(body._id);
        if (deletedTask == null) {
            return res.json({ statusCode: 500, error: 'could not delete Task' });
        }
        await deletedTask.softDelete();
        res.json({ statusCode: 200, data: { message: 'deleted Task succesfully' } });
    },
    getTechTasks: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        const filter = {
            deleted: false,
            assigned: req.user._id.toString(),
        } as FilterQuery<Task>;

        if (req.query.status) {
            if (Array.isArray(req.query.status)) {
                filter.status = { $in: req.query.status };
            }

            if (typeof req.query.status === 'string') {
                filter.status = req.query.status;
            }
        }

        const tasks = await TaskModel.find(filter)
            .populate([
                {
                    path: 'branch',
                    select: 'number',
                    populate: {
                        path: 'client',
                        select: 'name',
                    },
                },
                {
                    path: 'business',
                    select: 'name',
                },
            ])
            .lean()
            .exec();

        res.status(200).json({ data: tasks, message: 'ok' });
    },
    getTechTaskById: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        const task = await getTaskById(req.query.id as string, req.user._id.toString());

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ data: task });
    },
    putTechTask: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        const taskId = req.query.id as string;
        const { isClosed, workOrder, imageIdToDelete } = req.body;
        const user = req.user;
        const userTask = await TaskModel.findOne({
            _id: new MongooseTypes.ObjectId(taskId),
            assigned: user._id.toString(),
            deleted: false,
        });

        if (!userTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (
            isClosed !== undefined &&
            (userTask.status === TaskStatus.Pendiente ||
                userTask.status === TaskStatus.Finalizada)
        ) {
            if (isClosed) {
                userTask.status = TaskStatus.Finalizada;
                userTask.closedAt = new Date();
            } else {
                userTask.status = TaskStatus.Pendiente;
                userTask.closedAt = undefined;
            }
        }

        if (workOrder) {
            userTask.workOrderNumber = parseInt(workOrder, 10);
        }

        if (imageIdToDelete) {
            const imageBelongsToTask = userTask.image?.includes(imageIdToDelete);
            if (!imageBelongsToTask) {
                return res.status(404).json({ message: 'Image not found' });
            }

            const image = ImageModel.findOne({
                _id: new MongooseTypes.ObjectId(imageIdToDelete),
                deleted: false,
            });

            if (!image) {
                return res.status(404).json({ message: 'Image not found' });
            }

            await image.deleteOne();
        }

        await userTask.save();

        const result = await getTaskById(taskId, user._id.toString());

        res.status(200).json({
            data: result,
        });
    },
    postTechTask: async (req: NextConnectApiRequest) => {
        const { body } = req;
        await dbConnect();
        console.log(body);
    },
};

export default TaskController;
