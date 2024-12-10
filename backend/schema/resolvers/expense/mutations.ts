import { ExpenseStatus } from '@prisma/client';

import {
    ExpenseCrudResultPothosRef,
    ExpenseInputType,
    ExpenseStatusPothosRef,
} from './refs';

import { createImageSignedUrlAsync } from 'backend/s3Client';
import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

export const ExpenseMutations = builder.mutationFields((t) => ({
    deleteExpense: t.field({
        type: ExpenseCrudResultPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
            taskId: t.arg.string({
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                {
                    or: ['IsTecnico', 'IsAdministrativoTecnico', 'IsAuditor'],
                },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { id } = args;

                const expense = await prisma.expense.softDeleteOne({
                    id,
                });

                if (!expense) {
                    return {
                        message: 'El gasto no existe',
                        success: false,
                    };
                }
                const image = await prisma.image.softDeleteOne({
                    id: expense.imageId,
                });

                if (!image) {
                    return {
                        message: 'El gasto no poseia una foto',
                        success: false,
                    };
                }

                return {
                    success: true,
                    expense,
                };
            } catch (error) {
                return {
                    message: 'Error al eliminar el gasto',
                    success: false,
                };
            }
        },
    }),
    createExpense: t.field({
        type: ExpenseCrudResultPothosRef,
        args: {
            taskId: t.arg.string({ required: false }),
            expenseData: t.arg({
                type: ExpenseInputType,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                {
                    or: ['IsTecnico'],
                },
            ],
        },
        resolve: async (_parent, { taskId, expenseData }, _context) => {
            try {
                console.log('creando gastoooo');
                const newExpense = await prisma.expense.create({
                    data: {
                        amount: parseFloat(String(expenseData.amount)),
                        expenseType: expenseData.expenseType,
                        paySource: expenseData.paySource,
                        doneBy: expenseData.doneBy,
                        paySourceBank: expenseData.paySourceBank,
                        installments: expenseData.installments,
                        expenseDate: expenseData.expenseDate,
                        observations: expenseData.observations,
                        status: ExpenseStatus.Enviado,
                        registeredBy: { connect: { id: _context.user.id } },
                        ...(taskId && { task: { connect: { id: taskId } } }),
                        image: {
                            create: {
                                ...(await createImageSignedUrlAsync(
                                    expenseData.imageKey,
                                )),
                                key: expenseData.imageKey,
                            },
                        },
                    },
                });
                return {
                    success: true,
                    expense: newExpense,
                };
            } catch (error) {
                console.error(error);
                return {
                    success: false,
                };
            }
        },
    }),
    updateExpenseStatus: t.field({
        type: ExpenseCrudResultPothosRef,
        args: {
            expenseId: t.arg.string({
                required: true,
            }),
            status: t.arg({
                type: ExpenseStatusPothosRef,
                required: true,
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
        resolve: async (root, args) => {
            try {
                const { expenseId, status } = args;
                const foundExpense = await prisma.expense.findUniqueUndeleted({
                    where: {
                        id: expenseId,
                    },
                    select: {
                        task: true,
                    },
                });

                if (!foundExpense) {
                    return {
                        message: 'El gasto no existe',
                        success: false,
                    };
                }

                if (!foundExpense.task) {
                    return {
                        message: 'El gasto no pertenece a ninguna tarea',
                        success: false,
                    };
                }

                const newExpense = await prisma.expense.update({
                    where: {
                        id: expenseId,
                    },
                    data: {
                        status,
                    },
                });

                return {
                    success: true,
                    expense: newExpense,
                };
            } catch (error) {
                return {
                    success: false,
                };
            }
        },
    }),
}));
