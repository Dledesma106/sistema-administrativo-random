import { prisma } from 'lib/prisma';

import { builder } from '../builder';

builder.prismaObject('Business', {
    name: 'Business',
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
    }),
});

builder.queryFields((t) => ({
    businesses: t.prismaField({
        type: ['Business'],
        resolve: async (query, _parent, _args, _info) => {
            return prisma.business.findMany(query);
        },
    }),
}));
