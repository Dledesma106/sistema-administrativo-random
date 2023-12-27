import { type NextApiResponse } from 'next';

import { nanoid } from 'nanoid';

import { NextConnectApiRequest } from './interfaces';

import dbConnect from '@/lib/dbConnect';
import Mailer from '@/lib/nodemailer';
import { formatIds } from '@/lib/utils';

import UserModel from '../models/User';

const UserController = {
    getLoggedInUser: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();
        try {
            const docUser = await UserModel.findById(req.userId);
            if (docUser == null) {
                return res.json({ error: 'no user found', statusCode: 402 });
            }
            res.status(200).json({
                data: { user: formatIds(docUser), message: 'User found' },
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
        if (docUser == null) {
            return res.status(400).json({ error: 'User not found', statusCode: 400 });
        }
        const user = formatIds(docUser);
        res.status(200).json({ data: { user, message: 'User found' }, statusCode: 200 });
    },
    putUser: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id, firstName, lastName, city, roles, email },
        } = req;
        await dbConnect();
        const docUser = await UserModel.findByIdAndUpdate(
            _id,
            { firstName, lastName, city, roles, email },
            {
                new: true,
                runValidators: true,
            },
        );
        if (docUser == null) {
            return res
                .status(400)
                .json({ error: 'failed to update user', statusCode: 400 });
        }
        res.status(200).json({ data: { user: formatIds(docUser) }, statusCode: 200 });
    },
    postUser: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { firstName, lastName, city, roles, email },
        } = req;
        const password = nanoid(10);
        const fullName = `${firstName as string} ${lastName as string}`;
        const newUser = { firstName, lastName, fullName, city, roles, email, password };
        await dbConnect();
        const deletedUser = await UserModel.findOne({ email });
        if (deletedUser != null) {
            deletedUser.firstName = firstName;
            deletedUser.lastName = lastName;
            deletedUser.fullName = fullName;
            deletedUser.city = city._id;
            deletedUser.roles = roles;
            deletedUser.password = password;
            await Mailer.sendNewUserPassword(formatIds(deletedUser));
            await deletedUser.restore();
            return res
                .status(200)
                .json({ data: { user: formatIds(deletedUser) }, statusCode: 200 });
        }
        try {
            const docUser = await UserModel.create(newUser);
            if (docUser === undefined) {
                return res
                    .status(400)
                    .json({ error: 'failed to create user', statusCode: 400 });
            }
            await Mailer.sendNewUserPassword(newUser);
            res.status(200).json({ data: { user: formatIds(docUser) }, statusCode: 200 });
        } catch (e) {
            console.log(e);
        }
    },
    deleteUser: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id },
        } = req;
        await dbConnect();
        const docUser = await UserModel.findById(_id);
        if (docUser == null) {
            return res
                .status(400)
                .json({ error: 'failed to delete user', statusCode: 400 });
        }
        await docUser.softDelete();
        res.status(200).json({ data: { user: formatIds(docUser) }, statusCode: 200 });
    },
    generateNewPassword: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { _id },
        } = req;
        await dbConnect();
        const user = await UserModel.findById(_id);
        if (user == null) {
            return res.json({ error: 'no user found', statusCode: 400 });
        }
        const newPassword = nanoid(10);
        user.password = newPassword;
        const { firstName, lastName, fullName, email, password } = user;
        const newUser = { firstName, lastName, fullName, email, password };
        try {
            await user.updateOne(newUser);
            await Mailer.sendResetPassword(newUser);
            res.status(200).json({ data: { user: formatIds(user) }, statusCode: 200 });
        } catch (error) {
            res.json({ error: 'could not generate new password', statusCode: 400 });
        }
    },
};

export default UserController;
