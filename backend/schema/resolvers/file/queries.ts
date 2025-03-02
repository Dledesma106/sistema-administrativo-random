import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const FileQueries = builder.queryFields((t) => ({
    files: t.prismaField({
        type: ['File'],
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query) => {
            return prisma.file.findManyUndeleted(query);
        },
    }),

    file: t.prismaField({
        type: 'File',
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { id }) => {
            const file = await prisma.file.findUniqueUndeleted({
                ...query,
                where: { id },
            });
            if (!file) {
                throw new Error('Archivo no encontrado');
            }
            return file;
        },
    }),
}));
