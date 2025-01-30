import { BusinessInputType, BusinessResultRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';
export const BusinessMutations = builder.mutationFields((t) => ({
    createBusiness: t.prismaField({
        type: 'Business',
        args: {
            data: t.arg({
                type: BusinessInputType,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { data }) => {
            return prisma.business.create({
                ...query,
                data: {
                    name: data.name,
                },
            });
        },
    }),

    updateBusiness: t.prismaField({
        type: 'Business',
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
        resolve: async (query, _parent, { id, data }) => {
            return prisma.business.update({
                ...query,
                where: { id },
                data: {
                    name: data.name,
                },
            });
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
