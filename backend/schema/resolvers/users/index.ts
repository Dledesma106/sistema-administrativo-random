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
        resolve: async (query, _parent, _args, _info) => {
            return prisma.user.findMany(query);
        },
    }),
}));

const LoginUserPhotosRef = builder
    .objectRef<{
        success: boolean;
        message?: string | null;
        user?: User | null;
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
            const user = await prisma.user.findUnique({
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

            const MAX_AGE_30_DAYS = 60 * 60 * 24 * 30;

            const cookieOptions: CookieListItem = {
                name: 'ras_access_token',
                value: getUserToken(user),
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'lax',
                expires: new Date(Date.now() + MAX_AGE_30_DAYS),
                domain: null,
            };

            await (context as YogaInitialContext).request.cookieStore?.set(cookieOptions);

            return {
                success: true,
                user: user,
                message: null,
            };
        },
    }),
}));
