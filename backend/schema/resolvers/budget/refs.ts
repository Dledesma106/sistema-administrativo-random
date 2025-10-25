import { Budget, BudgetStatus, ExpenseType } from '@prisma/client';

import { builder } from '../../builder';
import { ContactInputPothosRef } from '../billingProfile/refs';
import { ExpenseTypePothosRef } from '../expense/refs';

// Tipos para gasto calculado y mano de obra
export const ExpectedExpensePothosRef = builder
    .objectRef<{
        type: ExpenseType;
        quantity: number;
        amount: number;
        unitPrice: number;
    }>('ExpectedExpense')
    .implement({
        fields: (t) => ({
            type: t.field({
                type: ExpenseTypePothosRef,
                resolve: (root) => root.type as ExpenseType,
            }),
            quantity: t.exposeInt('quantity'),
            unitPrice: t.exposeFloat('unitPrice'),
            amount: t.exposeFloat('amount'),
        }),
    });

export const ManpowerPothosRef = builder
    .objectRef<{
        technician: string;
        payAmount: number;
    }>('Manpower')
    .implement({
        fields: (t) => ({
            technician: t.exposeString('technician'),
            payAmount: t.exposeFloat('payAmount'),
        }),
    });

export const BudgetBranchPothosRef = builder
    .objectRef<{
        name: string | null;
        number: number | null;
    }>('BudgetBranch')
    .implement({
        fields: (t) => ({
            name: t.exposeString('name', { nullable: true }),
            number: t.exposeInt('number', { nullable: true }),
        }),
    });

export const BudgetStatusPothosRef = builder.enumType('BudgetStatus', {
    values: Object.values(BudgetStatus),
});

export const BudgetPothosRef = builder.prismaObject('Budget', {
    fields: (t) => ({
        id: t.exposeID('id'),
        budgetNumber: t.exposeInt('budgetNumber'),
        subject: t.exposeString('subject'),
        description: t.exposeString('description', { nullable: true }),
        price: t.exposeFloat('price'),
        status: t.field({
            type: BudgetStatusPothosRef,
            resolve: (root) => root.status as BudgetStatus,
        }),
        clientName: t.exposeString('clientName', { nullable: true }),
        markup: t.exposeFloat('markup', { nullable: true }),
        totalExpectedExpenses: t.exposeFloat('totalExpectedExpenses'),
        expectedExpenses: t.field({
            type: [ExpectedExpensePothosRef],
            resolve: (root) => root.expectedExpenses as any,
        }),
        manpower: t.field({
            type: [ManpowerPothosRef],
            resolve: (root) => root.manpower as any,
        }),
        budgetBranch: t.field({
            type: BudgetBranchPothosRef,
            nullable: true,
            resolve: (root) => root.budgetBranch as any,
        }),
        createdAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.createdAt,
        }),
        updatedAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.updatedAt,
        }),
        deleted: t.boolean({
            resolve: (root) => root.deleted,
        }),
        deletedAt: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.deletedAt,
        }),
        billingProfile: t.relation('billingProfile'),
        client: t.relation('client', { nullable: true }),
        branch: t.relation('branch', { nullable: true }),
        createdBy: t.relation('createdBy'),
    }),
});

// Input types para los nuevos campos
export const ExpectedExpenseInputPothosRef = builder.inputType('ExpectedExpenseInput', {
    fields: (t) => ({
        type: t.field({
            type: ExpenseTypePothosRef,
            required: true,
        }),
        quantity: t.int({ required: false }),
        amount: t.float({ required: true }),
        unitPrice: t.float({ required: true }),
    }),
});

export const ManpowerInputPothosRef = builder.inputType('ManpowerInput', {
    fields: (t) => ({
        technician: t.string({ required: true }),
        payAmount: t.float({ required: true }),
    }),
});

export const BudgetBranchInputPothosRef = builder.inputType('BudgetBranchInput', {
    fields: (t) => ({
        name: t.string({ required: false }),
        number: t.int({ required: false }),
    }),
});

export const BudgetInputPothosRef = builder.inputType('BudgetInput', {
    fields: (t) => ({
        subject: t.string({
            required: true,
        }),
        description: t.string({
            required: false,
        }),
        price: t.float({
            required: true,
        }),
        billingProfileId: t.string({
            required: true,
        }),
        clientName: t.string({
            required: false,
        }),
        clientId: t.string({
            required: false,
        }),
        branchId: t.string({
            required: false,
        }),
        markup: t.float({
            required: false,
        }),
        expectedExpenses: t.field({
            type: [ExpectedExpenseInputPothosRef],
            required: false,
        }),
        manpower: t.field({
            type: [ManpowerInputPothosRef],
            required: false,
        }),
        budgetBranch: t.field({
            type: BudgetBranchInputPothosRef,
            required: false,
        }),
    }),
});

export const UpdateBudgetInputPothosRef = builder.inputType('UpdateBudgetInput', {
    fields: (t) => ({
        subject: t.string({
            required: false,
        }),
        description: t.string({
            required: false,
        }),
        price: t.float({
            required: false,
        }),
        clientName: t.string({
            required: false,
        }),
        clientId: t.string({
            required: false,
        }),
        branchId: t.string({
            required: false,
        }),
        markup: t.float({
            required: false,
        }),
        expectedExpenses: t.field({
            type: [ExpectedExpenseInputPothosRef],
            required: false,
        }),
        manpower: t.field({
            type: [ManpowerInputPothosRef],
            required: false,
        }),
        budgetBranch: t.field({
            type: BudgetBranchInputPothosRef,
            required: false,
        }),
    }),
});

export const UpdateBudgetStatusInputPothosRef = builder.inputType(
    'UpdateBudgetStatusInput',
    {
        fields: (t) => ({
            status: t.field({
                type: BudgetStatusPothosRef,
                required: true,
            }),
        }),
    },
);

export const CreateBudgetWithBillingProfileInputPothosRef = builder.inputType(
    'CreateBudgetWithBillingProfileInput',
    {
        fields: (t) => ({
            // Datos del presupuesto
            subject: t.string({
                required: true,
            }),
            description: t.string({
                required: false,
            }),
            price: t.float({
                required: true,
            }),
            clientName: t.string({
                required: false,
            }),
            clientId: t.string({
                required: false,
            }),
            branchId: t.string({
                required: false,
            }),
            markup: t.float({
                required: false,
            }),
            expectedExpenses: t.field({
                type: [ExpectedExpenseInputPothosRef],
                required: false,
            }),
            manpower: t.field({
                type: [ManpowerInputPothosRef],
                required: false,
            }),
            budgetBranch: t.field({
                type: BudgetBranchInputPothosRef,
                required: false,
            }),
            // Datos del perfil de facturación (opcional si ya existe)
            billingProfileId: t.string({
                required: false,
            }),
            // Datos para crear nuevo perfil de facturación
            businessId: t.string({
                required: false,
            }),
            businessName: t.string({
                required: false,
            }),
            businessNumeroDocumento: t.string({
                required: false,
            }),
            businessTipoDocumento: t.string({
                required: false,
            }),
            businessBillingEmails: t.stringList({
                required: false,
            }),
            businessLegalName: t.string({
                required: false,
            }),
            businessComercialAddress: t.string({
                required: false,
            }),
            businessIVACondition: t.string({
                required: false,
            }),
            contacts: t.field({
                type: [ContactInputPothosRef],
                required: false,
            }),
        }),
    },
);

export const BudgetCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        budget?: Budget;
    }>('BudgetCrudResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            budget: t.field({
                type: BudgetPothosRef,
                nullable: true,
                resolve: (result) => result.budget,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
        }),
    });
