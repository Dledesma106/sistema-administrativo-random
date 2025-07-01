import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

builder.queryFields((t) => ({
    budgets: t.prismaField({
        type: ['Budget'],
        args: {
            clientId: t.arg({
                type: ['String'],
                required: false,
            }),
            businessId: t.arg({
                type: ['String'],
                required: false,
            }),
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
            orderBy: t.arg.string({ required: false }),
            orderDirection: t.arg.string({ required: false }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (
            query,
            _parent,
            { clientId, businessId, skip, take, orderBy, orderDirection },
        ) => {
            const sortDirection =
                orderDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';

            let orderConfig = {};

            if (orderBy) {
                if (orderBy === 'business') {
                    orderConfig = {
                        billingProfile: {
                            business: {
                                name: sortDirection,
                            },
                        },
                    };
                } else if (orderBy === 'subject') {
                    orderConfig = {
                        subject: sortDirection,
                    };
                } else if (orderBy === 'status') {
                    orderConfig = {
                        status: sortDirection,
                    };
                } else if (orderBy === 'price') {
                    orderConfig = {
                        price: sortDirection,
                    };
                } else {
                    orderConfig = { [orderBy]: sortDirection };
                }
            } else {
                orderConfig = { createdAt: 'desc' };
            }

            return await prisma.budget.findManyUndeleted({
                ...query,
                where: {
                    ...(clientId?.length && {
                        clientId: { in: clientId },
                    }),
                    ...(businessId?.length && {
                        billingProfile: {
                            businessId: { in: businessId },
                        },
                    }),
                },
                skip: skip || 0,
                take: take || 10,
                orderBy: orderConfig,
                include: {
                    billingProfile: {
                        include: {
                            business: true,
                        },
                    },
                    client: true,
                },
            });
        },
    }),
    budgetsCount: t.int({
        args: {
            clientId: t.arg({
                type: ['String'],
                required: false,
            }),
            businessId: t.arg({
                type: ['String'],
                required: false,
            }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (_parent, { clientId, businessId }) => {
            return prisma.budget.count({
                where: {
                    deleted: false,
                    ...(clientId?.length && {
                        clientId: { in: clientId },
                    }),
                    ...(businessId?.length && {
                        billingProfile: {
                            businessId: { in: businessId },
                        },
                    }),
                },
            });
        },
    }),
    budgetById: t.prismaField({
        type: 'Budget',
        nullable: true,
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        args: {
            id: t.arg.string({
                required: true,
            }),
        },
        resolve: async (query, _parent, { id }) => {
            return await prisma.budget.findUniqueUndeleted({
                ...query,
                where: {
                    id,
                },
                include: {
                    billingProfile: {
                        include: {
                            business: true,
                        },
                    },
                    client: true,
                    branch: true,
                    createdBy: true,
                },
            });
        },
    }),
}));
