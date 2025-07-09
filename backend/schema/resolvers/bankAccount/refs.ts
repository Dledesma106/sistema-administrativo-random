import { AccountType } from '@prisma/client';

import { builder } from '../../builder';

export const AccountTypePothosRef = builder.enumType('AccountType', {
    values: Object.fromEntries(
        Object.entries(AccountType).map(([name, value]) => [name, { value }]),
    ),
});

export const BankAccountPothosRef = builder.prismaObject('BankAccount', {
    fields: (t) => ({
        id: t.exposeID('id'),
        createdAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.createdAt,
        }),
        updatedAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.updatedAt,
        }),
        deleted: t.exposeBoolean('deleted'),
        deletedAt: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.deletedAt,
        }),
        bank: t.exposeString('bank'),
        accountNumber: t.exposeString('accountNumber'),
        cbu: t.exposeString('cbu', { nullable: true }),
        alias: t.exposeString('alias', { nullable: true }),
        accountType: t.field({
            type: AccountTypePothosRef,
            resolve: (root) => root.accountType,
        }),
        holder: t.exposeString('holder'),
        holderCUIT: t.exposeString('holderCUIT'),
        balance: t.exposeFloat('balance'),
        billingProfile: t.relation('billingProfile', { nullable: true }),
    }),
});

export const BankAccountCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        bankAccount?: any;
    }>('BankAccountCrudResult')
    .implement({
        fields: (t) => ({
            success: t.exposeBoolean('success'),
            message: t.exposeString('message', { nullable: true }),
            bankAccount: t.field({
                type: BankAccountPothosRef,
                nullable: true,
                resolve: (parent) => parent.bankAccount || null,
            }),
        }),
    });

export const BankAccountInputPothosRef = builder.inputType('BankAccountInput', {
    fields: (t) => ({
        bank: t.string({ required: true }),
        accountNumber: t.string({ required: true }),
        cbu: t.string({ required: false }),
        alias: t.string({ required: false }),
        accountType: t.field({
            type: AccountTypePothosRef,
            required: true,
        }),
        holder: t.string({ required: true }),
        holderCUIT: t.string({ required: true }),
        billingProfileId: t.string({ required: false }),
    }),
});

export const BankAccountUpdateInputPothosRef = builder.inputType('BankAccountUpdateInput', {
    fields: (t) => ({
        alias: t.string({ required: true }),
    }),
}); 