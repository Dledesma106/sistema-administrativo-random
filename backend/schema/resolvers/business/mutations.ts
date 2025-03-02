import { BusinessInputType, BusinessResultRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';
export const BusinessMutations = builder.mutationFields((t) => ({
    createBusiness: t.field({
        type: BusinessResultRef,
        args: {
            data: t.arg({
                type: BusinessInputType,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { data }) => {
            const business = await prisma.business.create({
                data: {
                    name: data.name,
                },
            });
            return {
                success: true,
                message: 'Empresa creada exitosamente',
                business,
            };
        },
    }),

    updateBusiness: t.field({
        type: BusinessResultRef,
        args: {
            id: t.arg.string({ required: true }),
            data: t.arg({
                type: BusinessInputType,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { id, data }) => {
            const business = await prisma.business.update({
                where: { id },
                data: {
                    name: data.name,
                },
            });
            return {
                success: true,
                message: 'Empresa actualizada exitosamente',
                business,
            };
        },
    }),

    deleteBusiness: t.field({
        type: BusinessResultRef,
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { id }) => {
            try {
                const business = await prisma.business.delete({
                    where: { id },
                });
                return {
                    success: true,
                    message: 'Empresa eliminada exitosamente',
                    business,
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al eliminar la empresa',
                };
            }
        },
    }),
}));
