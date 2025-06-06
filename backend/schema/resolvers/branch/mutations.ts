import { BranchCrudResultPothosRef, BranchInputPothosRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

builder.mutationFields((t) => ({
    createBranch: t.field({
        type: BranchCrudResultPothosRef,
        args: {
            input: t.arg({
                type: BranchInputPothosRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_root, args, _context, _info) => {
            try {
                const { input } = args;
                const branch = await prisma.branch.create({
                    data: {
                        number: input.number,
                        name: input.name,
                        clientId: input.clientId,
                        cityId: input.cityId,
                        businessesIDs: {
                            set: input.businessesIds,
                        },
                    },
                });

                return {
                    success: true,
                    branch,
                };
            } catch (error) {
                return {
                    message: 'Error al crear la sucursal',
                    success: false,
                };
            }
        },
    }),

    updateBranch: t.field({
        type: BranchCrudResultPothosRef,
        args: {
            id: t.arg.string({ required: true }),
            input: t.arg({
                type: BranchInputPothosRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_root, args, _context, _info) => {
            try {
                const { id, input } = args;
                const branch = await prisma.branch.update({
                    where: { id },
                    data: {
                        number: input.number,
                        name: input.name,
                        clientId: input.clientId,
                        cityId: input.cityId,
                        businessesIDs: {
                            set: input.businessesIds,
                        },
                    },
                });

                return {
                    success: true,
                    branch,
                };
            } catch (error) {
                return {
                    message: 'Error al actualizar la sucursal',
                    success: false,
                };
            }
        },
    }),

    deleteBranch: t.field({
        type: BranchCrudResultPothosRef,
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_root, args, _context, _info) => {
            try {
                const { id } = args;
                const branch = await prisma.branch.softDeleteOne({ id });

                if (!branch) {
                    return {
                        message: 'La sucursal no existe',
                        success: false,
                    };
                }

                return {
                    success: true,
                    branch,
                };
            } catch (error) {
                return {
                    message: 'Error al eliminar la sucursal',
                    success: false,
                };
            }
        },
    }),
}));
