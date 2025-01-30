import { Branch } from '@prisma/client';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const BranchPothosRef = builder.prismaObject('Branch', {
    name: 'Branch',
    fields: (t) => ({
        id: t.exposeID('id'),
        number: t.exposeInt('number'),
        client: t.relation('client'),
        city: t.relation('city'),
        businesses: t.prismaField({
            type: ['Business'],
            resolve: async (query, parent) => {
                return prisma.business.findManyUndeleted({
                    where: { id: { in: parent.businessesIDs } },
                    ...query,
                });
            },
        }),
    }),
});

export const BranchInputPothosRef = builder.inputType('BranchInput', {
    fields: (t) => ({
        number: t.int({ required: true }),
        clientId: t.string({ required: true }),
        cityId: t.string({ required: true }),
        businessesIds: t.stringList({ required: true }),
    }),
});

export const BranchCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        branch?: Branch;
    }>('BranchCrudResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            branch: t.field({
                type: BranchPothosRef,
                nullable: true,
                resolve: (result) => result.branch,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
        }),
    });
