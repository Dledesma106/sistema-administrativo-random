import { verify, sign } from 'jsonwebtoken';

import { IUser } from './models/interfaces';

const SECRET = process.env.JWT_SECRET || 'secret';
const TTL = process.env.JWT_TTL || '30d';

export const verifyToken = (token: string) => verify(token, SECRET);
export const createToken = (user: IUser) => {
    delete user.password;

    return sign({ user }, SECRET, {
        expiresIn: TTL,
    });
};
