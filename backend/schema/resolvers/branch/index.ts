import { Branch } from '@prisma/client';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const BranchPothosRef = builder.prismaObject('Branch', {
    name: 'Branch',
    fields: (t) => ({
        id: t.exposeID('id'),
        number: t.exposeInt('number'),
        client: t.relation('client'),
        city: t.relation('city'),
        businesses: t.prismaField({
            type: ['Business'],
            resolve: async (query, root) => {
                return prisma.business.findManyUndeleted({
                    ...query,
                    where: {
                        id: {
                            in: root.businessesIDs,
                        },
                    },
                });
            },
        }),
    }),
});

const BranchInputPothosRef = builder.inputType('BranchInput', {
    fields: (t) => ({
        number: t.int({
            required: true,
        }),
        clientId: t.string({
            required: true,
        }),
        cityId: t.string({
            required: true,
        }),
        businessesIds: t.stringList({
            required: true,
        }),
    }),
});

const BranchCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        branch?: Branch;
    }>('BranchCrudResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            branch: t.field({
                type: BranchPothosRef,
                nullable: true,
                resolve: (result) => result.branch,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
        }),
    });

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
            id: t.arg.string({
                required: true,
            }),
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
                    where: {
                        id,
                    },
                    data: {
                        number: input.number,
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
            id: t.arg.string({
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_root, args, _context, _info) => {
            try {
                const { id } = args;
                const branch = await prisma.branch.softDeleteOne({
                    id,
                });

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

builder.queryFields((t) => ({
    branches: t.prismaField({
        type: [BranchPothosRef],
        resolve: async (query, _parent, _args, _info) => {
            return prisma.branch.findManyUndeleted(query);
        },
    }),
}));
