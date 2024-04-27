import { CityRef } from './refs';

import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

builder.queryFields((t) => ({
    cities: t.prismaField({
        type: [CityRef],
        resolve: async (query, _parent, _args, _info) => {
            return prisma.city.findManyUndeleted(query);
        },
    }),
}));
