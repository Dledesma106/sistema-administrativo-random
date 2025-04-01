import { FileInputRef, FileCrudRef } from './refs';

import { createUploadPresignedUrl } from 'backend/s3Client';
import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

// Crear un tipo para la información de URL
const UploadUrlInfoRef = builder.objectRef<{
    url: string;
    key: string;
    urlExpire: string;
}>('UploadUrlInfo');

builder.objectType(UploadUrlInfoRef, {
    fields: (t) => ({
        url: t.exposeString('url'),
        key: t.exposeString('key'),
        urlExpire: t.exposeString('urlExpire'),
    }),
});

// Crear un tipo para la respuesta de URLs presignadas
const PresignedUrlResponseRef = builder.objectRef<{
    success: boolean;
    message?: string;
    uploadUrls: Array<{
        url: string;
        key: string;
        urlExpire: string;
    }>;
}>('PresignedUrlResponse');

builder.objectType(PresignedUrlResponseRef, {
    fields: (t) => ({
        success: t.exposeBoolean('success'),
        message: t.exposeString('message', { nullable: true }),
        uploadUrls: t.field({
            type: [UploadUrlInfoRef],
            resolve: (parent) => parent.uploadUrls,
        }),
    }),
});

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

    // Mutación para generar URLs presignadas
    generateUploadUrls: t.field({
        type: PresignedUrlResponseRef,
        args: {
            fileCount: t.arg.int({ required: true }),
            prefix: t.arg.string({ required: true }),
            mimeTypes: t.arg.stringList({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { fileCount, prefix, mimeTypes }) => {
            try {
                if (fileCount <= 0 || fileCount > 10) {
                    return {
                        success: false,
                        message: 'El número de archivos debe estar entre 1 y 10',
                        uploadUrls: [],
                    };
                }

                if (mimeTypes.length !== fileCount) {
                    return {
                        success: false,
                        message:
                            'La cantidad de tipos MIME debe coincidir con la cantidad de archivos',
                        uploadUrls: [],
                    };
                }

                const uploadUrls = await Promise.all(
                    Array.from({ length: fileCount }).map(async (_, index) => {
                        // Generar un nombre de archivo único
                        const uniqueKey = `${prefix}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${index + 1}`;
                        return createUploadPresignedUrl(uniqueKey, mimeTypes[index]);
                    }),
                );

                return {
                    success: true,
                    uploadUrls,
                };
            } catch (error) {
                console.error('Error al generar URLs presignadas:', error);
                return {
                    success: false,
                    message: 'Error al generar las URLs para subir archivos',
                    uploadUrls: [],
                };
            }
        },
    }),
}));
