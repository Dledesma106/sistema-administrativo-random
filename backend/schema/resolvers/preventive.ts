import { Preventive, PreventiveStatus } from '@prisma/client';

import { prisma } from 'lib/prisma';

import { builder } from '../builder';

const PreventiveStatusPothosRef = builder.enumType('PreventiveStatus', {
    values: Object.fromEntries(
        Object.entries(PreventiveStatus).map(([name, value]) => [name, { value }]),
    ),
});

const PreventivePothosRef = builder.prismaObject('Preventive', {
    fields: (t) => ({
        id: t.exposeID('id'),
        createdAt: t.expose('createdAt', { type: 'DateTime' }),
        updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
        deleted: t.expose('deleted', { type: 'Boolean' }),
        frequency: t.expose('frequency', { type: 'Int' }),
        months: t.exposeStringList('months'),
        observations: t.exposeString('observations', {
            nullable: true,
        }),
        status: t.field({
            type: PreventiveStatusPothosRef,
            resolve: (root) => root.status as PreventiveStatus,
        }),
        business: t.relation('business'),
        branch: t.relation('branch'),
        assigned: t.relation('assigned'),
        assignedIDs: t.exposeStringList('assignedIDs'),
        lastDoneAt: t.expose('lastDoneAt', {
            type: 'DateTime',
            nullable: true,
        }),
        batteryChangedAt: t.expose('batteryChangedAt', {
            type: 'DateTime',
            nullable: true,
        }),
    }),
});

const PreventiveInputPothosRef = builder.inputType('PreventiveInput', {
    fields: (t) => ({
        frequency: t.int({
            required: true,
        }),
        months: t.stringList({
            required: true,
        }),
        observations: t.string({
            required: false,
        }),
        status: t.field({
            type: PreventiveStatusPothosRef,
            required: true,
        }),
        businessId: t.string({
            required: true,
        }),
        branchId: t.string({
            required: true,
        }),
        assignedIDs: t.stringList({
            required: true,
        }),
    }),
});

const PreventiveCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        preventive?: Preventive;
    }>('PreventiveCrudResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            preventive: t.field({
                type: PreventivePothosRef,
                nullable: true,
                resolve: (result) => result.preventive,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
        }),
    });

builder.mutationFields((t) => ({
    createPreventive: t.field({
        type: PreventiveCrudResultPothosRef,
        args: {
            data: t.arg({
                type: PreventiveInputPothosRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, args, _context, _info) => {
            const { data } = args;
            const {
                frequency,
                months,
                observations,
                status,
                businessId,
                branchId,
                assignedIDs,
            } = data;

            const preventive = await prisma.preventive.create({
                data: {
                    frequency,
                    months,
                    observations,
                    status,
                    businessId,
                    branchId,
                    assignedIDs: {
                        set: assignedIDs,
                    },
                },
            });

            return {
                success: true,
                preventive,
            };
        },
    }),
    updatePreventive: t.field({
        type: PreventiveCrudResultPothosRef,
        args: {
            id: t.arg({
                type: 'String',
                required: true,
            }),
            data: t.arg({
                type: PreventiveInputPothosRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, args, _context, _info) => {
            const { id, data } = args;
            const {
                frequency,
                months,
                observations,
                status,
                businessId,
                branchId,
                assignedIDs,
            } = data;

            const preventive = await prisma.preventive.update({
                where: {
                    id,
                },
                data: {
                    frequency,
                    months,
                    observations,
                    status,
                    businessId,
                    branchId,
                    assignedIDs: {
                        set: assignedIDs,
                    },
                },
            });

            return {
                success: true,
                preventive,
            };
        },
    }),
    deletePreventive: t.field({
        type: PreventiveCrudResultPothosRef,
        args: {
            id: t.arg({
                type: 'String',
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, args, _context, _info) => {
            const { id } = args;

            const preventive = await prisma.preventive.update({
                where: {
                    id,
                },
                data: {
                    deleted: true,
                },
            });

            return {
                success: true,
                preventive,
            };
        },
    }),
}));

builder.queryFields((t) => ({
    preventives: t.prismaField({
        type: [PreventivePothosRef],
        resolve: async (query, _parent, _args, _info) => {
            return prisma.preventive.findManyUndeleted(query);
        },
    }),
}));
