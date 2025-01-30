import { ClientInputType, ClientResultRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const ClientMutations = builder.mutationFields((t) => ({
    createClient: t.field({
        type: ClientResultRef,
        args: {
            data: t.arg({
                type: ClientInputType,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { data }) => {
            try {
                const client = await prisma.client.create({
                    data: {
                        name: data.name,
                    },
                });
                return {
                    success: true,
                    message: 'Cliente creado exitosamente',
                    client,
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al crear el cliente',
                };
            }
        },
    }),

    updateClient: t.field({
        type: ClientResultRef,
        args: {
            id: t.arg.string({ required: true }),
            data: t.arg({
                type: ClientInputType,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { id, data }) => {
            try {
                const client = await prisma.client.update({
                    where: { id },
                    data: {
                        name: data.name,
                    },
                });
                return {
                    success: true,
                    message: 'Cliente actualizado exitosamente',
                    client,
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al actualizar el cliente',
                };
            }
        },
    }),

    deleteClient: t.field({
        type: ClientResultRef,
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, { id }) => {
            try {
                const client = await prisma.client.delete({
                    where: { id },
                });
                return {
                    success: true,
                    message: 'Cliente eliminado exitosamente',
                    client,
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al eliminar el cliente',
                };
            }
        },
    }),
}));
