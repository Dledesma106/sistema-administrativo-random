import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const ClientQueries = builder.queryFields((t) => ({
    client: t.prismaField({
        type: 'Client',
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { id }) => {
            const client = await prisma.client.findUniqueUndeleted({
                ...query,
                where: { id },
            });

            if (!client) {
                throw new Error('Cliente no encontrado');
            }
            return client;
        },
    }),

    clients: t.prismaField({
        type: ['Client'],
        args: {
            search: t.arg.string({ required: false }),
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { search, skip, take }) => {
            return prisma.client.findMany({
                ...query,
                where: {
                    deleted: false,
                    ...(search && {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    }),
                },
                orderBy: {
                    name: 'asc',
                },
                skip: skip || 0,
                take: take || 10,
            });
        },
    }),

    clientsCount: t.int({
        args: {
            search: t.arg.string({ required: false }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { search }) => {
            return prisma.client.count({
                where: {
                    deleted: false,
                    ...(search && {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    }),
                },
            });
        },
    }),
}));
