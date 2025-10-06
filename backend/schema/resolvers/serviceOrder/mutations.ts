import { ServiceOrderCrudResultPothosRef, ServiceOrderStatusPothosRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

builder.mutationFields((t) => ({
    createServiceOrder: t.field({
        type: ServiceOrderCrudResultPothosRef,
        args: {
            clientId: t.arg.string({ required: true }),
            businessId: t.arg.string({ required: true }),
            branchId: t.arg.string({ required: true }),
            description: t.arg.string({ required: false }),
            status: t.arg({
                type: ServiceOrderStatusPothosRef,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            try {
                // Generate next serviceOrderNumber
                const maxOrder = await prisma.serviceOrder.findFirst({
                    orderBy: { serviceOrderNumber: 'desc' },
                    select: { serviceOrderNumber: true },
                });
                const nextNumber = (maxOrder?.serviceOrderNumber ?? 0) + 1;
                const serviceOrder = await prisma.serviceOrder.create({
                    data: {
                        serviceOrderNumber: nextNumber,
                        status: args.status,
                        clientId: args.clientId,
                        businessId: args.businessId,
                        branchId: args.branchId,
                        description: args.description,
                    },
                });
                return {
                    success: true,
                    serviceOrder,
                };
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        },
    }),
}));
