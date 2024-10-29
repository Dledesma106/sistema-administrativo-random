import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

builder.queryFields((t) => ({
    myExpenseById: t.prismaField({
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
                    doneById: user.id,
                },
            });

            if (!expense) {
                return null;
            }

            return expense;
        },
    }),
    myExpenses: t.prismaField({
        type: ['Expense'],
        nullable: true,
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                {
                    or: ['IsTecnico'],
                },
            ],
        },
        resolve: async (query, parent, args, { user }) => {
            const expenses = await prisma.expense.findManyUndeleted({
                ...query,
                where: {
                    doneById: user.id,
                    task: null,
                },
            });
            console.log(expenses);
            // const filteredExpenses = expenses.filter(
            //     (expense) => expense.taskId === null,
            // );
            if (!expenses) {
                return null;
            }

            return expenses;
        },
    }),
}));
