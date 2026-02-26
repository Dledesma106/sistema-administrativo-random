import {
    BillPothosRef,
    BillStatusPothosRef,
    ComprobanteTypePothosRef,
    AfipConfigItemRef,
    AfipMonedaItemRef,
    AfipSalesPointRef,
} from './refs';

import { getFileSignedUrl } from 'backend/s3Client';
import { regenerateBillPdf } from 'backend/services/billService';
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
            return prisma.bill.findUniqueUndeleted({
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
            if (process.env.AFIP_PRODUCTION === 'false') {
                // En modo sandbox, retornar punto de venta fijo
                return [
                    {
                        number: 1,
                        type: 'Electronica',
                        blocked: false,
                    },
                ];
            }

            try {
                const pts = await AfipService.getSalesPoints();
                return (pts || []).map((p) => ({
                    number: p.Nro,
                    type: p.EmisionTipo || String(p.EmisionTipo || ''),
                    blocked: p.Bloqueado === 'S' || p.Bloqueado === '1',
                }));
            } catch (error) {
                console.error('Error obteniendo puntos de venta desde AFIP:', error);
                // En caso de error, retornar array vacío para que el frontend no rompa
                return [];
            }
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

    /**
     * Obtener URL firmada para descargar el PDF asociado a una factura
     */
    downloadBillPdf: t.field({
        type: 'String',
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
            const { id } = args;
            const bill = await prisma.bill.findUnique({
                where: { id },
                include: { pdf: true },
            });
            if (!bill) {
                throw new Error('Factura no encontrada');
            }
            if (!bill.pdf) {
                throw new Error('No hay PDF asociado a esta factura');
            }

            await regenerateBillPdf(id);

            const { url, urlExpire } = await getFileSignedUrl(
                bill.pdf.key,
                bill.pdf.mimeType,
                bill.pdf.filename,
            );

            // Actualizar metadatos del archivo en la BD
            await prisma.file.update({
                where: { id: bill.pdf.id },
                data: {
                    url,
                    urlExpire,
                },
            });

            return url;
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
            const { businessId, status, skip = 0, take = 50 } = args;
            console.log('Buscando tareas sin factura asociada con filtros:', {
                status,
                businessId,
            });
            // Buscar tareas que no están en ninguna factura
            const baseWhere: any = {
                deleted: false,
                businessId,
                // Solo tareas que no están asociadas a ninguna factura
            };

            // Si hay status, agregarlo al baseWhere
            if (status) {
                baseWhere.status = status as any;
            }

            const tasks = await prisma.task.findMany({
                where: {
                    ...baseWhere,
                },
                skip: skip ?? 0,
                take: take ?? 50,
                orderBy: { createdAt: 'desc' },
                include: {
                    bill: true,
                    billDetail: true,
                },
            });

            const filteredTasks = tasks.filter(
                (t) => !t.bill && !t.billDetail && !t.billDetailId && !t.billId,
            );

            return filteredTasks;
        },
    }),

    /**
     * Contar tareas sin factura asociada
     */
    tasksWithoutBillCount: t.int({
        args: {
            businessId: t.arg.string({ required: false }),
            status: t.arg.string({ required: false }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (_root, args, _ctx, _info) => {
            const { businessId, status } = args;

            const baseWhere: any = {
                deleted: false,
                OR: [
                    { billId: null }, // cubre tanto null explícito como campo inexistente
                    { billId: { equals: undefined } },
                    { bill: null },
                    { bill: { equals: undefined } },
                ],
                businessId,
                // Solo tareas que no están asociadas a ninguna factura
            };

            if (status) {
                baseWhere.status = status as any;
            }

            return prisma.task.count({
                where: {
                    ...baseWhere,
                },
            });
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
