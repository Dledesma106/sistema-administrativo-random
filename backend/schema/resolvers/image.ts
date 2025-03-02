import { createImageSignedUrlAsync } from 'backend/s3Client';
import { prisma } from 'lib/prisma';

import { builder } from '../builder';

export const ImagePothosRef = builder.prismaObject('Image', {
    name: 'Image',
    fields: (t) => ({
        id: t.exposeID('id'),
        url: t.string({
            resolve: async (parent) => {
                if (parent.urlExpire && new Date(parent.urlExpire) > new Date()) {
                    return parent.url;
                }
                const { url, urlExpire } = await createImageSignedUrlAsync(parent.key);
                await prisma.image.update({
                    where: { id: parent.id },
                    data: {
                        url,
                        urlExpire,
                    },
                });
                return url;
            },
        }),
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
