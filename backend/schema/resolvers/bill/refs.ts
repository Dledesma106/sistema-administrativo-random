import {
    BillStatus,
    CAEStatus,
    AlicuotaIVA,
    ComprobanteType,
    BillConcepto,
} from '@prisma/client';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';
import { IVAConditionPothosRef } from '../billingProfile/refs';
import { TaskPothosRef } from '../task/refs';

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

export const BillConceptoPothosRef = builder.enumType('BillConcepto', {
    values: Object.fromEntries(
        Object.entries(BillConcepto).map(([name, value]) => [name, { value }]),
    ),
});

// Tipos para las respuestas de configuración de AFIP
export const AfipConfigItemRef = builder
    .objectRef<{ code: number; label: string }>('AfipConfigItem')
    .implement({
        fields: (t) => ({
            code: t.exposeInt('code'),
            label: t.exposeString('label'),
        }),
    });

export const AfipMonedaItemRef = builder
    .objectRef<{ code: string; label: string }>('AfipMonedaItem')
    .implement({
        fields: (t) => ({
            code: t.exposeString('code'),
            label: t.exposeString('label'),
        }),
    });

export const AfipSalesPointRef = builder
    .objectRef<{ number: number; type: string; blocked: boolean }>('AfipSalesPoint')
    .implement({
        fields: (t) => ({
            number: t.exposeInt('number'),
            type: t.exposeString('type'),
            blocked: t.exposeBoolean('blocked'),
        }),
    });

export const BillDetailPothosRef = builder
    .objectRef<{
        description: string;
        quantity: number;
        unitPrice: number;
        alicuotaIVA: AlicuotaIVA;
        taskId?: string | null;
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
            taskId: t.string({
                nullable: true,
                resolve: (root) => root.taskId || null,
            }),
            // Resolver para obtener la tarea asociada a este detalle
            task: t.field({
                type: TaskPothosRef,
                nullable: true,
                resolve: async (root) => {
                    if (!root.taskId) {
                        return null;
                    }
                    return prisma.task.findFirst({
                        where: {
                            id: root.taskId,
                            deleted: false,
                        },
                    });
                },
            }),
        }),
    });

export const CAEDataPothosRef = builder
    .objectRef<{
        code: string;
        expirationDate: Date;
        status: CAEStatus;
    }>('CAEData')
    .implement({
        fields: (t) => ({
            code: t.exposeString('code'),
            expirationDate: t.field({
                type: 'DateTime',
                resolve: (root) => root.expirationDate,
            }),
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
        pointOfSale: t.exposeInt('pointOfSale', { nullable: true }),

        // Nuevos campos de número de comprobante
        comprobanteNumber: t.exposeString('comprobanteNumber', { nullable: true }),

        // Fecha de emisión
        emissionDate: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.emissionDate,
        }),

        // Importes calculados
        totalAmount: t.exposeFloat('totalAmount', { nullable: true }),
        nonTaxableNetAmount: t.exposeFloat('nonTaxableNetAmount', { nullable: true }),
        taxableNetAmount: t.exposeFloat('taxableNetAmount', { nullable: true }),
        exemptAmount: t.exposeFloat('exemptAmount', { nullable: true }),
        ivaAmount: t.exposeFloat('ivaAmount', { nullable: true }),
        tributesAmount: t.exposeFloat('tributesAmount', { nullable: true }),

        // Concepto AFIP
        concepto: t.field({
            type: BillConceptoPothosRef,
            nullable: true,
            resolve: (root) => root.concepto,
        }),

        // Observaciones
        observations: t.exposeString('observations', { nullable: true }),

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

        // Relación con tareas (una factura puede tener múltiples tareas)
        tasks: t.relation('tasks'),

        // Relación con orden de servicio (opcional)
        serviceOrder: t.relation('serviceOrder', { nullable: true }),
    }),
});

export const BillCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        bill?: unknown;
    }>('BillCrudResult')
    .implement({
        fields: (t) => ({
            success: t.exposeBoolean('success'),
            message: t.exposeString('message', { nullable: true }),
            bill: t.field({
                type: BillPothosRef,
                nullable: true,
                resolve: (parent) =>
                    (parent.bill as typeof BillPothosRef.$inferType) || null,
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
        // ID de tarea asociada a este detalle (opcional, una sola)
        taskId: t.string({ required: false }),
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
        // Nuevos campos
        pointOfSale: t.int({ required: false }),
        concepto: t.field({
            type: BillConceptoPothosRef,
            required: false,
        }),
        observations: t.string({ required: false }),
        // ID de orden de servicio asociada (opcional)
        serviceOrderId: t.string({ required: false }),
    }),
});
