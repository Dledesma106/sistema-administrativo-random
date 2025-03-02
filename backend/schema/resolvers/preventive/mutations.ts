import { PreventiveInputRef, PreventiveCrudRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const PreventiveMutations = builder.mutationFields((t) => ({
    createPreventive: t.field({
        type: PreventiveCrudRef,
        args: {
            input: t.arg({
                type: PreventiveInputRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, { input }) => {
            try {
                const { businessId, branchId, assignedIds, ...rest } = input;

                const lastDoneAt = input.lastDoneAt
                    ? new Date(
                          input.lastDoneAt.toISOString().split('T')[0] +
                              'T12:00:00.000-03:00',
                      )
                    : null;
                const batteryChangedAt = input.batteryChangedAt
                    ? new Date(
                          input.batteryChangedAt.toISOString().split('T')[0] +
                              'T12:00:00.000-03:00',
                      )
                    : null;

                const preventive = await prisma.preventive.create({
                    data: {
                        ...rest,
                        business: { connect: { id: businessId } },
                        branch: { connect: { id: branchId } },
                        assigned: {
                            connect: assignedIds.map((id) => ({ id })),
                        },
                        lastDoneAt,
                        batteryChangedAt,
                    },
                });
                return {
                    success: true,
                    preventive,
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al crear el preventivo',
                };
            }
        },
    }),

    updatePreventive: t.field({
        type: PreventiveCrudRef,
        args: {
            id: t.arg.string({ required: true }),
            input: t.arg({
                type: PreventiveInputRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, { id, input }) => {
            try {
                const { businessId, branchId, assignedIds, ...rest } = input;

                const lastDoneAt = input.lastDoneAt
                    ? new Date(
                          input.lastDoneAt.toISOString().split('T')[0] +
                              'T12:00:00.000-03:00',
                      )
                    : null;
                const batteryChangedAt = input.batteryChangedAt
                    ? new Date(
                          input.batteryChangedAt.toISOString().split('T')[0] +
                              'T12:00:00.000-03:00',
                      )
                    : null;

                const preventive = await prisma.preventive.update({
                    where: { id },
                    data: {
                        ...rest,
                        business: { connect: { id: businessId } },
                        branch: { connect: { id: branchId } },
                        assigned: {
                            set: assignedIds.map((id) => ({ id })),
                        },
                        lastDoneAt,
                        batteryChangedAt,
                    },
                });
                return {
                    success: true,
                    preventive,
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al actualizar el preventivo',
                };
            }
        },
    }),

    deletePreventive: t.field({
        type: PreventiveCrudRef,
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, { id }) => {
            try {
                const preventive = await prisma.preventive.update({
                    where: { id },
                    data: {
                        deleted: true,
                        deletedAt: new Date(),
                    },
                });
                return {
                    success: true,
                    preventive,
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al eliminar el preventivo',
                };
            }
        },
    }),
}));
