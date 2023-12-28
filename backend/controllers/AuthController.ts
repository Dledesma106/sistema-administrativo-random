import { type NextApiResponse } from 'next';

import cookie from 'cookie';
import RSA from 'node-rsa';

import { NextConnectApiRequest, type UserData } from './interfaces';

import { cookieOptionsLogin, cookieOptionsLogout } from '@/lib/cookies';
import dbConnect from '@/lib/dbConnect';
import { getPayload, getUserToken } from '@/lib/jwt';
import { mongooseDocumentToJSON } from '@/lib/utils';
import { createToken, verifyToken } from 'backend/jwt';
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
        /* create a new model in the database */
        try {
            const user = await UserModel.create(userData);
            const reducedUser: IUser = mongooseDocumentToJSON(user);
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
    checkPassword: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { currentPassword },
            userId,
        } = req;
        const user = await UserModel.findById(userId).select('+password +privateKey');
        if (user === null) {
            return res.status(403).json({
                error: 'no user found',
                statusCode: 403,
            });
        }
        const key = new RSA();
        const privateKey = getPayload(user.privateKey).payload as string;
        key.importKey(privateKey, 'private');
        const decryptedPassword = key.decrypt(currentPassword, 'utf8');
        const passwordMatch = user.comparePassword(decryptedPassword);
        if (!passwordMatch) {
            return res.status(403).json({
                statusCode: 403,
                error: 'Wrong password',
            });
        }
        return res.status(200).json({
            statusCode: 200,
            data: {
                message: 'Correct password',
            },
        });
    },
    changePassword: async (req: NextConnectApiRequest, res: NextApiResponse) => {
        const {
            body: { currentPassword, newPassword },
            user,
        } = req;

        if (!user.comparePassword(currentPassword)) {
            return res.status(403).json({
                message: 'Wrong password',
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
