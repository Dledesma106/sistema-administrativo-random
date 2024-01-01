import { prisma } from 'lib/prisma';

import { builder } from '../builder';

builder.prismaObject('City', {
    name: 'City',
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        province: t.relation('province'),
    }),
});

builder.queryFields((t) => ({
    cities: t.prismaField({
        type: ['City'],
        resolve: async (query, _parent, _args, _info) => {
            return prisma.city.findMany(query);
        },
    }),
}));
