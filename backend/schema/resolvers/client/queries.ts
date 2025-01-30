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
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query) => {
            return prisma.client.findMany({
                ...query,
                orderBy: {
                    name: 'asc',
                },
            });
        },
    }),
}));
