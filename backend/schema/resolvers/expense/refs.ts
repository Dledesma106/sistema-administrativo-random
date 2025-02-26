import {
    ExpenseStatus,
    ExpenseType,
    ExpensePaySource,
    Expense,
    ExpensePaySourceBank,
} from '@prisma/client';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';
import { FileRef } from '../file/refs';
import { ImagePothosRef } from '../image';

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

export const ExpensePaySourceBankPothosRef = builder.enumType('ExpensePaySourceBank', {
    values: Object.fromEntries(
        Object.entries(ExpensePaySourceBank).map(([name, value]) => [name, { value }]),
    ),
});

export const ExpenseInputType = builder.inputType('ExpenseInput', {
    fields: (t) => ({
        amount: t.float({ required: true }),
        expenseType: t.field({
            type: ExpenseTypePothosRef,
            required: true,
        }),
        paySource: t.field({
            type: ExpensePaySourcePothosRef,
            required: true,
        }),
        paySourceBank: t.field({
            type: ExpensePaySourceBankPothosRef,
            required: false,
        }),
        installments: t.int({ required: true }),
        expenseDate: t.field({
            type: 'DateTime',
            required: false,
        }),
        observations: t.string(),
        doneBy: t.string({ required: true }),
        imageKeys: t.stringList({ required: false }),
        fileKeys: t.stringList({ required: false }),
        filenames: t.stringList({ required: false }),
        mimeTypes: t.stringList({ required: false }),
        sizes: t.intList({ required: false }),
        cityName: t.string({ required: true }),
    }),
});

export const ExpensePothosRef = builder.prismaObject('Expense', {
    name: 'Expense',
    fields: (t) => ({
        id: t.exposeID('id'),
        expenseNumber: t.exposeString('expenseNumber', { nullable: false }),
        createdAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.createdAt,
        }),
        expenseDate: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.expenseDate,
        }),
        amount: t.exposeFloat('amount'),
        discountAmount: t.exposeFloat('discountAmount', {
            nullable: true,
        }),
        expenseType: t.field({
            type: ExpenseTypePothosRef,
            resolve: (root) => root.expenseType as ExpenseType,
        }),
        paySource: t.field({
            type: ExpensePaySourcePothosRef,
            resolve: (root) => root.paySource as ExpensePaySource,
        }),
        paySourceBank: t.field({
            nullable: true,
            type: ExpensePaySourceBankPothosRef,
            resolve: (root) => root.paySourceBank as ExpensePaySourceBank,
        }),
        installments: t.exposeInt('installments', {
            nullable: true,
        }),
        status: t.field({
            type: ExpenseStatusPothosRef,
            resolve: (root) => root.status as ExpenseStatus,
        }),
        auditor: t.relation('auditor', {
            nullable: true,
        }),
        cityName: t.exposeString('cityName', { nullable: true }),
        images: t.field({
            type: [ImagePothosRef],
            resolve: async (expense) => {
                const images = await prisma.image.findMany({
                    where: {
                        expenseIDs: { has: expense.id },
                        deleted: false,
                    },
                });
                return images;
            },
        }),
        files: t.field({
            type: [FileRef],
            resolve: async (expense) => {
                const files = await prisma.file.findMany({
                    where: {
                        expenseIDs: { has: expense.id },
                        deleted: false,
                    },
                });
                return files;
            },
        }),
        registeredBy: t.relation('registeredBy'),
        doneBy: t.exposeString('doneBy'),
        observations: t.exposeString('observations', {
            nullable: true,
        }),
        task: t.relation('task', { nullable: true }),
    }),
});

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
