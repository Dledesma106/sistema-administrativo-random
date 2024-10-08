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
            rules: ['IsAuthenticated', 'IsTecnico'],
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
