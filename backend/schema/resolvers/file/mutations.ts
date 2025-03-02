import { FileInputRef, FileCrudRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const FileMutations = builder.mutationFields((t) => ({
    createFile: t.field({
        type: FileCrudRef,
        args: {
            input: t.arg({
                type: FileInputRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { input }) => {
            try {
                const file = await prisma.file.create({
                    data: {
                        key: input.key,
                        filename: input.filename,
                        mimeType: input.mimeType,
                        size: input.size,
                        url: input.url,
                    },
                });
                return {
                    success: true,
                    file,
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al crear el archivo',
                };
            }
        },
    }),

    deleteFile: t.field({
        type: FileCrudRef,
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { id }) => {
            try {
                const file = await prisma.file.update({
                    where: { id },
                    data: {
                        deleted: true,
                        deletedAt: new Date(),
                    },
                });
                return {
                    success: true,
                    file,
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al eliminar el archivo',
                };
            }
        },
    }),
}));
