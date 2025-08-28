import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const ProvinceQueries = builder.queryFields((t) => ({
    provinces: t.prismaField({
        type: ['Province'],
        args: {
            search: t.arg.string({ required: false }),
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { search, skip, take }) => {
            return prisma.province.findManyUndeleted({
                ...query,
                where: {
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

    provincesCount: t.int({
        args: {
            search: t.arg.string({ required: false }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { search }) => {
            return prisma.province.count({
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

    province: t.prismaField({
        type: 'Province',
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { id }) => {
            const province = await prisma.province.findUniqueUndeleted({
                ...query,
                where: { id },
            });

            if (!province) {
                throw new Error('Provincia no encontrada');
            }

            return province;
        },
    }),
}));
