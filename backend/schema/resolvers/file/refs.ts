import { File } from '@prisma/client';

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
        url: t.exposeString('url'),
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
