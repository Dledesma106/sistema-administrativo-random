import { prisma } from 'lib/prisma';

import { builder } from '../builder';

builder.prismaObject('Province', {
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
    }),
});

builder.queryFields((t) => ({
    provinces: t.prismaField({
        type: ['Province'],
        resolve: async (query, _parent, _args, _info) => {
            return prisma.province.findManyUndeleted(query);
        },
    }),
}));
