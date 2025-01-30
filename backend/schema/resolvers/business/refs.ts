import { Business } from '@prisma/client';

import { builder } from '../../builder';

export const BusinessRef = builder.prismaObject('Business', {
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        branchesIDs: t.exposeStringList('branchesIDs', { nullable: true }),
        createdAt: t.expose('createdAt', { type: 'Date' }),
        updatedAt: t.expose('updatedAt', { type: 'Date' }),
        deletedAt: t.expose('deletedAt', {
            type: 'Date',
            nullable: true,
        }),
    }),
});

export const BusinessInputType = builder.inputType('BusinessInput', {
    fields: (t) => ({
        name: t.string({ required: true }),
    }),
});

export const BusinessResultRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        business?: Business;
    }>('BusinessResult')
    .implement({
        fields: (t) => ({
            success: t.exposeBoolean('success'),
            message: t.exposeString('message', { nullable: true }),
            business: t.field({
                type: BusinessRef,
                nullable: true,
                resolve: (parent) => parent.business || null,
            }),
        }),
    });
