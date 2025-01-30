import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const BusinessQueries = builder.queryFields((t) => ({
    business: t.prismaField({
        type: 'Business',
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { id }) => {
            const business = await prisma.business.findUniqueOrThrow({
                ...query,
                where: { id },
            });
            return business;
        },
    }),

    businesses: t.prismaField({
        type: ['Business'],
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query) => {
            return prisma.business.findMany({
                ...query,
                orderBy: {
                    name: 'asc',
                },
            });
        },
    }),

    branchBusinesses: t.prismaField({
        type: ['Business'],
        args: {
            branch: t.arg.string({
                required: false,
            }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, parent, args) => {
            if (args.branch) {
                return prisma.business.findManyUndeleted({
                    ...query,
                    where: {
                        branchesIDs: {
                            has: args.branch,
                        },
                    },
                });
            }

            return prisma.business.findManyUndeleted(query);
        },
    }),
}));
