import { Budget, BudgetStatus } from '@prisma/client';

import { builder } from '../../builder';
import { ContactInputPothosRef } from '../billingProfile/refs';

export const BudgetStatusPothosRef = builder.enumType('BudgetStatus', {
    values: Object.values(BudgetStatus),
});

export const BudgetPothosRef = builder.prismaObject('Budget', {
    fields: (t) => ({
        id: t.exposeID('id'),
        subject: t.exposeString('subject'),
        description: t.exposeString('description', { nullable: true }),
        price: t.exposeFloat('price'),
        status: t.field({
            type: BudgetStatusPothosRef,
            resolve: (root) => root.status as BudgetStatus,
        }),
        clientName: t.exposeString('clientName', { nullable: true }),
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
            businessCUIT: t.string({
                required: false,
            }),
            businessBillingEmail: t.string({
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
