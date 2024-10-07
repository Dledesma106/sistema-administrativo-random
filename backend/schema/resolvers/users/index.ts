import { User, Role } from '@prisma/client';
import { CookieListItem } from '@whatwg-node/cookie-store';
import { compareSync } from 'bcryptjs';
import { YogaInitialContext } from 'graphql-yoga';

import { getUserToken } from '@/lib/jwt';
import Mailer from 'lib/nodemailer';
import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const RolePothosRef = builder.enumType('Role', {
    values: Object.fromEntries(
        Object.entries(Role).map(([name, value]) => [name, { value }]),
    ),
});

export const UserPothosRef = builder.prismaObject('User', {
    fields: (t) => ({
        id: t.exposeID('id'),
        email: t.exposeString('email'),
        firstName: t.exposeString('firstName'),
        lastName: t.exposeString('lastName'),
        fullName: t.exposeString('fullName'),
        city: t.relation('city', {
            nullable: true,
        }),
        roles: t.field({
            type: [RolePothosRef],
            resolve: (root: User) => {
                return root.roles as Role[];
            },
        }),
    }),
});

builder.queryFields((t) => ({
    users: t.prismaField({
        type: ['User'],
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, _args, _info) => {
            return prisma.user.findManyUndeleted(query);
        },
    }),
}));

const LoginUserPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string | null;
        user?: User | null;
        accessToken?: string;
        expiresAt?: Date;
    }>('LoginUserResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            user: t.field({
                type: UserPothosRef,
                nullable: true,
                resolve: (result) => result.user,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
            accessToken: t.string({
                nullable: true,
                resolve: (result) => result.accessToken,
            }),
            expiresAt: t.field({
                type: 'DateTime',
                nullable: true,
                resolve: (result) => result.expiresAt,
            }),
        }),
    });

const UserInputPothosRef = builder.inputType('UserInput', {
    fields: (t) => ({
        email: t.string({
            required: true,
        }),
        firstName: t.string({
            required: true,
        }),
        lastName: t.string({
            required: true,
        }),
        roles: t.field({
            type: [RolePothosRef],
            required: true,
        }),
        city: t.string({
            required: true,
        }),
    }),
});

const UserCrudPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string | null;
        user?: User | null;
    }>('UserCrudPothosRef')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            user: t.field({
                type: UserPothosRef,
                nullable: true,
                resolve: (result) => result.user,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
        }),
    });

builder.mutationFields((t) => ({
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
    createUser: t.field({
        type: UserCrudPothosRef,
        args: {
            input: t.arg({
                type: UserInputPothosRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, args) => {
            try {
                const { email, firstName, lastName, roles, city } = args.input;

                const userExists = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                });

                let user: User | null = null;

                const randomPassword = Math.random().toString(36).slice(-8);
                if (userExists && userExists.deleted) {
                    user = await prisma.user.update({
                        where: {
                            id: userExists.id,
                        },
                        data: {
                            deleted: false,
                            firstName,
                            lastName,
                            fullName: `${firstName} ${lastName}`,
                            roles: {
                                set: roles,
                            },
                            password: randomPassword,
                            city: {
                                connect: {
                                    id: city,
                                },
                            },
                        },
                    });
                } else if (userExists) {
                    return {
                        success: false,
                        user: null,
                        message: 'El usuario ya existe',
                    };
                } else {
                    user = await prisma.user.create({
                        data: {
                            email,
                            password: randomPassword,
                            firstName,
                            lastName,
                            fullName: `${firstName} ${lastName}`,
                            roles: {
                                set: roles,
                            },
                            city: {
                                connect: {
                                    id: city,
                                },
                            },
                        },
                    });
                }

                Mailer.sendNewUserPassword({
                    email,
                    fullName: user.fullName,
                    password: randomPassword,
                });

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
    updateUser: t.field({
        type: UserCrudPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
            input: t.arg({
                type: UserInputPothosRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, args) => {
            try {
                const { id } = args;
                const { email, firstName, lastName, roles, city } = args.input;

                const userExists = await prisma.user.findUniqueUndeleted({
                    where: {
                        id,
                    },
                });
                if (!userExists) {
                    return {
                        success: false,
                        user: null,
                        message: 'El usuario no existe',
                    };
                }

                const user = await prisma.user.update({
                    where: {
                        id,
                    },
                    data: {
                        email,
                        firstName,
                        lastName,
                        fullName: `${firstName} ${lastName}`,
                        roles: {
                            set: roles,
                        },
                        city: {
                            connect: {
                                id: city,
                            },
                        },
                    },
                });

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
    sendNewUserRandomPassword: t.field({
        type: UserCrudPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
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

export const USER_ACCESS_TOKEN_COOKIE_NAME = 'ras_access_token';
