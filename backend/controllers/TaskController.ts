import { type NextApiResponse } from 'next';

import { TaskStatus, TaskType } from '@prisma/client';
import { FilterQuery, Types as MongooseTypes } from 'mongoose';

import { type NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import Mailer from 'lib/nodemailer';
import { mongooseDocumentToJSON } from '@/lib/utils';
import ExpenseModel from 'backend/models/Expense';
import ImageModel, { Image } from 'backend/models/Image';
import { ITask, IUser } from 'backend/models/interfaces';
import TaskModel, { Task } from 'backend/models/Task';
import { type User } from 'backend/models/User';
import { createImageSignedUrlAsync } from 'backend/s3Client';

export const getTaskById = async (taskId: string, userId?: string) => {
    const filters = {
        deleted: false,
        _id: new MongooseTypes.ObjectId(taskId),
    } as FilterQuery<Task>;

    if (userId) {
        filters.assignedIDs = userId;
    }

    const task = await TaskModel.findOne(filters)
        .populate([
            {
                path: 'branch',
                select: 'number',
                populate: [
                    {
                        path: 'client',
                        select: 'name',
                    },
                    {
                        path: 'city',
                        populate: 'provinceId',
                    },
                ],
            },
            {
                path: 'assignedIDs',
            },
            {
                path: 'business',
                select: 'name',
            },
            {
                path: 'imagesIDs',
            },
            {
                path: 'auditor',
            },
        ])
        .lean()
        .exec();

    if (!task) {
        return null;
    }

    let images = task.imagesIDs as undefined | Pick<Image, 'url' | '_id' | 'key'>[];
    if (!images) {
        images = [];
    } else {
        images = await Promise.all(
            images.map(async (image) => {
                const { url, expiresAt } = await createImageSignedUrlAsync(image);
                await ImageModel.findOneAndUpdate(
                    { _id: image._id },
                    {
                        url,
                        urlExpire: expiresAt,
                    },
                );

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
                path: 'imagesIDs',
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
            if (newTask === null) {
                return res.json({
                    statusCode: 500,
                    error: 'could not update Task',
                });
            }

            return res.json({
                statusCode: 200,
                data: {
                    task: mongooseDocumentToJSON(newTask),
                    message: 'updated Task succesfully',
                },
            });
        } catch (error) {
            return res.json({
                statusCode: 500,
                error: 'could not update Task',
            });
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
                return res.json({
                    statusCode: 500,
                    error: 'could not create Task',
                });
            }

            return res.json({
                statusCode: 200,
                data: {
                    task: mongooseDocumentToJSON(newTask),
                    message: 'created Task succesfully',
                },
            });
        } catch (error) {
            return res.json({
                statusCode: 500,
                error: 'could not create Task',
            });
        }
    },
    getTechTasks: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        const filter = {
            deleted: false,
            assignedIDs: req.user._id.toString(),
        } as FilterQuery<Task>;

        if (req.query.status) {
            if (Array.isArray(req.query.status)) {
                filter.status = {
                    $in: req.query.status,
                };
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

        return res.status(200).json({
            data: tasks,
            message: 'ok',
        });
    },
    getTechTaskById: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        const task = await getTaskById(req.query.id as string, req.user._id.toString());

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        return res.status(200).json({
            data: task,
        });
    },
    putTechTask: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        const taskId = req.query.id as string;
        const { isClosed, workOrder, imageIdToDelete } = req.body;
        const user = req.user;
        const userTask = (await TaskModel.findOne({
            _id: new MongooseTypes.ObjectId(taskId),
            assignedIDs: user._id.toString(),
            deleted: false,
        }).populate(['auditor', 'branch'])) as ITask;

        if (!userTask) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        if (
            isClosed !== undefined &&
            (userTask.status === TaskStatus.Pendiente ||
                userTask.status === TaskStatus.Finalizada)
        ) {
            if (isClosed) {
                if (userTask.auditor) {
                    Mailer.sendTaskFinished({
                        auditor: userTask.auditor,
                        task: userTask,
                        finishedBy: user as IUser,
                    });
                }

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
            const imageBelongsToTask = userTask.imagesIDs?.includes(imageIdToDelete);
            if (!imageBelongsToTask) {
                return res.status(404).json({
                    message: 'Image not found',
                });
            }

            const image = ImageModel.findOne({
                _id: new MongooseTypes.ObjectId(imageIdToDelete),
                deleted: false,
            });

            if (!image) {
                return res.status(404).json({
                    message: 'Image not found',
                });
            }

            await image.deleteOne();
        }

        await userTask.save();

        const result = await getTaskById(taskId, user._id.toString());

        return res.status(200).json({
            data: result,
        });
    },
    postTechTask: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        type CreateTaskMutationVariables = {
            branch: string;
            business: string;
            taskType: TaskType;
            description: string;
            workOrderNumber: number;
            metadata: Record<string, any>;
        };

        const { body } = req;
        await dbConnect();
        const { branch, business, taskType, description, workOrderNumber, metadata } =
            body as CreateTaskMutationVariables;

        const openedAt = new Date();
        const status = TaskStatus.Pendiente;
        const assigned = [req.user._id.toString()];
        const taskForm = {
            branch,
            business,
            assigned,
            taskType,
            openedAt,
            status,
            description,
            workOrderNumber,
            metadata,
        };

        try {
            const newTask = await TaskModel.create(taskForm);
            if (!newTask) {
                return res.status(500).json({
                    message: 'could not create Task',
                });
            }

            return res.status(200).json({
                data: newTask.id,
                message: 'created Task succesfully',
            });
        } catch (error) {
            return res.status(500).json({
                message: 'could not create Task',
            });
        }
    },
};

export default TaskController;
