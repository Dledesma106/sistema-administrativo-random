import { Client } from '@prisma/client';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const ClientRef = builder.prismaObject('Client', {
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        createdAt: t.expose('createdAt', { type: 'Date' }),
        updatedAt: t.expose('updatedAt', { type: 'Date' }),
        deletedAt: t.expose('deletedAt', {
            type: 'Date',
            nullable: true,
        }),
        branches: t.prismaField({
            type: ['Branch'],
            resolve: async (root, parent, query) => {
                const branches = await prisma.branch.findManyUndeleted({
                    where: {
                        clientId: parent.id,
                    },
                    ...query,
                });
                return branches;
            },
        }),
    }),
});

export const ClientInputType = builder.inputType('ClientInput', {
    fields: (t) => ({
        name: t.string({ required: true }),
    }),
});

export const ClientResultRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        client?: Client;
    }>('ClientResult')
    .implement({
        fields: (t) => ({
            success: t.exposeBoolean('success'),
            message: t.exposeString('message', { nullable: true }),
            client: t.field({
                type: ClientRef,
                nullable: true,
                resolve: (parent) => parent.client || null,
            }),
        }),
    });
