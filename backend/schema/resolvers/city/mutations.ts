import { City } from '@prisma/client';

import { CityRef } from './refs';

import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

const CityInputPothosRef = builder.inputType('CityInput', {
    fields: (t) => ({
        name: t.string({
            required: true,
        }),
        provinceId: t.string({
            required: true,
        }),
    }),
});

const CityCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        city?: City;
    }>('CityCrudResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            city: t.field({
                type: CityRef,
                nullable: true,
                resolve: (result) => result.city,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
        }),
    });

builder.mutationFields((t) => ({
    createCity: t.field({
        type: CityCrudResultPothosRef,
        args: {
            input: t.arg({
                type: CityInputPothosRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { input } = args;
                const city = await prisma.city.create({
                    data: {
                        name: input.name,
                        provinceId: input.provinceId,
                    },
                });

                return {
                    success: true,
                    city,
                };
            } catch (error) {
                return {
                    message: 'Error al crear la ciudad',
                    success: false,
                };
            }
        },
    }),

    updateCity: t.field({
        type: CityCrudResultPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
            input: t.arg({
                type: CityInputPothosRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { id, input } = args;
                const city = await prisma.city.update({
                    where: {
                        id,
                    },
                    data: {
                        name: input.name,
                        provinceId: input.provinceId,
                    },
                });

                return {
                    success: true,
                    city,
                };
            } catch (error) {
                return {
                    message: 'Error al actualizar la ciudad',
                    success: false,
                };
            }
        },
    }),

    deleteCity: t.field({
        type: CityCrudResultPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { id } = args;
                const city = await prisma.city.softDeleteOne({
                    id,
                });

                if (!city) {
                    return {
                        message: 'La ciudad no existe',
                        success: false,
                    };
                }

                return {
                    success: true,
                    city,
                };
            } catch (error) {
                return {
                    message: 'Error al eliminar la ciudad',
                    success: false,
                };
            }
        },
    }),
}));
