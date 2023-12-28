import { type NextApiResponse } from 'next';

import { nanoid } from 'nanoid';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import Mailer from '@/lib/nodemailer';
import { mongooseDocumentToJSON } from '@/lib/utils';
import { IUser } from 'backend/models/interfaces';

import UserModel from '../models/User';

const UserController = {
    getLoggedInUser: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();
        try {
            const docUser = await UserModel.findById(req.userId);
            if (docUser === null) {
                return res.json({
                    error: 'no user found',
                    statusCode: 402,
                });
            }
            res.status(200).json({
                data: {
                    user: mongooseDocumentToJSON(docUser),
                    message: 'User found',
                },
                statusCode: 200,
            });
        } catch (error) {}
    },
    getUser: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            query: { id },
        } = req;
        await dbConnect();
        const docUser = await UserModel.findById(id);
        if (docUser === null) {
            return res.status(400).json({
                error: 'User not found',
                statusCode: 400,
            });
        }
        const user = mongooseDocumentToJSON(docUser);
        res.status(200).json({
            data: {
                user,
                message: 'User found',
            },
            statusCode: 200,
        });
    },
    putUser: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id, firstName, lastName, city, roles, email, password },
        } = req;
        await dbConnect();

        const docUser = await UserModel.findByIdAndUpdate(
            _id,
            {
                firstName,
                lastName,
                city,
                roles,
                email,
            },
            {
                new: true,
                runValidators: true,
            },
        );

        if (docUser === null) {
            return res.status(400).json({
                error: 'failed to update user',
                statusCode: 400,
            });
        }

        if (password && docUser !== null) {
            docUser.password = password;
            await docUser.save();
        }

        docUser.populate('city');
        docUser.password = password;

        res.status(200).json({
            data: {
                user: mongooseDocumentToJSON(docUser),
            },
            statusCode: 200,
        });
    },
    postUser: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        const {
            body: { firstName, lastName, city, roles, email, password },
        } = req;

        const existentUser = await UserModel.findOne({
            email,
        });
        if (existentUser) {
            return res.status(400).json({
                error: 'User already exists',
                statusCode: 400,
            });
        }

        const newUser = (await (
            await UserModel.create({
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
                city,
                roles,
                email,
                password,
            })
        ).populate('city')) as IUser;

        if (!newUser) {
            return res.status(500).json({
                error: 'failed to create user',
            });
        }

        newUser.password = password;

        await Mailer.sendNewUserPassword(mongooseDocumentToJSON(newUser));
        return res.status(201).json({
            data: mongooseDocumentToJSON(newUser),
        });
    },
    deleteUser: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id },
        } = req;
        await dbConnect();
        const docUser = await UserModel.findById(_id);
        if (docUser === null) {
            return res.status(400).json({
                error: 'failed to delete user',
                statusCode: 400,
            });
        }
        await docUser.softDelete();
        res.status(200).json({
            data: {
                user: mongooseDocumentToJSON(docUser),
            },
            statusCode: 200,
        });
    },
    generateNewPassword: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id },
        } = req;
        await dbConnect();
        const user = await UserModel.findById(_id);
        if (user === null) {
            return res.json({
                error: 'no user found',
                statusCode: 400,
            });
        }
        const newPassword = nanoid(10);
        user.password = newPassword;
        const { firstName, lastName, fullName, email, password } = user;
        const newUser = {
            firstName,
            lastName,
            fullName,
            email,
            password,
        };
        try {
            await user.updateOne(newUser);
            await Mailer.sendResetPassword(newUser);
            res.status(200).json({
                data: {
                    user: mongooseDocumentToJSON(user),
                },
                statusCode: 200,
            });
        } catch (error) {
            res.json({
                error: 'could not generate new password',
                statusCode: 400,
            });
        }
    },
};

export default UserController;
