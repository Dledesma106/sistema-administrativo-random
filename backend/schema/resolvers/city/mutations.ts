import { CityInputRef, CityCrudRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const CityMutations = builder.mutationFields((t) => ({
    createCity: t.field({
        type: CityCrudRef,
        args: {
            input: t.arg({
                type: CityInputRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, { input }) => {
            try {
                const city = await prisma.city.create({
                    data: {
                        name: input.name,
                        province: { connect: { id: input.provinceId } },
                    },
                });
                return {
                    success: true,
                    city,
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al crear la ciudad',
                };
            }
        },
    }),

    updateCity: t.field({
        type: CityCrudRef,
        args: {
            id: t.arg.string({ required: true }),
            input: t.arg({
                type: CityInputRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, { id, input }) => {
            try {
                const city = await prisma.city.update({
                    where: { id },
                    data: {
                        name: input.name,
                        province: { connect: { id: input.provinceId } },
                    },
                });
                return {
                    success: true,
                    city,
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al actualizar la ciudad',
                };
            }
        },
    }),

    deleteCity: t.field({
        type: CityCrudRef,
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, { id }) => {
            try {
                const city = await prisma.city.update({
                    where: { id },
                    data: {
                        deleted: true,
                        deletedAt: new Date(),
                    },
                });
                return {
                    success: true,
                    city,
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al eliminar la ciudad',
                };
            }
        },
    }),
}));
