import { ServiceOrderStatus } from '@prisma/client';

import { builder } from '../../builder';

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
        createdAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.createdAt,
        }),
        updatedAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.updatedAt,
        }),
        client: t.relation('client'),
        business: t.relation('business'),
        branch: t.relation('branch'),
        tasks: t.relation('tasks'),
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
