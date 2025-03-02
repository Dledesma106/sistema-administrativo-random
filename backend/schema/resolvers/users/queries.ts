import { RolePothosRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const UserQueries = builder.queryFields((t) => ({
    users: t.prismaField({
        type: ['User'],
        args: {
            search: t.arg.string({ required: false }),
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
            cityId: t.arg({
                type: ['String'],
                required: false,
            }),
            roles: t.arg({
                type: [RolePothosRef],
                required: false,
            }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { search, skip, take, cityId, roles }) => {
            return prisma.user.findManyUndeleted({
                ...query,
                where: {
                    ...(search && {
                        OR: [
                            {
                                fullName: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                email: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    }),
                    ...(cityId && {
                        cityId: {
                            in: cityId,
                        },
                    }),
                    ...(roles &&
                        roles.length > 0 && {
                            roles: {
                                hasEvery: roles,
                            },
                        }),
                },
                orderBy: {
                    fullName: 'asc',
                },
                skip: skip || 0,
                take: take || 10,
            });
        },
    }),

    usersCount: t.int({
        args: {
            search: t.arg.string({ required: false }),
            cityId: t.arg({
                type: ['String'],
                required: false,
            }),
            roles: t.arg({
                type: [RolePothosRef],
                required: false,
            }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { search, cityId, roles }) => {
            return prisma.user.count({
                where: {
                    deleted: false,
                    ...(search && {
                        OR: [
                            {
                                fullName: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                email: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    }),
                    ...(cityId && {
                        cityId: {
                            in: cityId,
                        },
                    }),
                    ...(roles &&
                        roles.length > 0 && {
                            roles: {
                                hasEvery: roles,
                            },
                        }),
                },
            });
        },
    }),

    technicians: t.prismaField({
        type: ['User'],
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, _args, _info) => {
            return prisma.user.findManyUndeleted({
                where: { roles: { has: 'Tecnico' } },
                ...query,
            });
        },
    }),

    user: t.prismaField({
        type: 'User',
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { id }, _info) => {
            const user = await prisma.user.findUniqueUndeleted({
                ...query,
                where: { id },
            });

            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return user;
        },
    }),
}));
