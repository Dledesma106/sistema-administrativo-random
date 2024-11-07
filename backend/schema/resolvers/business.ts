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
