import { prisma } from 'lib/prisma';

import { builder } from '../builder';

export const ImagePothosRef = builder.prismaObject('Image', {
    name: 'Image',
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        url: t.exposeString('url'),
        urlExpire: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.urlExpire,
        }),
        key: t.exposeString('key'),
    }),
});

builder.queryFields((t) => ({
    images: t.prismaField({
        type: ['Image'],
        resolve: async (query, _parent, _args, _info) => {
            return prisma.image.findManyUndeleted(query);
        },
    }),
}));
