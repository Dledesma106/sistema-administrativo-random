import { ProvinceCrudResultPothosRef, ProvinceInputType } from './refs';

import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

export const ProvinceMutations = builder.mutationFields((t) => ({
    createProvince: t.field({
        type: ProvinceCrudResultPothosRef,
        args: {
            data: t.arg({
                type: ProvinceInputType,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (root, { data }) => {
            try {
                const existingProvince = await prisma.province.findFirst({
                    where: {
                        name: data.name,
                        deleted: false,
                    },
                });

                if (existingProvince) {
                    return {
                        message: 'Ya existe una provincia con ese nombre',
                        success: false,
                    };
                }

                const province = await prisma.province.create({
                    data: {
                        name: data.name,
                    },
                });

                return {
                    success: true,
                    province,
                };
            } catch (error) {
                return {
                    message: 'Error al crear la provincia',
                    success: false,
                };
            }
        },
    }),

    updateProvince: t.field({
        type: ProvinceCrudResultPothosRef,
        args: {
            id: t.arg.string({ required: true }),
            data: t.arg({
                type: ProvinceInputType,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (root, { id, data }) => {
            try {
                const existingProvince = await prisma.province.findFirst({
                    where: {
                        name: data.name,
                        deleted: false,
                        id: { not: id },
                    },
                });

                if (existingProvince) {
                    return {
                        message: 'Ya existe una provincia con ese nombre',
                        success: false,
                    };
                }

                const province = await prisma.province.update({
                    where: { id },
                    data: {
                        name: data.name,
                    },
                });

                return {
                    success: true,
                    province,
                };
            } catch (error) {
                return {
                    message: 'Error al actualizar la provincia',
                    success: false,
                };
            }
        },
    }),

    deleteProvince: t.field({
        type: ProvinceCrudResultPothosRef,
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (root, { id }) => {
            try {
                const province = await prisma.province.softDeleteOne({
                    id,
                });

                if (!province) {
                    return {
                        message: 'La provincia no existe',
                        success: false,
                    };
                }

                return {
                    success: true,
                    province,
                };
            } catch (error) {
                return {
                    message: 'Error al eliminar la provincia',
                    success: false,
                };
            }
        },
    }),
}));
