import { File } from '@prisma/client';

import { getFileSignedUrl } from 'backend/s3Client';
import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const FileRef = builder.prismaObject('File', {
    fields: (t) => ({
        id: t.exposeID('id'),
        createdAt: t.expose('createdAt', { type: 'Date' }),
        updatedAt: t.expose('updatedAt', { type: 'Date' }),
        key: t.exposeString('key'),
        filename: t.exposeString('filename'),
        mimeType: t.exposeString('mimeType'),
        size: t.exposeInt('size'),
        url: t.string({
            resolve: async (parent) => {
                const { url, urlExpire } = await getFileSignedUrl(
                    parent.key,
                    parent.mimeType,
                );
                await prisma.file.update({
                    where: { id: parent.id },
                    data: {
                        url,
                        urlExpire,
                    },
                });
                return url;
            },
        }),
        urlExpire: t.expose('urlExpire', {
            type: 'Date',
            nullable: true,
        }),
        expenses: t.relation('expenses'),
    }),
});

export const FileInputRef = builder.inputType('FileInput', {
    fields: (t) => ({
        key: t.string({ required: true }),
        filename: t.string({ required: true }),
        mimeType: t.string({ required: true }),
        size: t.int({ required: true }),
        url: t.string({ required: true }),
    }),
});

export const FileCrudRef = builder
    .objectRef<{
        success: boolean;
        message?: string | null;
        file?: File | null;
    }>('FileCrudRef')
    .implement({
        fields: (t) => ({
            success: t.exposeBoolean('success'),
            message: t.exposeString('message', { nullable: true }),
            file: t.field({
                type: FileRef,
                nullable: true,
                resolve: (parent) => parent.file,
            }),
        }),
    });
