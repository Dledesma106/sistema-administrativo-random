import {
    TaskPriceCrudResultPothosRef,
    TaskPriceInputPothosRef,
    TaskPriceUpdateInputPothosRef,
} from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

builder.mutationFields((t) => ({
    createTaskPrice: t.field({
        type: TaskPriceCrudResultPothosRef,
        args: {
            input: t.arg({
                type: TaskPriceInputPothosRef,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoTecnico', 'IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            try {
                const { input } = args;

                // Verificar si ya existe un precio para esta empresa y tipo de tarea
                const existingTaskPrice = await prisma.taskPrice.findUnique({
                    where: {
                        businessId_taskType: {
                            businessId: input.businessId,
                            taskType: input.taskType,
                        },
                    },
                });

                if (existingTaskPrice) {
                    return {
                        success: false,
                        message: `Ya existe un precio de tarea para la empresa y tipo de tarea especificados. Debe actualizar el precio existente si desea cambiar el precio.`,
                    };
                }

                // Verificar que la empresa existe
                const business = await prisma.business.findUnique({
                    where: { id: input.businessId },
                });

                if (!business) {
                    return {
                        success: false,
                        message: 'Empresa no encontrada',
                    };
                }

                const taskPrice = await prisma.taskPrice.create({
                    data: {
                        businessId: input.businessId,
                        taskType: input.taskType,
                        price: input.price,
                        priceHistory: [], // Inicialmente vacío
                    },
                    include: {
                        business: true,
                    },
                });

                return {
                    success: true,
                    taskPrice,
                };
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        },
    }),

    updateTaskPrice: t.field({
        type: TaskPriceCrudResultPothosRef,
        args: {
            id: t.arg.string({ required: true }),
            input: t.arg({
                type: TaskPriceUpdateInputPothosRef,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoTecnico', 'IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            try {
                const { id, input } = args;

                // Buscar el precio de tarea existente
                const existingTaskPrice = await prisma.taskPrice.findUnique({
                    where: { id },
                });

                if (!existingTaskPrice) {
                    return {
                        success: false,
                        message: 'Precio de tarea no encontrado',
                    };
                }

                // Crear el historial con el precio actual y fecha de actualización
                const newHistoryEntry = {
                    price: existingTaskPrice.price,
                    updatedAt: existingTaskPrice.updatedAt,
                };

                // Actualizar el precio y agregar al historial
                const updatedTaskPrice = await prisma.taskPrice.update({
                    where: { id },
                    data: {
                        price: input.price,
                        priceHistory: {
                            push: newHistoryEntry,
                        },
                    },
                    include: {
                        business: true,
                    },
                });

                return {
                    success: true,
                    taskPrice: updatedTaskPrice,
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
