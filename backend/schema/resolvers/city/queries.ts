import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const CityQueries = builder.queryFields((t) => ({
    cities: t.prismaField({
        type: ['City'],
        args: {
            search: t.arg.string({ required: false }),
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
            provinceId: t.arg.string({ required: false }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { search, skip, take, provinceId }) => {
            return prisma.city.findMany({
                ...query,
                where: {
                    deleted: false,
                    ...(search && {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    }),
                    ...(provinceId && {
                        provinceId,
                    }),
                },
                orderBy: {
                    name: 'asc',
                },
                ...(typeof skip === 'number' &&
                    typeof take === 'number' && {
                        skip,
                        take,
                    }),
            });
        },
    }),

    citiesCount: t.int({
        args: {
            search: t.arg.string({ required: false }),
            provinceId: t.arg.string({ required: false }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { search, provinceId }) => {
            return prisma.city.count({
                where: {
                    deleted: false,
                    ...(search && {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    }),
                    ...(provinceId && {
                        provinceId,
                    }),
                },
            });
        },
    }),

    city: t.prismaField({
        type: 'City',
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { id }) => {
            const city = await prisma.city.findUniqueUndeleted({
                ...query,
                where: { id },
            });

            if (!city) {
                throw new Error('Localidad no encontrada');
            }

            return city;
        },
    }),
}));
