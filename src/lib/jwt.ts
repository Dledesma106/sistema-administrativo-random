import { User } from '@prisma/client';
import dayjs from 'dayjs';
import { type JwtPayload, sign, verify } from 'jsonwebtoken';
const secret = process.env.SECRET ?? '';

interface MyJwtPayload extends JwtPayload {
    payload: {
        userId: string;
        userRoles: string[];
    };
}

export const getUserToken = (
    user: Pick<User, 'id' | 'roles'>,
): {
    token: string;
    expiresAt: Date;
} => {
    const expiresAt = dayjs().add(30, 'days');

    const token = sign(
        {
            exp: expiresAt.unix(),
            payload: {
                userId: user.id.toString(),
                userRoles: user.roles,
            },
        },
        secret,
    );

    return {
        token,
        expiresAt: expiresAt.toDate(),
    };
};

export const getPayload = (jwt: string): MyJwtPayload => {
    return <MyJwtPayload>verify(jwt, secret);
};
