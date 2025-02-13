import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const BusinessQueries = builder.queryFields((t) => ({
    businesses: t.prismaField({
        type: ['Business'],
        args: {
            search: t.arg.string({ required: false }),
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { search, skip, take }) => {
            return prisma.business.findMany({
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

    businessesCount: t.int({
        args: {
            search: t.arg.string({ required: false }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { search }) => {
            return prisma.business.count({
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

    business: t.prismaField({
        type: 'Business',
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { id }) => {
            const business = await prisma.business.findUniqueUndeleted({
                ...query,
                where: { id },
            });

            if (!business) {
                throw new Error('Empresa no encontrada');
            }

            return business;
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
