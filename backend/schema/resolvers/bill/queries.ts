import { BillPothosRef, BillStatusPothosRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

builder.queryFields((t) => ({
    bills: t.field({
        type: [BillPothosRef],
        args: {
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
            businessId: t.arg.string({ required: false }),
            status: t.arg({
                type: BillStatusPothosRef,
                required: false,
            }),
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
            const {
                skip = 0,
                take = 10,
                businessId,
                status,
                orderBy,
                orderDirection,
            } = args;
            const sortDirection =
                orderDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';
            let orderConfig = {};
            if (orderBy) {
                if (orderBy === 'business') {
                    orderConfig = { business: { name: sortDirection } };
                } else if (orderBy === 'contactName') {
                    // Ordenar por el primer contacto del perfil de facturación (nombre)
                    // Prisma no soporta ordenar por array, así que se hace en memoria
                    const bills = await prisma.bill.findMany({
                        where: {
                            ...(businessId && { businessId }),
                            ...(status && { status }),
                        },
                        skip: skip ?? 0,
                        take: take ?? 10,
                        include: {
                            business: true,
                            billingProfile: true,
                        },
                        orderBy: { createdAt: 'desc' },
                    });
                    const sorted = bills.sort((a, b) => {
                        const aName = a.billingProfile.contacts?.[0]?.fullName || '';
                        const bName = b.billingProfile.contacts?.[0]?.fullName || '';
                        return sortDirection === 'asc'
                            ? aName.localeCompare(bName)
                            : bName.localeCompare(aName);
                    });
                    return sorted;
                } else if (orderBy === 'contactEmail') {
                    // Ordenar por el primer contacto del perfil de facturación (email)
                    const bills = await prisma.bill.findMany({
                        where: {
                            ...(businessId && { businessId }),
                            ...(status && { status }),
                        },
                        skip: skip ?? 0,
                        take: take ?? 10,
                        include: {
                            business: true,
                            billingProfile: true,
                        },
                        orderBy: { createdAt: 'desc' },
                    });
                    const sorted = bills.sort((a, b) => {
                        const aEmail = a.billingProfile.contacts?.[0]?.email || '';
                        const bEmail = b.billingProfile.contacts?.[0]?.email || '';
                        return sortDirection === 'asc'
                            ? aEmail.localeCompare(bEmail)
                            : bEmail.localeCompare(aEmail);
                    });
                    return sorted;
                } else if (orderBy === 'billingEmail') {
                    // Ordenar por email de facturación
                    orderConfig = { billingProfile: { billingEmail: sortDirection } };
                } else if (orderBy === 'status') {
                    orderConfig = { status: sortDirection };
                } else {
                    orderConfig = { [orderBy]: sortDirection };
                }
            } else {
                orderConfig = { createdAt: 'desc' };
            }
            return prisma.bill.findMany({
                where: {
                    ...(businessId && { businessId }),
                    ...(status && { status }),
                },
                skip: skip ?? 0,
                take: take ?? 10,
                include: {
                    business: true,
                    billingProfile: true,
                },
                orderBy: orderConfig,
            });
        },
    }),
    billsCount: t.int({
        args: {
            businessId: t.arg.string({ required: false }),
            status: t.arg({
                type: BillStatusPothosRef,
                required: false,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            const { businessId, status } = args;
            return prisma.bill.count({
                where: {
                    ...(businessId && { businessId }),
                    ...(status && { status }),
                },
            });
        },
    }),
    bill: t.field({
        type: BillPothosRef,
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
            return prisma.bill.findUnique({
                where: { id: args.id },
                include: {
                    business: true,
                    billingProfile: true,
                },
            });
        },
    }),
}));
