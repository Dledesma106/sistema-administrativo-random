import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const UserQueries = builder.queryFields((t) => ({
    users: t.prismaField({
        type: ['User'],
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, _args, _info) => {
            return prisma.user.findManyUndeleted(query);
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
