import { ExpenseStatusPothosRef, ExpenseTypePothosRef } from './refs';

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
                    registeredById: user.id,
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
                    registeredById: user.id,
                    task: null,
                },
            });
            // const filteredExpenses = expenses.filter(
            //     (expense) => expense.taskId === null,
            // );
            if (!expenses) {
                return null;
            }

            return expenses;
        },
    }),
    expenseById: t.prismaField({
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
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (query, parent, args) => {
            const expense = await prisma.expense.findUniqueUndeleted({
                ...query,
                where: {
                    id: args.id,
                },
            });

            if (!expense) {
                return null;
            }
            return expense;
        },
    }),
    expenses: t.prismaField({
        type: ['Expense'],
        nullable: true,
        args: {
            registeredBy: t.arg({
                type: ['String'],
                required: false,
            }),
            status: t.arg({
                type: ExpenseStatusPothosRef,
                required: false,
            }),
            expenseType: t.arg({
                type: ExpenseTypePothosRef,
                required: false,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (query) => {
            const expenses = await prisma.expense.findManyUndeleted({
                orderBy: {
                    createdAt: 'desc',
                },
                ...query,
            });
            if (!expenses) {
                return null;
            }

            return expenses;
        },
    }),
}));
