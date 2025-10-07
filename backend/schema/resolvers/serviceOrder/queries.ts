import { ServiceOrderStatus } from '@prisma/client';

import { ServiceOrderPothosRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

builder.queryFields((t) => ({
    serviceOrders: t.field({
        type: [ServiceOrderPothosRef],
        args: {
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
            clientId: t.arg.string({ required: false }),
            businessId: t.arg.string({ required: false }),
            status: t.arg.string({ required: false }),
            orderBy: t.arg.string({ required: false }),
            orderDirection: t.arg.string({ required: false }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            const { skip, take, clientId, businessId, status, orderBy, orderDirection } =
                args;
            const sortDirection =
                orderDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';
            let orderConfig = {};
            if (orderBy) {
                if (orderBy === 'serviceOrderNumber') {
                    orderConfig = { serviceOrderNumber: sortDirection };
                } else if (orderBy === 'business') {
                    orderConfig = { business: { name: sortDirection } };
                } else if (orderBy === 'client') {
                    orderConfig = { client: { name: sortDirection } };
                } else if (orderBy === 'status') {
                    orderConfig = { status: sortDirection };
                } else {
                    orderConfig = { [orderBy]: sortDirection };
                }
            } else {
                orderConfig = { createdAt: 'desc' };
            }
            return prisma.serviceOrder.findMany({
                where: {
                    ...(clientId && { clientId }),
                    ...(businessId && { businessId }),
                    ...(status && { status: status as ServiceOrderStatus }),
                },
                skip: skip ?? 0,
                take: take ?? 10,
                orderBy: orderConfig,
                include: {
                    client: true,
                    business: true,
                    branch: true,
                },
            });
        },
    }),
    serviceOrder: t.field({
        type: ServiceOrderPothosRef,
        nullable: true,
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            return prisma.serviceOrder.findUnique({
                where: { id: args.id },
                include: {
                    client: true,
                    business: true,
                    branch: true,
                    tasks: true,
                },
            });
        },
    }),
}));
