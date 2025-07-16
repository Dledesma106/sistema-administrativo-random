import { BillCrudResultPothosRef, BillInputPothosRef } from './refs';

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

                // Crear la factura en la base de datos
                const bill = await prisma.bill.create({
                    data: {
                        businessId: billingProfile.businessId,
                        billingProfileId: input.billingProfileId,
                        legalName: billingProfile.legalName,
                        CUIT: billingProfile.CUIT,
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
                        details: input.details,
                    },
                });

                // Si el estado es Emitida, emitir la factura electrónica
                if (input.status === 'Emitida') {
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
                            message: 'Error al emitir factura electrónica: ' + (error instanceof Error ? error.message : error),
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
                        details: input.details,
                    },
                });

                // Si el estado cambió a Emitida, emitir la factura electrónica
                if (input.status === 'Emitida' && bill.status !== 'Emitida') {
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
                            message: 'Error al emitir factura electrónica: ' + (error instanceof Error ? error.message : error),
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
}));
