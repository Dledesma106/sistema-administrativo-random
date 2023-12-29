import { type NextApiResponse } from 'next';

import cookie from 'cookie';

import { NextConnectApiRequest, type UserData } from './interfaces';

import { cookieOptionsLogin, cookieOptionsLogout } from '@/lib/cookies';
import dbConnect from '@/lib/dbConnect';
import { getUserToken } from '@/lib/jwt';
import { mongooseDocumentToJSON } from '@/lib/utils';
import { createToken } from 'backend/jwt';
import UserModel from 'backend/models/User';

import { type IUser } from '../models/interfaces';

const AuthController = {
    login: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        await dbConnect();

        const { email, password } = req.body;
        const user = await UserModel.findOne({
            email,
        })
            .populate([
                {
                    path: 'city',
                    populate: ['province'],
                },
            ])
            .select('+password');

        if (!user) {
            return res.status(403).json({
                error: 'Wrong password/email',
            });
        }

        const passwordMatch = user.comparePassword(password);
        if (!passwordMatch) {
            return res.status(403).json({
                error: 'Wrong password/email',
            });
        }

        const accessToken = createToken(user as IUser);
        res.setHeader(
            'Set-Cookie',
            cookie.serialize('ras_access_token', getUserToken(user), cookieOptionsLogin),
        );

        return res.status(201).json({
            data: {
                accessToken,
                user,
            },
        });
    },
    logout: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { user } = req;
        await user.removePrivateKey();

        res.setHeader(
            'Set-Cookie',
            cookie.serialize('ras_access_token', '', cookieOptionsLogout),
        );
        res.status(201).json({
            data: {
                message: 'successful logout',
            },
        });
    },
    register: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const { password, firstName, lastName, email } = req.body;
        const userData: UserData = {
            password,
            firstName,
            lastName,
            email,
            role: ['Administrativo Tecnico'],
        };

        userData.fullName = `${firstName as string} ${lastName as string}`;
        await dbConnect();
        try {
            const user = await UserModel.create(userData);
            const reducedUser = mongooseDocumentToJSON(user);
            res.status(201).json({
                data: {
                    user: reducedUser,
                },
                statusCode: 201,
            });
        } catch (error) {
            res.status(500).json({
                error: 'failed to create user',
                statusCode: 500,
            });
        }
    },
    changePassword: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { currentPassword, newPassword },
            user,
        } = req;

        user.password = (await UserModel.findById(user._id).select('+password'))
            ?.password as string;

        try {
            if (!user.comparePassword(currentPassword)) {
                return res.status(403).json({
                    message: 'Wrong password',
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Server error',
            });
        }

        user.password = newPassword;
        await user.save();
        return res.status(200).json({
            statusCode: 200,
            data: {
                message: 'Correct password',
            },
        });
    },
};

export default AuthController;
