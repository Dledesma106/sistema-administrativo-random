import { BankAccountPothosRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

builder.queryFields((t) => ({
    bankAccounts: t.field({
        type: [BankAccountPothosRef],
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: [ 'IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, _args, _ctx, _info) => {
            return prisma.bankAccount.findMany({
                where: {
                    deleted: false,
                    billingProfileId: null, // Solo cuentas propias (sin perfil de facturación)
                },
                include: {
                    billingProfile: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        },
    }),

    bankAccount: t.field({
        type: BankAccountPothosRef,
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
            return prisma.bankAccount.findFirst({
                where: {
                    id: args.id,
                    deleted: false,
                },
                include: {
                    billingProfile: true,
                },
            });
        },
    }),

    bankAccountsByBillingProfile: t.field({
        type: [BankAccountPothosRef],
        args: {
            billingProfileId: t.arg.string({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            return prisma.bankAccount.findMany({
                where: {
                    billingProfileId: args.billingProfileId,
                    deleted: false,
                },
                include: {
                    billingProfile: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        },
    }),
})); 