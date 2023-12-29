import { CookieOptions } from 'express';

const MAX_AGE_30_DAYS = 60 * 60 * 24 * 30;

export const cookieOptionsLogin: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
    maxAge: MAX_AGE_30_DAYS,
    path: '/',
};

export const cookieOptionsLogout: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
};
