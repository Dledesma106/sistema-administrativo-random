import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const PreventiveQueries = builder.queryFields((t) => ({
    preventives: t.prismaField({
        type: ['Preventive'],
        args: {
            skip: t.arg.int({ defaultValue: 0 }),
            take: t.arg.int({ defaultValue: 10 }),
            business: t.arg.stringList(),
            city: t.arg.stringList(),
            assigned: t.arg.stringList(),
            client: t.arg.stringList(),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (
            query,
            _parent,
            { skip, take, business, city, assigned, client },
        ) => {
            return prisma.preventive.findManyUndeleted({
                ...query,
                skip: skip || 0,
                take: take || 10,
                where: {
                    AND: [
                        business ? { businessId: { in: business } } : {},
                        city ? { branch: { cityId: { in: city } } } : {},
                        assigned ? { assignedIDs: { hasSome: assigned } } : {},
                        client ? { branch: { clientId: { in: client } } } : {},
                    ],
                },
            });
        },
    }),

    preventivesCount: t.int({
        args: {
            business: t.arg.stringList(),
            city: t.arg.stringList(),
            assigned: t.arg.stringList(),
            client: t.arg.stringList(),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { business, city, assigned, client }) => {
            return prisma.preventive.count({
                where: {
                    AND: [
                        business ? { businessId: { in: business } } : {},
                        city ? { branch: { cityId: { in: city } } } : {},
                        assigned ? { assignedIDs: { hasSome: assigned } } : {},
                        client ? { branch: { clientId: { in: client } } } : {},
                    ],
                    deleted: false,
                },
            });
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
