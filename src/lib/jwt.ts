import { User } from '@prisma/client';
import dayjs from 'dayjs';
import { type JwtPayload, sign, verify } from 'jsonwebtoken';
const secret = process.env.SECRET ?? '';

interface MyJwtPayload extends JwtPayload {
    payload: any;
}

export const getToken = (payload: any): string => {
    return sign(
        {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
            payload,
        },
        secret,
    );
};

export const getUserToken = (
    user: Pick<User, 'id' | 'roles'>,
): {
    token: string;
    expiresAt: Date;
} => {
    const expiresAt = dayjs().add(30, 'days').toDate();

    const token = sign(
        {
            exp: expiresAt,
            payload: {
                userId: user.id.toString(),
                userRoles: user.roles,
            },
        },
        secret,
    );

    return {
        token,
        expiresAt,
    };
};

export const getPayload = (jwt: string): MyJwtPayload => {
    return <MyJwtPayload>verify(jwt, secret);
};
