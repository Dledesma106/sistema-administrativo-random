import { prisma } from 'lib/prisma';

import { builder } from '../builder';

builder.prismaObject('Image', {
    name: 'Image',
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        url: t.exposeString('url'),
    }),
});

builder.queryFields((t) => ({
    images: t.prismaField({
        type: ['Image'],
        resolve: async (query, _parent, _args, _info) => {
            return prisma.image.findMany(query);
        },
    }),
}));
