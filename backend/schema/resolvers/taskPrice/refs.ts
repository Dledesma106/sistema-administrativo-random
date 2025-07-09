import { TaskType } from '@prisma/client';

import { builder } from '../../builder';

export const TaskTypePothosRef = builder.enumType('TaskType', {
    values: Object.fromEntries(
        Object.entries(TaskType).map(([name, value]) => [name, { value }]),
    ),
});

export const TaskPriceHistoryPothosRef = builder
    .objectRef<{
        price: number;
        updatedAt: Date;
    }>('TaskPriceHistory')
    .implement({
        fields: (t) => ({
            price: t.exposeFloat('price'),
            updatedAt: t.field({
                type: 'DateTime',
                resolve: (root) => root.updatedAt,
            }),
        }),
    });

export const TaskPricePothosRef = builder.prismaObject('TaskPrice', {
    fields: (t) => ({
        id: t.exposeID('id'),
        createdAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.createdAt,
        }),
        updatedAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.updatedAt,
        }),
        taskType: t.field({
            type: TaskTypePothosRef,
            resolve: (root) => root.taskType,
        }),
        price: t.exposeFloat('price'),
        business: t.relation('business'),
        businessId: t.exposeString('businessId'),
        priceHistory: t.field({
            type: [TaskPriceHistoryPothosRef],
            resolve: (root) => root.priceHistory,
        }),
    }),
});

export const TaskPriceCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        taskPrice?: any;
    }>('TaskPriceCrudResult')
    .implement({
        fields: (t) => ({
            success: t.exposeBoolean('success'),
            message: t.exposeString('message', { nullable: true }),
            taskPrice: t.field({
                type: TaskPricePothosRef,
                nullable: true,
                resolve: (parent) => parent.taskPrice || null,
            }),
        }),
    });

export const TaskPriceInputPothosRef = builder.inputType('TaskPriceInput', {
    fields: (t) => ({
        businessId: t.string({ required: true }),
        taskType: t.field({
            type: TaskTypePothosRef,
            required: true,
        }),
        price: t.float({ required: true }),
    }),
});

export const TaskPriceUpdateInputPothosRef = builder.inputType('TaskPriceUpdateInput', {
    fields: (t) => ({
        price: t.float({ required: true }),
    }),
});
