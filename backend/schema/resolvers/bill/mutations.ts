import { BillStatus } from '@prisma/client';

import { BillCrudResultPothosRef, BillInputPothosRef, BillStatusPothosRef } from './refs';

import { BillInput } from '@/api/graphql';
import { prisma } from 'lib/prisma';

import {
    emitirFacturaElectronica,
    handleTaskRelations,
    linkTasksToBill,
} from '../../../services/billService';
import { builder } from '../../builder';

builder.mutationFields((t) => ({
    createBill: t.field({
        type: BillCrudResultPothosRef,
        args: {
            input: t.arg({
                type: BillInputPothosRef,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            try {
                const { input } = args;
                // Obtener datos del perfil de facturación y empresa
                const billingProfile = await prisma.billingProfile.findUnique({
                    where: { id: input.billingProfileId },
                    include: { business: true },
                });
                if (!billingProfile) {
                    return {
                        success: false,
                        message: 'Perfil de facturación no encontrado',
                    };
                }

                // Crear la factura en la base de datos
                const bill = await prisma.bill.create({
                    data: {
                        businessId: billingProfile.businessId,
                        billingProfileId: input.billingProfileId,
                        status: input.status,
                        description: input.description,
                        comprobanteType: input.comprobanteType,
                        saleCondition: input.saleCondition,
                        punctualService: input.punctualService,
                        serviceDate: input.serviceDate,
                        startDate: input.startDate,
                        endDate: input.endDate,
                        dueDate: input.dueDate,
                        tasks: input.taskIds
                            ? { connect: input.taskIds.map((taskId) => ({ id: taskId })) }
                            : undefined,
                        // Nuevos campos
                        pointOfSale: input.pointOfSale,
                        concepto: input.concepto,
                        observations: input.observations,
                        serviceOrderId: input.serviceOrderId || null,
                        totalAmount: input.totalAmount,
                        taxableNetAmount: input.taxableNetAmount,
                        nonTaxableNetAmount: input.nonTaxableNetAmount,
                        exemptAmount: input.exemptAmount,
                        ivaAmount: input.ivaAmount,
                        tributesAmount: input.tributesAmount,
                    },
                });

                // linkear detalles
                input.details.forEach(async (detail) => {
                    const createdDetail = await prisma.billDetail.create({
                        data: {
                            description: detail.description,
                            quantity: detail.quantity,
                            unitPrice: detail.unitPrice,
                            alicuotaIVA: detail.alicuotaIVA,
                            taskId: detail.taskId || null,
                            billId: bill.id,
                        },
                    });
                    console.log('Detalle creado:', createdDetail);
                });

                // Asociar tareas a la factura y sus detalles si se proporcionaron taskIds
                await linkTasksToBill(bill.id, input as BillInput);

                // Si el estado es Emitida, emitir la factura electrónica
                if (input.status === BillStatus.Pendiente) {
                    try {
                        const billEmitida = await emitirFacturaElectronica(bill.id);
                        return {
                            success: true,
                            bill: billEmitida,
                        };
                    } catch (error) {
                        // Si falla la emisión, actualizar el estado a Borrador
                        await prisma.bill.update({
                            where: { id: bill.id },
                            data: { status: 'Borrador' },
                        });
                        return {
                            success: false,
                            message:
                                'Error al emitir factura electrónica: ' +
                                (error instanceof Error ? error.message : error),
                        };
                    }
                }

                return {
                    success: true,
                    bill,
                };
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        },
    }),

    updateBill: t.field({
        type: BillCrudResultPothosRef,
        args: {
            id: t.arg.string({ required: true }),
            input: t.arg({
                type: BillInputPothosRef,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            try {
                const { id, input } = args;
                const bill = await prisma.bill.findUnique({
                    where: { id },
                    include: {
                        tasks: true,
                        details: true,
                    },
                });
                if (!bill) {
                    return {
                        success: false,
                        message: 'Factura no encontrada',
                    };
                }
                await handleTaskRelations(id, input as BillInput);

                const currentDetails = bill.details || [];
                const detailsToDelete = currentDetails.filter((detail) => {
                    return !input.details.some(
                        (inputDetail) => inputDetail.id === detail.id,
                    );
                });

                detailsToDelete.forEach(async (detail) => {
                    await prisma.billDetail.softDeleteOne({ id: detail.id });
                    await prisma.billDetail.update({
                        where: { id: detail.id },
                        data: {
                            billId: null,
                            taskId: null,
                        },
                    });
                    await prisma.task.update({
                        where: { id: detail.taskId ?? '' },
                        data: { billDetailId: null },
                    });
                });

                // Actualizar la factura en la base de datos
                const updated = await prisma.bill.update({
                    where: { id },
                    data: {
                        billingProfileId: input.billingProfileId,
                        status: input.status,
                        description: input.description,
                        comprobanteType: input.comprobanteType,
                        saleCondition: input.saleCondition,
                        punctualService: input.punctualService,
                        serviceDate: input.serviceDate,
                        startDate: input.startDate,
                        endDate: input.endDate,
                        dueDate: input.dueDate,
                        tasks: input.taskIds
                            ? { set: input.taskIds.map((taskId) => ({ id: taskId })) }
                            : undefined,
                        // Nuevos campos
                        pointOfSale: input.pointOfSale,
                        concepto: input.concepto,
                        observations: input.observations,
                        serviceOrderId: input.serviceOrderId || null,
                        // Totales y montos calculados
                        totalAmount: input.totalAmount ?? null,
                        taxableNetAmount: input.taxableNetAmount ?? null,
                        nonTaxableNetAmount: input.nonTaxableNetAmount ?? null,
                        exemptAmount: input.exemptAmount ?? null,
                        ivaAmount: input.ivaAmount ?? null,
                        tributesAmount: input.tributesAmount ?? null,
                        withholdingAmount: input.withholdingAmount ?? null,
                    },
                });
                input.details.forEach(async (detail) => {
                    console.log('Procesando detalle:', detail);
                    if (detail.id) {
                        // Actualizar detalle existente
                        console.log('actualizando detalle', detail.id);
                        await prisma.billDetail.update({
                            where: { id: detail.id },
                            data: {
                                description: detail.description,
                                quantity: detail.quantity,
                                unitPrice: detail.unitPrice,
                                alicuotaIVA: detail.alicuotaIVA,
                                taskId: detail.taskId || null,
                            },
                        });
                    } else {
                        await prisma.billDetail.create({
                            data: {
                                description: detail.description,
                                quantity: detail.quantity,
                                unitPrice: detail.unitPrice,
                                alicuotaIVA: detail.alicuotaIVA,
                                taskId: detail.taskId || null,
                                billId: id,
                            },
                        });
                    }
                });

                handleTaskRelations(id, input as BillInput);

                // Si el estado cambió a Emitida, emitir la factura electrónica
                if (
                    input.status === BillStatus.Pendiente &&
                    bill.status === BillStatus.Borrador
                ) {
                    try {
                        const billEmitida = await emitirFacturaElectronica(id);
                        return {
                            success: true,
                            bill: billEmitida,
                        };
                    } catch (error) {
                        // Si falla la emisión, revertir el estado
                        await prisma.bill.update({
                            where: { id },
                            data: { status: bill.status },
                        });
                        return {
                            success: false,
                            message:
                                'Error al emitir factura electrónica: ' +
                                (error instanceof Error ? error.message : error),
                        };
                    }
                }

                return {
                    success: true,
                    bill: updated,
                };
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        },
    }),

    /**
     * Eliminar factura (solo si está en borrador)
     */
    deleteBill: t.field({
        type: BillCrudResultPothosRef,
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            try {
                const { id } = args;
                const bill = await prisma.bill.findUnique({ where: { id } });
                if (!bill) {
                    return {
                        success: false,
                        message: 'Factura no encontrada',
                    };
                }

                // Solo se pueden eliminar facturas en borrador
                if (bill.status !== BillStatus.Borrador) {
                    return {
                        success: false,
                        message: 'Solo se pueden eliminar facturas en estado Borrador',
                    };
                }

                const deleted = await prisma.bill.delete({ where: { id } });

                return {
                    success: true,
                    bill: deleted,
                    message: 'Factura eliminada correctamente',
                };
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        },
    }),

    /**
     * Actualizar estado de factura
     */
    updateBillStatus: t.field({
        type: BillCrudResultPothosRef,
        args: {
            id: t.arg.string({ required: true }),
            status: t.arg({
                type: BillStatusPothosRef,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            try {
                const { id, status } = args;
                const bill = await prisma.bill.findUnique({ where: { id } });
                if (!bill) {
                    return {
                        success: false,
                        message: 'Factura no encontrada',
                    };
                }

                // No permitir cambios si la factura ya fue emitida
                if (
                    bill.status === BillStatus.Pendiente &&
                    status === BillStatus.Borrador
                ) {
                    return {
                        success: false,
                        message:
                            'No se puede cambiar el estado de una factura ya emitida a borrador nuevamente',
                    };
                }

                const updated = await prisma.bill.update({
                    where: { id },
                    data: { status },
                });

                return {
                    success: true,
                    bill: updated,
                };
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        },
    }),

    /**
     * Emitir factura electrónica
     */
    emitBill: t.field({
        type: BillCrudResultPothosRef,
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            try {
                const { id } = args;
                const bill = await prisma.bill.findUnique({ where: { id } });
                if (!bill) {
                    return {
                        success: false,
                        message: 'Factura no encontrada',
                    };
                }

                // Solo se pueden emitir facturas en borrador o pendiente
                if (bill.status === BillStatus.Pendiente) {
                    return {
                        success: false,
                        message: 'La factura ya fue emitida',
                    };
                }

                // Emitir la factura electrónica
                const billEmitida = await emitirFacturaElectronica(id);

                return {
                    success: true,
                    bill: billEmitida,
                    message: 'Factura emitida correctamente',
                };
            } catch (error) {
                // Si falla, mantener el estado anterior
                return {
                    success: false,
                    message:
                        'Error al emitir factura: ' +
                        (error instanceof Error ? error.message : String(error)),
                };
            }
        },
    }),
}));
