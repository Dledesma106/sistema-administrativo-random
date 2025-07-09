import { TaskPricePothosRef, TaskTypePothosRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

builder.queryFields((t) => ({
    taskPrices: t.field({
        type: [TaskPricePothosRef],
        args: {
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
            businessId: t.arg.string({ required: false }),
            taskType: t.arg({
                type: TaskTypePothosRef,
                required: false,
            }),
            orderBy: t.arg.string({ required: false }),
            orderDirection: t.arg.string({ required: false }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoTecnico', 'IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            const {
                skip = 0,
                take = 10,
                businessId,
                taskType,
                orderBy,
                orderDirection,
            } = args;

            const sortDirection =
                orderDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';

            let orderConfig = {};
            if (orderBy) {
                if (orderBy === 'business') {
                    orderConfig = { business: { name: sortDirection } };
                } else if (orderBy === 'taskType') {
                    orderConfig = { taskType: sortDirection };
                } else if (orderBy === 'price') {
                    orderConfig = { price: sortDirection };
                } else {
                    orderConfig = { [orderBy]: sortDirection };
                }
            } else {
                orderConfig = { createdAt: 'desc' };
            }

            return prisma.taskPrice.findMany({
                where: {
                    ...(businessId && { businessId }),
                    ...(taskType && { taskType }),
                },
                skip: skip ?? 0,
                take: take ?? 10,
                include: {
                    business: true,
                },
                orderBy: orderConfig,
            });
        },
    }),

    taskPricesCount: t.int({
        args: {
            businessId: t.arg.string({ required: false }),
            taskType: t.arg({
                type: TaskTypePothosRef,
                required: false,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoTecnico', 'IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            const { businessId, taskType } = args;
            return prisma.taskPrice.count({
                where: {
                    ...(businessId && { businessId }),
                    ...(taskType && { taskType }),
                },
            });
        },
    }),

    taskPrice: t.field({
        type: TaskPricePothosRef,
        nullable: true,
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoTecnico', 'IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            return prisma.taskPrice.findUnique({
                where: { id: args.id },
                include: {
                    business: true,
                },
            });
        },
    }),
}));
