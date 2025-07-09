import {
    BillingProfileCrudResultPothosRef,
    BillingProfileInputPothosRef,
    UpdateBillingProfileInputPothosRef,
} from './refs';

import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

builder.mutationFields((t) => ({
    createBillingProfile: t.field({
        type: BillingProfileCrudResultPothosRef,
        args: {
            input: t.arg({
                type: BillingProfileInputPothosRef,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { input } = args;

                let businessId = input.businessId;

                // Si no se proporciona businessId pero sí businessName, crear la empresa
                if (!businessId && input.businessName) {
                    const newBusiness = await prisma.business.create({
                        data: {
                            name: input.businessName,
                        },
                    });
                    businessId = newBusiness.id;
                }

                // Verificar que tenemos un businessId válido
                if (!businessId) {
                    return {
                        success: false,
                        message:
                            'Debe proporcionar un ID de empresa o un nombre de empresa',
                    };
                }

                // Verificar que el business existe
                const business = await prisma.business.findUniqueUndeleted({
                    where: { id: businessId },
                });

                if (!business) {
                    return {
                        success: false,
                        message: 'El negocio no existe',
                    };
                }

                // Verificar que no existe ya un perfil de facturación para este business
                const existingProfile = await prisma.billingProfile.findUniqueUndeleted({
                    where: { businessId },
                });

                if (existingProfile) {
                    return {
                        success: false,
                        message: 'Ya existe un perfil de facturación para este negocio',
                    };
                }

                // Crear el perfil de facturación
                const billingProfile = await prisma.billingProfile.create({
                    data: {
                        CUIT: input.CUIT,
                        legalName: input.legalName,
                        IVACondition: input.IVACondition,
                        comercialAddress: input.comercialAddress,
                        billingEmail: input.billingEmail,
                        contacts: input.contacts || [],
                        business: {
                            connect: { id: businessId },
                        },
                    },
                });

                return {
                    success: true,
                    billingProfile,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al crear el perfil de facturación: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),
    updateBillingProfile: t.field({
        type: BillingProfileCrudResultPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
            input: t.arg({
                type: UpdateBillingProfileInputPothosRef,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { id, input } = args;

                // Verificar que el perfil existe
                const existingProfile = await prisma.billingProfile.findUniqueUndeleted({
                    where: { id },
                });

                if (!existingProfile) {
                    return {
                        success: false,
                        message: 'El perfil de facturación no existe',
                    };
                }

                // Actualizar el perfil
                const billingProfile = await prisma.billingProfile.update({
                    where: { id },
                    data: {
                        ...(input.CUIT && { CUIT: input.CUIT }),
                        ...(input.legalName && { legalName: input.legalName }),
                        ...(input.IVACondition && { IVACondition: input.IVACondition }),
                        ...(input.comercialAddress && {
                            comercialAddress: input.comercialAddress,
                        }),
                        ...(input.billingEmail && { billingEmail: input.billingEmail }),
                        ...(input.contacts && { contacts: input.contacts }),
                    },
                });

                return {
                    success: true,
                    billingProfile,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al actualizar el perfil de facturación: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),
    deleteBillingProfile: t.field({
        type: BillingProfileCrudResultPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { id } = args;

                // Verificar que el perfil existe
                const existingProfile = await prisma.billingProfile.findUniqueUndeleted({
                    where: { id },
                });

                if (!existingProfile) {
                    return {
                        success: false,
                        message: 'El perfil de facturación no existe',
                    };
                }

                // Eliminar el perfil (soft delete)
                const deletedProfile = await prisma.billingProfile.softDeleteOne({ id });

                return {
                    success: true,
                    billingProfile: deletedProfile,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al eliminar el perfil de facturación: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),
}));
 