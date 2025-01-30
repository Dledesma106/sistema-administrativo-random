import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const PreventiveQueries = builder.queryFields((t) => ({
    preventives: t.prismaField({
        type: ['Preventive'],
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query) => {
            return prisma.preventive.findManyUndeleted(query);
        },
    }),

    preventive: t.prismaField({
        type: 'Preventive',
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { id }) => {
            const preventive = await prisma.preventive.findUniqueUndeleted({
                ...query,
                where: { id },
            });
            if (!preventive) {
                throw new Error('Preventivo no encontrado');
            }
            return preventive;
        },
    }),
}));
