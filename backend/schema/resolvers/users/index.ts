import { User, Role } from '@prisma/client';
import { CookieListItem } from '@whatwg-node/cookie-store';
import { compareSync } from 'bcryptjs';
import { YogaInitialContext } from 'graphql-yoga';

import { getUserToken } from '@/lib/jwt';
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

const LoginUserPhotosRef = builder
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

builder.mutationFields((t) => ({
    login: t.field({
        type: LoginUserPhotosRef,
        args: {
            email: t.arg.string({
                required: true,
            }),
            password: t.arg.string({
                required: true,
            }),
        },
        resolve: async (_parent, args, context, _info) => {
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
            };

            await (context as YogaInitialContext).request.cookieStore?.set(cookieOptions);

            return {
                success: true,
                user: user,
                message: null,
                accessToken: token,
                expiresAt,
            };
        },
    }),
}));

export const USER_ACCESS_TOKEN_COOKIE_NAME = 'ras_access_token';
