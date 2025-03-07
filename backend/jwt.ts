import { User } from '@prisma/client';
import { verify, sign } from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';
const TTL = process.env.JWT_TTL ? parseInt(process.env.JWT_TTL) : '30d';

export const verifyToken = (token: string) => verify(token, SECRET);
export const createToken = (user: User) => {
    return sign({ user }, SECRET, {
        expiresIn: TTL,
    });
};
