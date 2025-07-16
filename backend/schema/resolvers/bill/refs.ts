import { BillStatus, CAEStatus, AlicuotaIVA, ComprobanteType } from '@prisma/client';
import { IVAConditionPothosRef } from '../billingProfile/refs';

import { builder } from '../../builder';

export const BillStatusPothosRef = builder.enumType('BillStatus', {
    values: Object.fromEntries(
        Object.entries(BillStatus).map(([name, value]) => [name, { value }]),
    ),
});

export const CAEStatusPothosRef = builder.enumType('CAEStatus', {
    values: Object.fromEntries(
        Object.entries(CAEStatus).map(([name, value]) => [name, { value }]),
    ),
});

export const AlicuotaIVAPothosRef = builder.enumType('AlicuotaIVA', {
    values: Object.fromEntries(
        Object.entries(AlicuotaIVA).map(([name, value]) => [name, { value }]),
    ),
});

export const ComprobanteTypePothosRef = builder.enumType('ComprobanteType', {
    values: Object.fromEntries(
        Object.entries(ComprobanteType).map(([name, value]) => [name, { value }]),
    ),
});

export const BillDetailPothosRef = builder
    .objectRef<{
        description: string;
        quantity: number;
        unitPrice: number;
        alicuotaIVA: AlicuotaIVA;
    }>('BillDetail')
    .implement({
        fields: (t) => ({
            description: t.exposeString('description'),
            quantity: t.exposeInt('quantity'),
            unitPrice: t.exposeFloat('unitPrice'),
            alicuotaIVA: t.field({
                type: AlicuotaIVAPothosRef,
                resolve: (root) => root.alicuotaIVA,
            }),
        }),
    });

export const CAEDataPothosRef = builder
    .objectRef<{
        code: string;
        expirationDate: Date;
        comprobanteNumber: string;
        status: CAEStatus;
    }>('CAEData')
    .implement({
        fields: (t) => ({
            code: t.exposeString('code'),
            expirationDate: t.field({
                type: 'DateTime',
                resolve: (root) => root.expirationDate,
            }),
            comprobanteNumber: t.exposeString('comprobanteNumber'),
            status: t.field({
                type: CAEStatusPothosRef,
                resolve: (root) => root.status,
            }),
        }),
    });

export const BillPothosRef = builder.prismaObject('Bill', {
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
        business: t.relation('business'),
        billingProfile: t.relation('billingProfile'),
        legalName: t.exposeString('legalName'),
        CUIT: t.exposeString('CUIT'),
        billingAddress: t.exposeString('billingAddress'),
        IVACondition: t.field({
            type: IVAConditionPothosRef,
            resolve: (root) => root.IVACondition,
        }),
        status: t.field({
            type: BillStatusPothosRef,
            resolve: (root) => root.status,
        }),
        description: t.exposeString('description', { nullable: true }),
        comprobanteType: t.field({
            type: ComprobanteTypePothosRef,
            resolve: (root) => root.comprobanteType,
        }),
        saleCondition: t.exposeString('saleCondition'),
        punctualService: t.exposeBoolean('punctualService'),
        serviceDate: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.serviceDate,
        }),
        startDate: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.startDate,
        }),
        endDate: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.endDate,
        }),
        dueDate: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.dueDate,
        }),
        caeData: t.field({
            type: CAEDataPothosRef,
            nullable: true,
            resolve: (root) => root.caeData,
        }),
        details: t.field({
            type: [BillDetailPothosRef],
            resolve: (root) => root.details,
        }),
        withholdingAmount: t.exposeFloat('withholdingAmount', { nullable: true }),
    }),
});

export const BillCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        bill?: any;
    }>('BillCrudResult')
    .implement({
        fields: (t) => ({
            success: t.exposeBoolean('success'),
            message: t.exposeString('message', { nullable: true }),
            bill: t.field({
                type: BillPothosRef,
                nullable: true,
                resolve: (parent) => parent.bill || null,
            }),
        }),
    });

export const BillDetailInputPothosRef = builder.inputType('BillDetailInput', {
    fields: (t) => ({
        description: t.string({ required: true }),
        quantity: t.int({ required: true }),
        unitPrice: t.float({ required: true }),
        alicuotaIVA: t.field({
            type: AlicuotaIVAPothosRef,
            required: true,
        }),
    }),
});

export const BillInputPothosRef = builder.inputType('BillInput', {
    fields: (t) => ({
        billingProfileId: t.string({ required: true }),
        comprobanteType: t.field({
            type: ComprobanteTypePothosRef,
            required: true,
        }),
        saleCondition: t.string({ required: true }),
        punctualService: t.boolean({ required: true }),
        serviceDate: t.field({
            type: 'DateTime',
            required: false,
        }),
        startDate: t.field({
            type: 'DateTime',
            required: false,
        }),
        endDate: t.field({
            type: 'DateTime',
            required: false,
        }),
        dueDate: t.field({
            type: 'DateTime',
            required: false,
        }),
        details: t.field({
            type: [BillDetailInputPothosRef],
            required: true,
        }),
        description: t.string({ required: false }),
        status: t.field({
            type: BillStatusPothosRef,
            required: true,
        }),
        withholdingAmount: t.float({ required: false }),
    }),
});
