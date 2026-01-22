import {
    BillPothosRef,
    BillStatusPothosRef,
    ComprobanteTypePothosRef,
    AfipConfigItemRef,
    AfipMonedaItemRef,
    AfipSalesPointRef,
} from './refs';

import { prisma } from 'lib/prisma';

import { AFIP_CBTE_TIPO, AfipCbteTipo } from '../../../services/afip';
import { AfipService } from '../../../services/afipService';
import { builder } from '../../builder';
import { ServiceOrderPothosRef } from '../serviceOrder/refs';
import { TaskPothosRef } from '../task/refs';

// Helper para mapear ComprobanteType a código AFIP
function mapComprobanteTypeToAfipCode(comprobanteType: string): AfipCbteTipo {
    const mapping: Record<string, AfipCbteTipo> = {
        A: AFIP_CBTE_TIPO.FACTURA_A,
        B: AFIP_CBTE_TIPO.FACTURA_B,
        C: AFIP_CBTE_TIPO.FACTURA_C,
    };
    return mapping[comprobanteType] || AFIP_CBTE_TIPO.FACTURA_A;
}

builder.queryFields((t) => ({
    bills: t.field({
        type: [BillPothosRef],
        args: {
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
            businessId: t.arg.string({ required: false }),
            status: t.arg({
                type: BillStatusPothosRef,
                required: false,
            }),
            orderBy: t.arg.string({ required: false }),
            orderDirection: t.arg.string({ required: false }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            const {
                skip = 0,
                take = 10,
                businessId,
                status,
                orderBy,
                orderDirection,
            } = args;
            const sortDirection =
                orderDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';
            let orderConfig = {};
            if (orderBy) {
                if (orderBy === 'business') {
                    orderConfig = { business: { name: sortDirection } };
                } else if (orderBy === 'contactName') {
                    // Ordenar por el primer contacto del perfil de facturación (nombre)
                    // Prisma no soporta ordenar por array, así que se hace en memoria
                    const bills = await prisma.bill.findMany({
                        where: {
                            ...(businessId && { businessId }),
                            ...(status && { status }),
                        },
                        skip: skip ?? 0,
                        take: take ?? 10,
                        include: {
                            business: true,
                            billingProfile: true,
                        },
                        orderBy: { createdAt: 'desc' },
                    });
                    const sorted = bills.sort((a, b) => {
                        const aName = a.billingProfile.contacts?.[0]?.fullName || '';
                        const bName = b.billingProfile.contacts?.[0]?.fullName || '';
                        return sortDirection === 'asc'
                            ? aName.localeCompare(bName)
                            : bName.localeCompare(aName);
                    });
                    return sorted;
                } else if (orderBy === 'contactEmail') {
                    // Ordenar por el primer contacto del perfil de facturación (email)
                    const bills = await prisma.bill.findMany({
                        where: {
                            ...(businessId && { businessId }),
                            ...(status && { status }),
                        },
                        skip: skip ?? 0,
                        take: take ?? 10,
                        include: {
                            business: true,
                            billingProfile: true,
                        },
                        orderBy: { createdAt: 'desc' },
                    });
                    const sorted = bills.sort((a, b) => {
                        const aEmail = a.billingProfile.contacts?.[0]?.email || '';
                        const bEmail = b.billingProfile.contacts?.[0]?.email || '';
                        return sortDirection === 'asc'
                            ? aEmail.localeCompare(bEmail)
                            : bEmail.localeCompare(aEmail);
                    });
                    return sorted;
                } else if (orderBy === 'billingEmail') {
                    // Ordenar por email de facturación
                    orderConfig = { billingProfile: { billingEmail: sortDirection } };
                } else if (orderBy === 'status') {
                    orderConfig = { status: sortDirection };
                } else {
                    orderConfig = { [orderBy]: sortDirection };
                }
            } else {
                orderConfig = { createdAt: 'desc' };
            }
            return prisma.bill.findMany({
                where: {
                    ...(businessId && { businessId }),
                    ...(status && { status }),
                },
                skip: skip ?? 0,
                take: take ?? 10,
                include: {
                    business: true,
                    billingProfile: true,
                },
                orderBy: orderConfig,
            });
        },
    }),
    billsCount: t.int({
        args: {
            businessId: t.arg.string({ required: false }),
            status: t.arg({
                type: BillStatusPothosRef,
                required: false,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            const { businessId, status } = args;
            return prisma.bill.count({
                where: {
                    ...(businessId && { businessId }),
                    ...(status && { status }),
                },
            });
        },
    }),
    bill: t.field({
        type: BillPothosRef,
        nullable: true,
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
            return prisma.bill.findUnique({
                where: { id: args.id },
                include: {
                    business: true,
                    billingProfile: true,
                },
            });
        },
    }),

    // ============================================================================
    // QUERIES DE AFIP
    // ============================================================================

    /**
     * Obtener el último número de comprobante autorizado por AFIP
     * para un punto de venta y tipo de comprobante específicos
     */
    afipLastVoucherNumber: t.int({
        args: {
            pointOfSale: t.arg.int({ required: true }),
            comprobanteType: t.arg({
                type: ComprobanteTypePothosRef,
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
            const { pointOfSale, comprobanteType } = args;
            const cbteTipo = mapComprobanteTypeToAfipCode(comprobanteType);

            try {
                const lastNumber = await AfipService.getLastVoucherNumber({
                    ptoVta: pointOfSale,
                    cbteTipo,
                });
                return lastNumber;
            } catch (error) {
                console.error('Error obteniendo último número de comprobante:', error);
                throw new Error(
                    'No se pudo obtener el último número de comprobante de AFIP',
                );
            }
        },
    }),

    /**
     * Obtener el próximo número de comprobante disponible
     * (último + 1)
     */
    afipNextVoucherNumber: t.int({
        args: {
            pointOfSale: t.arg.int({ required: true }),
            comprobanteType: t.arg({
                type: ComprobanteTypePothosRef,
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
            const { pointOfSale, comprobanteType } = args;
            const cbteTipo = mapComprobanteTypeToAfipCode(comprobanteType);

            try {
                const lastNumber = await AfipService.getLastVoucherNumber({
                    ptoVta: pointOfSale,
                    cbteTipo,
                });
                return lastNumber + 1;
            } catch (error) {
                console.error('Error obteniendo próximo número de comprobante:', error);
                throw new Error(
                    'No se pudo obtener el próximo número de comprobante de AFIP',
                );
            }
        },
    }),

    /**
     * Obtener los puntos de venta habilitados en AFIP
     */
    afipSalesPoints: t.field({
        type: [AfipSalesPointRef],
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, _args, _ctx, _info) => {
            // Mocked sales points for local testing (1..5)
            return Array.from({ length: 5 }, (_, i) => ({
                number: i + 1,
                type: 'TEST',
                blocked: false,
            }));
        },
    }),

    /**
     * Obtener todos los tipos de comprobante de AFIP
     */
    afipComprobanteTypes: t.field({
        type: [AfipConfigItemRef],
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, _args, _ctx, _info) => {
            return AfipService.getAllComprobanteTypes();
        },
    }),

    /**
     * Obtener todos los conceptos de AFIP (Productos, Servicios, Productos y Servicios)
     */
    afipConceptos: t.field({
        type: [AfipConfigItemRef],
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, _args, _ctx, _info) => {
            return AfipService.getAllConceptos();
        },
    }),

    /**
     * Obtener todos los tipos de documento de AFIP
     */
    afipDocumentoTypes: t.field({
        type: [AfipConfigItemRef],
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, _args, _ctx, _info) => {
            return AfipService.getAllDocumentoTypes();
        },
    }),

    /**
     * Obtener todas las alícuotas de IVA de AFIP
     */
    afipAlicuotasIVA: t.field({
        type: [AfipConfigItemRef],
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, _args, _ctx, _info) => {
            return AfipService.getAllAlicuotasIVA();
        },
    }),

    /**
     * Obtener todas las condiciones de IVA de AFIP
     */
    afipIVAConditions: t.field({
        type: [AfipConfigItemRef],
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, _args, _ctx, _info) => {
            return AfipService.getAllIVAConditions();
        },
    }),

    /**
     * Obtener todas las monedas soportadas por AFIP
     */
    afipMonedas: t.field({
        type: [AfipMonedaItemRef],
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, _args, _ctx, _info) => {
            return AfipService.getAllMonedas();
        },
    }),

    // ============================================================================
    // QUERIES PARA TAREAS Y ÓRDENES DE TRABAJO
    // ============================================================================

    /**
     * Buscar tareas sin factura asociada por empresa/cliente
     * Útil para seleccionar tareas a facturar
     */
    tasksWithoutBill: t.field({
        type: [TaskPothosRef],
        args: {
            businessId: t.arg.string({ required: false }),
            clientId: t.arg.string({ required: false }),
            branchId: t.arg.string({ required: false }),
            status: t.arg.string({ required: false }),
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            const { businessId, clientId, branchId, status, skip = 0, take = 50 } = args;

            // Buscar tareas que no están en ninguna factura
            // Construir el where clause dinámicamente
            const baseWhere: any = {
                deleted: false,
                bill: undefined, // Solo tareas que no están asociadas a ninguna factura
            };

            // Si hay status, agregarlo al baseWhere
            if (status) {
                baseWhere.status = status as any;
            }

            let tasks: any[] = [];

            // Si hay branchId, filtrar directamente por branch
            if (branchId) {
                const whereClause: any = {
                    ...baseWhere,
                    branchId: branchId,
                };
                // Si también hay businessId, filtrar por businessId directo de la tarea
                if (businessId) {
                    whereClause.businessId = businessId;
                }
                // Si hay clientId, agregarlo al filtro de branch
                if (clientId) {
                    whereClause.branch = {
                        ...whereClause.branch,
                        clientId,
                    };
                }
                tasks = await prisma.task.findMany({
                    where: whereClause,
                    skip: skip ?? 0,
                    take: take ?? 50,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        branch: {
                            include: {
                                client: true,
                            },
                        },
                        business: true,
                        assigned: true,
                    },
                });
            } else if (businessId) {
                // Buscar tareas con businessId directo
                // Solo buscamos tareas que tengan un business asociado directamente
                const whereClause: any = {
                    ...baseWhere,
                    businessId: businessId,
                };
                // Si hay clientId, agregarlo al filtro de branch
                if (clientId) {
                    whereClause.branch = {
                        clientId,
                    };
                }
                tasks = await prisma.task.findMany({
                    where: whereClause,
                    skip: skip ?? 0,
                    take: take ?? 50,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        branch: {
                            include: {
                                client: true,
                            },
                        },
                        business: true,
                        assigned: true,
                    },
                });
            } else if (clientId) {
                // Solo clientId sin businessId ni branchId
                const whereClause: any = {
                    ...baseWhere,
                    branch: {
                        clientId,
                    },
                };
                tasks = await prisma.task.findMany({
                    where: whereClause,
                    skip: skip ?? 0,
                    take: take ?? 50,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        branch: {
                            include: {
                                client: true,
                            },
                        },
                        business: true,
                        assigned: true,
                    },
                });
            } else {
                // Sin filtros específicos, solo baseWhere
                tasks = await prisma.task.findMany({
                    where: baseWhere,
                    skip: skip ?? 0,
                    take: take ?? 50,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        branch: {
                            include: {
                                client: true,
                            },
                        },
                        business: true,
                        assigned: true,
                    },
                });
            }

            return tasks;
        },
    }),

    /**
     * Contar tareas sin factura asociada
     */
    tasksWithoutBillCount: t.int({
        args: {
            businessId: t.arg.string({ required: false }),
            clientId: t.arg.string({ required: false }),
            branchId: t.arg.string({ required: false }),
            status: t.arg.string({ required: false }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            const { businessId, clientId, branchId, status } = args;

            const baseWhere: any = {
                deleted: false,
                billId: null,
            };

            if (status) {
                baseWhere.status = status as any;
            }

            // Si hay branchId, filtrar directamente por branch
            if (branchId) {
                const whereClause: any = {
                    ...baseWhere,
                    branchId: branchId,
                };
                // Si también hay businessId, filtrar por businessId directo de la tarea
                if (businessId) {
                    whereClause.businessId = businessId;
                }
                if (clientId) {
                    whereClause.branch = {
                        clientId,
                    };
                }
                return prisma.task.count({
                    where: whereClause,
                });
            } else if (businessId) {
                // Buscar tareas con businessId directo
                // Solo buscamos tareas que tengan un business asociado directamente
                const whereClause: any = {
                    ...baseWhere,
                    businessId: businessId,
                };
                // Si hay clientId, agregarlo al filtro de branch
                if (clientId) {
                    whereClause.branch = {
                        clientId,
                    };
                }
                return prisma.task.count({
                    where: whereClause,
                });
            } else if (clientId) {
                // Solo clientId sin businessId ni branchId
                const whereClause: any = {
                    ...baseWhere,
                    branch: {
                        clientId,
                    },
                };
                return prisma.task.count({
                    where: whereClause,
                });
            } else {
                // Sin filtros específicos, solo baseWhere
                return prisma.task.count({
                    where: baseWhere,
                });
            }
        },
    }),

    /**
     * Buscar órdenes de trabajo facturadas con filtros y paginación
     */
    billedServiceOrders: t.field({
        type: [ServiceOrderPothosRef],
        args: {
            businessId: t.arg.string({ required: false }),
            clientId: t.arg.string({ required: false }),
            status: t.arg.string({ required: false }),
            fromDate: t.arg({
                type: 'DateTime',
                required: false,
            }),
            toDate: t.arg({
                type: 'DateTime',
                required: false,
            }),
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
            orderBy: t.arg.string({ required: false }),
            orderDirection: t.arg.string({ required: false }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            const {
                businessId,
                clientId,
                status,
                fromDate,
                toDate,
                skip = 0,
                take = 20,
                orderBy = 'createdAt',
                orderDirection = 'desc',
            } = args;

            const sortDirection =
                orderDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';

            // Obtener las tareas facturadas (que tienen billId)
            const billedTasks = await prisma.task.findMany({
                where: {
                    billId: { not: null },
                    serviceOrderId: { not: null },
                },
                select: {
                    serviceOrderId: true,
                },
            });

            const serviceOrderIds = Array.from(
                new Set(billedTasks.map((t) => t.serviceOrderId).filter(Boolean)),
            ) as string[];

            if (serviceOrderIds.length === 0) {
                return [];
            }

            // Buscar las órdenes de trabajo
            const serviceOrders = await prisma.serviceOrder.findMany({
                where: {
                    id: { in: serviceOrderIds },
                    ...(businessId && { businessId }),
                    ...(clientId && { clientId }),
                    ...(status && { status: status as any }),
                    ...(fromDate &&
                        toDate && {
                            createdAt: {
                                gte: fromDate,
                                lte: toDate,
                            },
                        }),
                    ...(fromDate &&
                        !toDate && {
                            createdAt: {
                                gte: fromDate,
                            },
                        }),
                    ...(!fromDate &&
                        toDate && {
                            createdAt: {
                                lte: toDate,
                            },
                        }),
                },
                skip: skip ?? 0,
                take: take ?? 20,
                orderBy: { [orderBy ?? 'createdAt']: sortDirection },
                include: {
                    business: true,
                    client: true,
                    branch: true,
                    tasks: true,
                },
            });

            return serviceOrders;
        },
    }),

    /**
     * Contar órdenes de trabajo facturadas
     */
    billedServiceOrdersCount: t.int({
        args: {
            businessId: t.arg.string({ required: false }),
            clientId: t.arg.string({ required: false }),
            status: t.arg.string({ required: false }),
            fromDate: t.arg({
                type: 'DateTime',
                required: false,
            }),
            toDate: t.arg({
                type: 'DateTime',
                required: false,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            const { businessId, clientId, status, fromDate, toDate } = args;

            // Obtener las tareas facturadas (que tienen billId)
            const billedTasks = await prisma.task.findMany({
                where: {
                    billId: { not: null },
                    serviceOrderId: { not: null },
                },
                select: {
                    serviceOrderId: true,
                },
            });

            const serviceOrderIds = Array.from(
                new Set(billedTasks.map((t) => t.serviceOrderId).filter(Boolean)),
            ) as string[];

            if (serviceOrderIds.length === 0) {
                return 0;
            }

            return prisma.serviceOrder.count({
                where: {
                    id: { in: serviceOrderIds },
                    ...(businessId && { businessId }),
                    ...(clientId && { clientId }),
                    ...(status && { status: status as any }),
                    ...(fromDate &&
                        toDate && {
                            createdAt: {
                                gte: fromDate,
                                lte: toDate,
                            },
                        }),
                    ...(fromDate &&
                        !toDate && {
                            createdAt: {
                                gte: fromDate,
                            },
                        }),
                    ...(!fromDate &&
                        toDate && {
                            createdAt: {
                                lte: toDate,
                            },
                        }),
                },
            });
        },
    }),

    /**
     * Obtener las facturas asociadas a una tarea específica
     */
    billsByTask: t.field({
        type: [BillPothosRef],
        args: {
            taskId: t.arg.string({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            const { taskId } = args;

            // Obtener la tarea para ver si tiene factura asociada
            const task = await prisma.task.findUnique({
                where: { id: taskId },
                select: { billId: true },
            });

            if (!task?.billId) {
                return [];
            }

            // Retornar la factura asociada
            const bill = await prisma.bill.findUnique({
                where: { id: task.billId },
                include: {
                    business: true,
                    billingProfile: true,
                },
            });

            return bill ? [bill] : [];
        },
    }),

    /**
     * Obtener las facturas asociadas a una orden de trabajo
     */
    billsByServiceOrder: t.field({
        type: [BillPothosRef],
        args: {
            serviceOrderId: t.arg.string({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            const { serviceOrderId } = args;

            // Buscar facturas directamente asociadas a la orden de servicio
            // o facturas que tengan tareas de esta orden
            const billsDirect = await prisma.bill.findMany({
                where: { serviceOrderId },
                include: {
                    business: true,
                    billingProfile: true,
                },
            });

            // También buscar facturas a través de las tareas de la OT
            const tasks = await prisma.task.findMany({
                where: {
                    serviceOrderId,
                    billId: { not: null },
                },
                select: { billId: true },
            });

            const billIdsFromTasks = Array.from(new Set(tasks.map((t) => t.billId!)));

            // Obtener facturas que no estén ya en billsDirect
            const directBillIds = billsDirect.map((b) => b.id);
            const additionalBillIds = billIdsFromTasks.filter(
                (id) => !directBillIds.includes(id),
            );

            if (additionalBillIds.length > 0) {
                const additionalBills = await prisma.bill.findMany({
                    where: { id: { in: additionalBillIds } },
                    include: {
                        business: true,
                        billingProfile: true,
                    },
                });
                return [...billsDirect, ...additionalBills].sort(
                    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
                );
            }

            return billsDirect;
        },
    }),
}));
