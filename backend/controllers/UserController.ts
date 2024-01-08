import { type NextApiResponse } from 'next';

import { nanoid } from 'nanoid';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import { mongooseDocumentToJSON } from '@/lib/utils';
import Mailer from 'lib/nodemailer';

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
            return res.status(200).json({
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
        return res.status(200).json({
            data: {
                user,
                message: 'User found',
            },
            statusCode: 200,
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
        return res.status(200).json({
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
            await Mailer.sendResetPassword(newUser as any);
            return res.status(200).json({
                data: {
                    user: mongooseDocumentToJSON(user),
                },
                statusCode: 200,
            });
        } catch (error) {
            return res.json({
                error: 'could not generate new password',
                statusCode: 400,
            });
        }
    },
};

export default UserController;
