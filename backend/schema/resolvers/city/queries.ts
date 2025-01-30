import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const CityQueries = builder.queryFields((t) => ({
    cities: t.prismaField({
        type: ['City'],
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query) => {
            return prisma.city.findManyUndeleted(query);
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
                throw new Error('Ciudad no encontrada');
            }
            return city;
        },
    }),
}));
