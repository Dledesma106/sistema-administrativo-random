import { CookieListItem } from '@whatwg-node/cookie-store';
import { compareSync } from 'bcryptjs';
import { YogaInitialContext } from 'graphql-yoga';

import { AuthResultRef, ChangePasswordInputType, LoginUserPothosRef } from './refs';

import { getUserToken } from '@/lib/jwt';
import { comparePassword, hashPassword } from 'backend/lib/auth';
import Mailer from 'lib/nodemailer';
import { prisma } from 'lib/prisma';

import { builder } from '../../builder';
import { UserCrudPothosRef } from '../users/refs';

const USER_ACCESS_TOKEN_COOKIE_NAME = 'ras_access_token';

export const AuthMutations = builder.mutationFields((t) => ({
    login: t.field({
        type: LoginUserPothosRef,
        args: {
            email: t.arg.string({
                required: true,
            }),
            password: t.arg.string({
                required: true,
            }),
        },
        resolve: async (_parent, args, context, _info) => {
            try {
                const { email, password } = args;
                const user = await prisma.user.findUniqueUndeleted({
                    where: {
                        email,
                    },
                });

                if (!user) {
                    return {
                        user: null,
                        success: false,
                        message: 'El usuario no existe',
                    };
                }

                const passwordMatch = compareSync(password, user.password);
                if (!passwordMatch) {
                    return {
                        user: null,
                        success: false,
                        message: 'Contraseña incorrecta',
                    };
                }

                const { token, expiresAt } = getUserToken(user);

                const cookieOptions: CookieListItem = {
                    name: USER_ACCESS_TOKEN_COOKIE_NAME,
                    value: token,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'lax',
                    expires: expiresAt,
                    domain: null,
                    path: '/',
                };

                await (context as YogaInitialContext).request.cookieStore?.set(
                    cookieOptions,
                );

                return {
                    success: true,
                    user: user,
                    message: null,
                    accessToken: token,
                    expiresAt,
                };
            } catch (e) {
                return {
                    success: false,
                    user: null,
                    message: (e as Error).message,
                    accessToken: undefined,
                    expiresAt: undefined,
                };
            }
        },
    }),

    logout: t.field({
        type: AuthResultRef,
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, _args, context) => {
            try {
                const cookieOptions: CookieListItem = {
                    name: USER_ACCESS_TOKEN_COOKIE_NAME,
                    value: '',
                    expires: new Date(0),
                    path: '/',
                    domain: null,
                };

                await context.request.cookieStore?.set(cookieOptions);

                return {
                    success: true,
                    message: 'Sesión cerrada exitosamente',
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al cerrar sesión',
                };
            }
        },
    }),

    changePassword: t.field({
        type: AuthResultRef,
        args: {
            data: t.arg({
                type: ChangePasswordInputType,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { data }, context) => {
            try {
                const user = await prisma.user.findUniqueUndeleted({
                    where: { id: context.user.id },
                });

                if (!user) {
                    return {
                        success: false,
                        message: 'Usuario no encontrado',
                    };
                }

                const passwordMatch = await comparePassword(
                    data.currentPassword,
                    user.password,
                );
                if (!passwordMatch) {
                    return {
                        success: false,
                        message: 'Contraseña actual incorrecta',
                    };
                }

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        password: await hashPassword(data.newPassword),
                    },
                });

                return {
                    success: true,
                    message: 'Contraseña actualizada exitosamente',
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al cambiar la contraseña',
                };
            }
        },
    }),

    sendNewUserRandomPassword: t.field({
        type: UserCrudPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoTecnico'] },
            ],
        },
        resolve: async (_parent, args) => {
            try {
                const { id } = args;

                const existentUser = await prisma.user.findUniqueUndeleted({
                    where: {
                        id,
                    },
                });
                if (!existentUser) {
                    return {
                        success: false,
                        user: null,
                        message: 'El usuario no existe',
                    };
                }

                const randomPassword = Math.random().toString(36).slice(-8);

                const user = await prisma.user.update({
                    where: {
                        id,
                    },
                    data: {
                        password: randomPassword,
                    },
                });

                const sendResult = await Mailer.sendNewUserPassword({
                    email: user.email,
                    fullName: user.fullName,
                    password: randomPassword,
                });

                if (!sendResult.accepted.length) {
                    // Since the email was not sent, we should revert the password change
                    // To do this we should update the user, but since the custom prisma extension
                    // That hashes the password, when the "update" operation is called, it will hash the password again
                    // So instead we should use the "updateMany" operation, which will not hash the password
                    // This is a workaround, but it works
                    await prisma.user.updateMany({
                        where: {
                            id,
                        },
                        data: {
                            password: existentUser.password,
                        },
                    });

                    return {
                        success: false,
                        user: null,
                        message: 'No se pudo enviar el correo',
                    };
                }

                return {
                    success: true,
                    user,
                    message: null,
                };
            } catch (e) {
                return {
                    success: false,
                    user: null,
                    message: (e as Error).message,
                };
            }
        },
    }),
}));
