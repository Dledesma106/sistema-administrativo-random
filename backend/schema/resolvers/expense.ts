import {
    ExpenseStatus,
    ExpenseType,
    ExpensePaySource,
    Image,
    Expense,
} from '@prisma/client';

import { prisma } from 'lib/prisma';

import { builder } from '../builder';
import { updateImageSignedUrlAsync } from '../utils';
import { deletePhoto } from 'backend/s3Client';

export const ExpenseTypePothosRef = builder.enumType('ExpenseType', {
    values: Object.fromEntries(
        Object.entries(ExpenseType).map(([name, value]) => [name, { value }]),
    ),
});

export const ExpenseStatusPothosRef = builder.enumType('ExpenseStatus', {
    values: Object.fromEntries(
        Object.entries(ExpenseStatus).map(([name, value]) => [name, { value }]),
    ),
});

export const ExpensePaySourcePothosRef = builder.enumType('ExpensePaySource', {
    values: Object.fromEntries(
        Object.entries(ExpensePaySource).map(([name, value]) => [name, { value }]),
    ),
});

export const ExpensePothosRef = builder.prismaObject('Expense', {
    name: 'Expense',
    fields: (t) => ({
        id: t.exposeID('id'),
        createdAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.createdAt,
        }),
        amount: t.exposeInt('amount'),
        expenseType: t.field({
            type: ExpenseTypePothosRef,
            resolve: (root) => root.expenseType as ExpenseType,
        }),
        paySource: t.field({
            type: ExpensePaySourcePothosRef,
            resolve: (root) => root.paySource as ExpensePaySource,
        }),
        status: t.field({
            type: ExpenseStatusPothosRef,
            resolve: (root) => root.status as ExpenseStatus,
        }),
        auditor: t.relation('auditor', {
            nullable: true,
        }),
        image: t.prismaField({
            type: 'Image',
            resolve: async (root, parent) => {
                const image = await prisma.image.findUniqueUndeleted({
                    where: {
                        id: parent.imageId,
                    },
                });

                if (!image) {
                    await prisma.expense.softDeleteOne({ id: parent.id });
                    throw new Error('Un gasto debe tener una imagen asociada');
                }

                await updateImageSignedUrlAsync(image);

                return prisma.image.findUniqueUndeleted({
                    where: {
                        id: parent.imageId,
                    },
                }) as Promise<Image>;
            },
        }),
        doneBy: t.relation('doneBy'),
    }),
});

builder.queryFields((t) => ({
    myAssignedTaskExpenseById: t.prismaField({
        type: 'Expense',
        nullable: true,
        args: {
            id: t.arg.string({
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
        resolve: async (query, parent, args, { user }) => {
            const expense = await prisma.expense.findUniqueUndeleted({
                ...query,
                where: {
                    id: args.id,
                },
            });

            if (!expense) {
                return null;
            }

            const taskExists = await prisma.task.exists({
                id: expense.taskId,
                deleted: false,
                assignedIDs: {
                    has: user.id,
                },
            });
            if (!taskExists) {
                return null;
            }

            return expense;
        },
    }),
}));

builder.mutationFields((t) => ({
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
}));

export const ExpenseCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        expense?: Expense;
    }>('ExpenseCrudResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            expense: t.field({
                type: ExpensePothosRef,
                nullable: true,
                resolve: (result) => result.expense,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
        }),
    });
