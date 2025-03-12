import { Expense } from '@prisma/client';

import {
    ExpenseStatusPothosRef,
    ExpenseTypePothosRef,
    ExpensePothosRef,
    ExpensePaySourcePothosRef,
} from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

interface ExpensesResponse {
    items: Expense[];
    total: number;
}

const ExpensesResponseRef = builder.objectRef<ExpensesResponse>('ExpensesResponse');

ExpensesResponseRef.implement({
    fields: (t) => ({
        items: t.field({
            type: [ExpensePothosRef],
            resolve: (parent: ExpensesResponse) => parent.items,
        }),
        total: t.int({
            resolve: (parent: ExpensesResponse) => parent.total,
        }),
    }),
});

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
        args: {
            registeredBy: t.arg({
                type: ['String'],
                required: false,
            }),
            status: t.arg({
                type: [ExpenseStatusPothosRef],
                required: false,
            }),
            expenseType: t.arg({
                type: [ExpenseTypePothosRef],
                required: false,
            }),
            paySource: t.arg({
                type: [ExpensePaySourcePothosRef],
                required: false,
            }),
            expenseDateFrom: t.arg({
                type: 'DateTime',
                required: false,
            }),
            expenseDateTo: t.arg({
                type: 'DateTime',
                required: false,
            }),
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
        },
        resolve: async (query, _parent, { skip, take, ...filters }) => {
            const startDate = filters.expenseDateFrom;
            const endDate = filters.expenseDateTo;
            if (startDate) {
                startDate.setHours(0, 0, 0, 0);
            }
            if (endDate) {
                endDate.setHours(23, 59, 59, 999);
            }
            return prisma.expense.findManyUndeleted({
                ...query,
                where: {
                    deleted: false,
                    ...(filters.status?.length && {
                        status: { in: filters.status },
                    }),
                    ...(filters.expenseType?.length && {
                        expenseType: { in: filters.expenseType },
                    }),
                    ...(filters.registeredBy?.length && {
                        registeredById: { in: filters.registeredBy },
                    }),
                    ...(filters.paySource?.length && {
                        paySource: { in: filters.paySource },
                    }),
                    ...((filters.expenseDateFrom || filters.expenseDateTo) && {
                        expenseDate: {
                            ...(startDate && {
                                gte: startDate,
                            }),
                            ...(endDate && { lte: endDate }),
                        },
                    }),
                },
                skip: skip || 0,
                take: take || 10,
                orderBy: { createdAt: 'desc' },
            });
        },
    }),
    expensesCount: t.int({
        args: {
            registeredBy: t.arg({
                type: ['String'],
                required: false,
            }),
            status: t.arg({
                type: [ExpenseStatusPothosRef],
                required: false,
            }),
            expenseType: t.arg({
                type: [ExpenseTypePothosRef],
                required: false,
            }),
            paySource: t.arg({
                type: [ExpensePaySourcePothosRef],
                required: false,
            }),
            expenseDateFrom: t.arg({
                type: 'DateTime',
                required: false,
            }),
            expenseDateTo: t.arg({
                type: 'DateTime',
                required: false,
            }),
        },
        resolve: async (_parent, filters) => {
            return prisma.expense.count({
                where: {
                    deleted: false,
                    ...(filters.status?.length && {
                        status: { in: filters.status },
                    }),
                    ...(filters.expenseType?.length && {
                        expenseType: { in: filters.expenseType },
                    }),
                    ...(filters.registeredBy?.length && {
                        registeredById: { in: filters.registeredBy },
                    }),
                    ...(filters.paySource?.length && {
                        paySource: { in: filters.paySource },
                    }),
                    ...((filters.expenseDateFrom || filters.expenseDateTo) && {
                        expenseDate: {
                            ...(filters.expenseDateFrom && {
                                gte: filters.expenseDateFrom,
                            }),
                            ...(filters.expenseDateTo && { lte: filters.expenseDateTo }),
                        },
                    }),
                },
            });
        },
    }),
}));
