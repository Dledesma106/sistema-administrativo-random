import { BillStatus } from '@prisma/client';

import { BillCrudResultPothosRef, BillInputPothosRef, BillStatusPothosRef } from './refs';

import { prisma } from 'lib/prisma';

import { emitirFacturaElectronica } from '../../../services/billService';
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

                // Mapear detalles
                const mappedDetails = input.details.map((detail) => ({
                    description: detail.description,
                    quantity: detail.quantity,
                    unitPrice: detail.unitPrice,
                    alicuotaIVA: detail.alicuotaIVA,
                    taskId: detail.taskId || null,
                }));

                // Crear la factura en la base de datos
                const bill = await prisma.bill.create({
                    data: {
                        businessId: billingProfile.businessId,
                        billingProfileId: input.billingProfileId,
                        legalName: billingProfile.legalName,
                        CUIT: billingProfile.numeroDocumento,
                        billingAddress: billingProfile.comercialAddress,
                        IVACondition: billingProfile.IVACondition,
                        status: input.status,
                        description: input.description,
                        comprobanteType: input.comprobanteType,
                        saleCondition: input.saleCondition,
                        punctualService: input.punctualService,
                        serviceDate: input.serviceDate,
                        startDate: input.startDate,
                        endDate: input.endDate,
                        dueDate: input.dueDate,
                        details: mappedDetails,
                        // Nuevos campos
                        pointOfSale: input.pointOfSale,
                        concepto: input.concepto,
                        observations: input.observations,
                        serviceOrderId: input.serviceOrderId || null,
                    },
                });

                // Si el estado es Emitida, emitir la factura electrónica
                if (input.status === 'Pendiente') {
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
                const bill = await prisma.bill.findUnique({ where: { id } });
                if (!bill) {
                    return {
                        success: false,
                        message: 'Factura no encontrada',
                    };
                }

                // Mapear detalles
                const mappedDetails = input.details.map((detail) => ({
                    description: detail.description,
                    quantity: detail.quantity,
                    unitPrice: detail.unitPrice,
                    alicuotaIVA: detail.alicuotaIVA,
                    taskId: detail.taskId || null,
                }));

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
                        details: mappedDetails,
                        // Nuevos campos
                        pointOfSale: input.pointOfSale,
                        concepto: input.concepto,
                        observations: input.observations,
                        serviceOrderId: input.serviceOrderId || null,
                    },
                });

                // Si el estado cambió a Emitida, emitir la factura electrónica
                if (input.status === 'Pendiente' && bill.status !== 'Pendiente') {
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
                if (bill.status === BillStatus.Emitida && status !== BillStatus.Emitida) {
                    return {
                        success: false,
                        message:
                            'No se puede cambiar el estado de una factura ya emitida',
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
                if (bill.status === BillStatus.Emitida) {
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

    // ============================================================================
    // MUTATIONS PARA ASOCIAR/DESASOCIAR TAREAS
    // ============================================================================

    /**
     * Asociar tarea a factura (actualiza Task.billId)
     */
    associateTaskToBill: t.field({
        type: BillCrudResultPothosRef,
        args: {
            billId: t.arg.string({ required: true }),
            taskId: t.arg.string({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            try {
                const { billId, taskId } = args;

                // Verificar que la factura existe
                const bill = await prisma.bill.findUnique({ where: { id: billId } });
                if (!bill) {
                    return {
                        success: false,
                        message: 'Factura no encontrada',
                    };
                }

                // Verificar que la tarea existe
                const task = await prisma.task.findUnique({ where: { id: taskId } });
                if (!task) {
                    return {
                        success: false,
                        message: 'Tarea no encontrada',
                    };
                }

                // Verificar que la tarea no está ya asociada a otra factura
                if (task.billId) {
                    if (task.billId === billId) {
                        return {
                            success: false,
                            message: 'La tarea ya está asociada a esta factura',
                        };
                    }
                    return {
                        success: false,
                        message: 'La tarea ya está asociada a otra factura',
                    };
                }

                // Asociar la tarea a la factura (actualizar Task.billId)
                await prisma.task.update({
                    where: { id: taskId },
                    data: { billId },
                });

                // Obtener la factura actualizada con las tareas
                const updatedBill = await prisma.bill.findUnique({
                    where: { id: billId },
                    include: { tasks: true },
                });

                return {
                    success: true,
                    bill: updatedBill,
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
     * Asociar múltiples tareas a una factura
     */
    associateTasksToBill: t.field({
        type: BillCrudResultPothosRef,
        args: {
            billId: t.arg.string({ required: true }),
            taskIds: t.arg.stringList({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            try {
                const { billId, taskIds } = args;

                // Verificar que la factura existe
                const bill = await prisma.bill.findUnique({ where: { id: billId } });
                if (!bill) {
                    return {
                        success: false,
                        message: 'Factura no encontrada',
                    };
                }

                // Verificar que las tareas existen
                const tasks = await prisma.task.findMany({
                    where: { id: { in: taskIds } },
                });
                if (tasks.length !== taskIds.length) {
                    return {
                        success: false,
                        message: 'Una o más tareas no fueron encontradas',
                    };
                }

                // Verificar que ninguna tarea está ya asociada a otra factura
                const tasksWithBill = tasks.filter(
                    (t) => t.billId && t.billId !== billId,
                );
                if (tasksWithBill.length > 0) {
                    return {
                        success: false,
                        message: `${tasksWithBill.length} tarea(s) ya están asociadas a otra factura`,
                    };
                }

                // Filtrar tareas que ya están asociadas a esta factura
                const newTaskIds = taskIds.filter(
                    (id) => !tasks.find((t) => t.id === id && t.billId === billId),
                );

                if (newTaskIds.length === 0) {
                    return {
                        success: false,
                        message: 'Todas las tareas ya están asociadas a esta factura',
                    };
                }

                // Asociar las tareas a la factura
                await prisma.task.updateMany({
                    where: { id: { in: newTaskIds } },
                    data: { billId },
                });

                // Obtener la factura actualizada con las tareas
                const updatedBill = await prisma.bill.findUnique({
                    where: { id: billId },
                    include: { tasks: true },
                });

                return {
                    success: true,
                    bill: updatedBill,
                    message: `${newTaskIds.length} tarea(s) asociada(s) correctamente`,
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
     * Desasociar tarea de factura
     */
    dissociateTaskFromBill: t.field({
        type: BillCrudResultPothosRef,
        args: {
            billId: t.arg.string({ required: true }),
            taskId: t.arg.string({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            try {
                const { billId, taskId } = args;

                // Verificar que la factura existe
                const bill = await prisma.bill.findUnique({ where: { id: billId } });
                if (!bill) {
                    return {
                        success: false,
                        message: 'Factura no encontrada',
                    };
                }

                // Verificar que la tarea existe y está asociada a esta factura
                const task = await prisma.task.findUnique({ where: { id: taskId } });
                if (!task) {
                    return {
                        success: false,
                        message: 'Tarea no encontrada',
                    };
                }

                if (task.billId !== billId) {
                    return {
                        success: false,
                        message: 'La tarea no está asociada a esta factura',
                    };
                }

                // Desasociar la tarea de la factura
                await prisma.task.update({
                    where: { id: taskId },
                    data: { billId: null },
                });

                // También limpiar el taskId del detalle si está asociada
                const updatedDetails = bill.details.map((detail) => ({
                    ...detail,
                    taskId: detail.taskId === taskId ? null : detail.taskId,
                }));

                if (JSON.stringify(updatedDetails) !== JSON.stringify(bill.details)) {
                    await prisma.bill.update({
                        where: { id: billId },
                        data: { details: updatedDetails },
                    });
                }

                // Obtener la factura actualizada
                const updatedBill = await prisma.bill.findUnique({
                    where: { id: billId },
                    include: { tasks: true },
                });

                return {
                    success: true,
                    bill: updatedBill,
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
     * Asociar tarea a un detalle específico de la factura
     */
    associateTaskToBillDetail: t.field({
        type: BillCrudResultPothosRef,
        args: {
            billId: t.arg.string({ required: true }),
            detailIndex: t.arg.int({ required: true }),
            taskId: t.arg.string({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            try {
                const { billId, detailIndex, taskId } = args;

                // Verificar que la factura existe
                const bill = await prisma.bill.findUnique({ where: { id: billId } });
                if (!bill) {
                    return {
                        success: false,
                        message: 'Factura no encontrada',
                    };
                }

                // Verificar que el índice del detalle es válido
                if (detailIndex < 0 || detailIndex >= bill.details.length) {
                    return {
                        success: false,
                        message: 'Índice de detalle inválido',
                    };
                }

                // Verificar que la tarea existe
                const task = await prisma.task.findUnique({ where: { id: taskId } });
                if (!task) {
                    return {
                        success: false,
                        message: 'Tarea no encontrada',
                    };
                }

                // Verificar que el detalle no tiene ya una tarea asociada
                const detail = bill.details[detailIndex];
                if (detail.taskId) {
                    if (detail.taskId === taskId) {
                        return {
                            success: false,
                            message: 'La tarea ya está asociada a este detalle',
                        };
                    }
                    return {
                        success: false,
                        message: 'Este detalle ya tiene una tarea asociada',
                    };
                }

                // Verificar que la tarea no está ya asociada a otra factura
                if (task.billId && task.billId !== billId) {
                    return {
                        success: false,
                        message: 'La tarea ya está asociada a otra factura',
                    };
                }

                // Actualizar el detalle con la tarea
                const updatedDetails = bill.details.map((d, index) => {
                    if (index === detailIndex) {
                        return {
                            ...d,
                            taskId,
                        };
                    }
                    return d;
                });

                // Actualizar la factura con los detalles modificados
                await prisma.bill.update({
                    where: { id: billId },
                    data: { details: updatedDetails },
                });

                // Asociar la tarea a la factura si no lo está
                if (task.billId !== billId) {
                    await prisma.task.update({
                        where: { id: taskId },
                        data: { billId },
                    });
                }

                // Obtener la factura actualizada
                const updatedBill = await prisma.bill.findUnique({
                    where: { id: billId },
                    include: { tasks: true },
                });

                return {
                    success: true,
                    bill: updatedBill,
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
     * Desasociar tarea de un detalle específico (sin removerla de la factura)
     */
    dissociateTaskFromBillDetail: t.field({
        type: BillCrudResultPothosRef,
        args: {
            billId: t.arg.string({ required: true }),
            detailIndex: t.arg.int({ required: true }),
            taskId: t.arg.string({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            try {
                const { billId, detailIndex, taskId } = args;

                // Verificar que la factura existe
                const bill = await prisma.bill.findUnique({ where: { id: billId } });
                if (!bill) {
                    return {
                        success: false,
                        message: 'Factura no encontrada',
                    };
                }

                // Verificar que el índice del detalle es válido
                if (detailIndex < 0 || detailIndex >= bill.details.length) {
                    return {
                        success: false,
                        message: 'Índice de detalle inválido',
                    };
                }

                // Verificar que la tarea está asociada al detalle
                const detail = bill.details[detailIndex];
                if (detail.taskId !== taskId) {
                    return {
                        success: false,
                        message: 'La tarea no está asociada a este detalle',
                    };
                }

                // Actualizar el detalle removiendo la tarea
                const updatedDetails = bill.details.map((d, index) => {
                    if (index === detailIndex) {
                        return {
                            ...d,
                            taskId: null,
                        };
                    }
                    return d;
                });

                const updatedBill = await prisma.bill.update({
                    where: { id: billId },
                    data: { details: updatedDetails },
                    include: { tasks: true },
                });

                return {
                    success: true,
                    bill: updatedBill,
                };
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        },
    }),
}));
