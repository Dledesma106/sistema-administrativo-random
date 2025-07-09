import { BankAccountPothosRef, BankAccountCrudResultPothosRef, BankAccountInputPothosRef, BankAccountUpdateInputPothosRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

builder.mutationFields((t) => ({
    createBankAccount: t.field({
        type: BankAccountCrudResultPothosRef,
        args: {
            input: t.arg({
                type: BankAccountInputPothosRef,
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
                const {
                    bank,
                    accountNumber,
                    cbu,
                    alias,
                    accountType,
                    holder,
                    holderCUIT,
                    billingProfileId,
                } = args.input;

                // Verificar si ya existe una cuenta con el mismo número en el mismo banco
                const existingAccount = await prisma.bankAccount.findFirst({
                    where: {
                        bank,
                        accountNumber,
                        deleted: false,
                        ...(billingProfileId ? { billingProfileId } : { billingProfileId: null }),
                    },
                });

                if (existingAccount) {
                    return {
                        success: false,
                        message: 'Ya existe una cuenta bancaria con el mismo número en este banco',
                        bankAccount: null,
                    };
                }

                const bankAccount = await prisma.bankAccount.create({
                    data: {
                        bank,
                        accountNumber,
                        cbu,
                        alias,
                        accountType,
                        holder,
                        holderCUIT,
                        billingProfileId: billingProfileId || null,
                    },
                    include: {
                        billingProfile: true,
                    },
                });

                return {
                    success: true,
                    message: 'Cuenta bancaria creada exitosamente',
                    bankAccount,
                };
            } catch (error) {
                console.error('Error creating bank account:', error);
                return {
                    success: false,
                    message: 'Error al crear la cuenta bancaria',
                    bankAccount: null,
                };
            }
        },
    }),

    updateBankAccount: t.field({
        type: BankAccountCrudResultPothosRef,
        args: {
            id: t.arg.string({ required: true }),
            input: t.arg({
                type: BankAccountUpdateInputPothosRef,
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
                const { id } = args;
                const { alias } = args.input;

                // Verificar si la cuenta existe
                const existingAccount = await prisma.bankAccount.findFirst({
                    where: {
                        id,
                        deleted: false,
                    },
                });

                if (!existingAccount) {
                    return {
                        success: false,
                        message: 'Cuenta bancaria no encontrada',
                        bankAccount: null,
                    };
                }

                const bankAccount = await prisma.bankAccount.update({
                    where: { id },
                    data: {
                        alias,
                    },
                    include: {
                        billingProfile: true,
                    },
                });

                return {
                    success: true,
                    message: 'Cuenta bancaria actualizada exitosamente',
                    bankAccount,
                };
            } catch (error) {
                console.error('Error updating bank account:', error);
                return {
                    success: false,
                    message: 'Error al actualizar la cuenta bancaria',
                    bankAccount: null,
                };
            }
        },
    }),

    deleteBankAccount: t.field({
        type: BankAccountCrudResultPothosRef,
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
            try {
                const { id } = args;

                // Verificar si la cuenta existe
                const existingAccount = await prisma.bankAccount.findFirst({
                    where: {
                        id,
                        deleted: false,
                    },
                });

                if (!existingAccount) {
                    return {
                        success: false,
                        message: 'Cuenta bancaria no encontrada',
                        bankAccount: null,
                    };
                }

                // Soft delete
                const bankAccount = await prisma.bankAccount.update({
                    where: { id },
                    data: {
                        deleted: true,
                        deletedAt: new Date(),
                    },
                    include: {
                        billingProfile: true,
                    },
                });

                return {
                    success: true,
                    message: 'Cuenta bancaria eliminada exitosamente',
                    bankAccount,
                };
            } catch (error) {
                console.error('Error deleting bank account:', error);
                return {
                    success: false,
                    message: 'Error al eliminar la cuenta bancaria',
                    bankAccount: null,
                };
            }
        },
    }),
})); 