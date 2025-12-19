import { ServiceOrder, ServiceOrderStatus } from '@prisma/client';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';
import { CustomBranchPothosRef } from '../budget/refs';
import { UserPothosRef } from '../users/refs';

export const ServiceOrderStatusPothosRef = builder.enumType('ServiceOrderStatus', {
    values: Object.fromEntries(
        Object.entries(ServiceOrderStatus).map(([name, value]) => [name, { value }]),
    ),
});

export const ServiceOrderPothosRef = builder.prismaObject('ServiceOrder', {
    fields: (t) => ({
        id: t.exposeID('id'),
        serviceOrderNumber: t.exposeInt('serviceOrderNumber'),
        status: t.field({
            type: ServiceOrderStatusPothosRef,
            resolve: (root) => root.status as ServiceOrderStatus,
        }),
        description: t.exposeString('description', { nullable: true }),
        subject: t.exposeString('subject', { nullable: true }),
        clientName: t.exposeString('clientName', { nullable: true }),
        customBranch: t.field({
            type: CustomBranchPothosRef,
            nullable: true,
            resolve: (root) => root.customBranch as any,
        }),
        participants: t.exposeStringList('participants'),
        createdAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.createdAt,
        }),
        updatedAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.updatedAt,
        }),
        client: t.relation('client', { nullable: true }),
        business: t.relation('business'),
        branch: t.relation('branch', { nullable: true }),
        tasks: t.relation('tasks'),
        assignedTechnicians: t.field({
            type: [UserPothosRef],
            resolve: async (root: ServiceOrder) => {
                const assigned = await prisma.user.findManyUndeleted({
                    where: {
                        id: {
                            in: root.assignedTechnicianIDs,
                        },
                        deleted: false,
                    },
                });
                return assigned;
            },
        }),
    }),
});

export const ServiceOrderCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        serviceOrder?: any;
    }>('ServiceOrderCrudResult')
    .implement({
        fields: (t) => ({
            success: t.exposeBoolean('success'),
            message: t.exposeString('message', { nullable: true }),
            serviceOrder: t.field({
                type: ServiceOrderPothosRef,
                nullable: true,
                resolve: (parent) => parent.serviceOrder || null,
            }),
        }),
    });
