import { prisma } from 'lib/prisma';

import { builder } from '../builder';

builder.prismaObject('Branch', {
    name: 'Branch',
    fields: (t) => ({
        id: t.exposeID('id'),
        number: t.exposeInt('number'),
        client: t.relation('client'),
        city: t.relation('city'),
        businesses: t.prismaField({
            type: ['Business'],
            resolve: async (query, root) => {
                return prisma.business.findManyUndeleted({
                    ...query,
                    where: {
                        id: {
                            in: root.businessesIDs,
                        },
                    },
                });
            },
        }),
    }),
});

builder.queryFields((t) => ({
    branches: t.prismaField({
        type: ['Branch'],
        resolve: async (query, _parent, _args, _info) => {
            return prisma.branch.findManyUndeleted(query);
        },
    }),
}));
