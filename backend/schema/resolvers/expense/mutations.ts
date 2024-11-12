import { ExpenseStatus } from '@prisma/client';

import { ExpenseCrudResultPothosRef, ExpenseInputType } from './refs';

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
                const newExpense = await prisma.expense.create({
                    data: {
                        amount: parseFloat(String(expenseData.amount)),
                        expenseType: expenseData.expenseType,
                        paySource: expenseData.paySource,
                        doneBy: expenseData.doneBy,
                        paySourceBank: expenseData.paySourceBank,
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
}));
