import { BudgetStatus, ServiceOrderStatus } from '@prisma/client';

import {
    BudgetCrudResultPothosRef,
    BudgetInputPothosRef,
    CreateBudgetWithBillingProfileInputPothosRef,
    UpdateBudgetInputPothosRef,
    UpdateBudgetStatusInputPothosRef,
} from './refs';

import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

// Función auxiliar para validar cliente y sucursal
async function validateClientAndBranch(
    clientId?: string | null,
    branchId?: string | null,
) {
    // Si se proporciona sucursal, debe haber cliente
    if (branchId && !clientId) {
        return {
            isValid: false,
            message: 'Si se proporciona una sucursal, debe especificar un cliente',
        };
    }

    // Si se proporciona cliente, verificar que existe
    if (clientId) {
        const client = await prisma.client.findUniqueUndeleted({
            where: { id: clientId },
        });

        if (!client) {
            return {
                isValid: false,
                message: 'El cliente no existe',
            };
        }

        // Si también se proporciona sucursal, verificar que pertenece al cliente
        if (branchId) {
            const branch = await prisma.branch.findUniqueUndeleted({
                where: {
                    id: branchId,
                    clientId: clientId,
                },
            });

            if (!branch) {
                return {
                    isValid: false,
                    message: 'La sucursal no pertenece al cliente especificado',
                };
            }
        }
    }

    // Si se proporciona solo sucursal sin cliente, es inválido
    if (branchId && !clientId) {
        return {
            isValid: false,
            message: 'Si se proporciona una sucursal, debe especificar un cliente',
        };
    }

    return { isValid: true };
}

builder.mutationFields((t) => ({
    createBudget: t.field({
        type: BudgetCrudResultPothosRef,
        args: {
            input: t.arg({
                type: BudgetInputPothosRef,
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
        resolve: async (root, args, { user }, _info) => {
            try {
                const { input } = args;

                // Verificar que el perfil de facturación existe
                const billingProfile = await prisma.billingProfile.findUniqueUndeleted({
                    where: { id: input.billingProfileId },
                });

                if (!billingProfile) {
                    return {
                        success: false,
                        message: 'El perfil de facturación no existe',
                    };
                }

                // Validar cliente y sucursal
                const validation = await validateClientAndBranch(
                    input.clientId,
                    input.branchId,
                );
                if (!validation.isValid) {
                    return {
                        success: false,
                        message: validation.message,
                    };
                }

                // Crear el presupuesto
                const budget = await prisma.budget.create({
                    data: {
                        subject: input.subject,
                        description: input.description,
                        price: input.price,
                        gmailThreadId: input.gmailThreadId,
                        billingProfile: {
                            connect: { id: input.billingProfileId },
                        },
                        ...(input.clientId && {
                            client: {
                                connect: { id: input.clientId },
                            },
                        }),
                        ...(input.branchId && {
                            branch: {
                                connect: { id: input.branchId },
                            },
                        }),
                        createdBy: {
                            connect: { id: user.id },
                        },
                    },
                });

                return {
                    success: true,
                    budget,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al crear el presupuesto: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),
    updateBudget: t.field({
        type: BudgetCrudResultPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
            input: t.arg({
                type: UpdateBudgetInputPothosRef,
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

                // Verificar que el presupuesto existe
                const existingBudget = await prisma.budget.findUniqueUndeleted({
                    where: { id },
                });

                if (!existingBudget) {
                    return {
                        success: false,
                        message: 'El presupuesto no existe',
                    };
                }

                // Validar cliente y sucursal
                const validation = await validateClientAndBranch(
                    input.clientId,
                    input.branchId,
                );
                if (!validation.isValid) {
                    return {
                        success: false,
                        message: validation.message,
                    };
                }

                // Preparar datos de actualización
                const updateData: any = {};

                if (input.subject !== undefined) {
                    updateData.subject = input.subject;
                }
                if (input.description !== undefined) {
                    updateData.description = input.description;
                }
                if (input.price !== undefined) {
                    updateData.price = input.price;
                }

                // Manejar relaciones
                if (input.clientId !== undefined) {
                    if (input.clientId) {
                        updateData.client = { connect: { id: input.clientId } };
                    } else {
                        updateData.client = { disconnect: true };
                    }
                }

                if (input.branchId !== undefined) {
                    if (input.branchId) {
                        updateData.branch = { connect: { id: input.branchId } };
                    } else {
                        updateData.branch = { disconnect: true };
                    }
                }

                // Actualizar el presupuesto
                const budget = await prisma.budget.update({
                    where: { id },
                    data: updateData,
                });

                return {
                    success: true,
                    budget,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al actualizar el presupuesto: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),
    updateBudgetStatus: t.field({
        type: BudgetCrudResultPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
            input: t.arg({
                type: UpdateBudgetStatusInputPothosRef,
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

                // Verificar que el presupuesto existe
                const existingBudget = await prisma.budget.findUniqueUndeleted({
                    where: { id },
                    include: { billingProfile: true },
                });

                if (!existingBudget) {
                    return {
                        success: false,
                        message: 'El presupuesto no existe',
                    };
                }

                // Actualizar el estado del presupuesto
                const budget = await prisma.budget.update({
                    where: { id },
                    data: {
                        status: input.status,
                    },
                });

                // Si el estado cambió a aprobado, crear orden de servicio
                if (input.status === BudgetStatus.Aprobado) {
                    // Verificar si ya existe una orden de servicio para este presupuesto (por cliente, empresa, sucursal y descripción)
                    const alreadyExists = await prisma.serviceOrder.findFirst({
                        where: {
                            clientId: existingBudget.clientId!,
                            businessId: existingBudget.billingProfile.businessId!,
                            branchId: existingBudget.branchId!,
                            description: existingBudget.description ?? undefined,
                        },
                    });
                    if (!alreadyExists) {
                        // Generar el próximo número de orden de servicio
                        const maxOrder = await prisma.serviceOrder.findFirst({
                            orderBy: { serviceOrderNumber: 'desc' },
                            select: { serviceOrderNumber: true },
                        });
                        const nextNumber = (maxOrder?.serviceOrderNumber ?? 0) + 1;
                        await prisma.serviceOrder.create({
                            data: {
                                serviceOrderNumber: nextNumber,
                                status: ServiceOrderStatus.Pendiente,
                                clientId: existingBudget.clientId!,
                                businessId: existingBudget.billingProfile.businessId!,
                                branchId: existingBudget.branchId!,
                                description: existingBudget.description ?? undefined,
                                budgetId: existingBudget.id,
                            },
                        });
                    }
                }

                return {
                    success: true,
                    budget,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al actualizar el estado del presupuesto: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),
    deleteBudget: t.field({
        type: BudgetCrudResultPothosRef,
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

                // Verificar que el presupuesto existe
                const existingBudget = await prisma.budget.findUniqueUndeleted({
                    where: { id },
                });

                if (!existingBudget) {
                    return {
                        success: false,
                        message: 'El presupuesto no existe',
                    };
                }

                // Eliminar el presupuesto (soft delete)
                const deletedBudget = await prisma.budget.softDeleteOne({ id });

                return {
                    success: true,
                    budget: deletedBudget,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al eliminar el presupuesto: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),
    createBudgetWithBillingProfile: t.field({
        type: BudgetCrudResultPothosRef,
        args: {
            input: t.arg({
                type: CreateBudgetWithBillingProfileInputPothosRef,
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
        resolve: async (root, args, { user }, _info) => {
            try {
                const { input } = args;

                // Validar que se proporcione o billingProfileId o datos para crear uno nuevo
                if (!input.billingProfileId && !input.businessId) {
                    return {
                        success: false,
                        message:
                            'Debe proporcionar un perfil de facturación existente o datos para crear uno nuevo',
                    };
                }

                // Validar cliente y sucursal
                const validation = await validateClientAndBranch(
                    input.clientId,
                    input.branchId,
                );
                if (!validation.isValid) {
                    return {
                        success: false,
                        message: validation.message,
                    };
                }

                let billingProfileId = input.billingProfileId;

                // Si no hay billingProfileId, crear un nuevo perfil de facturación
                if (!billingProfileId && input.businessId) {
                    // Verificar que la empresa existe
                    const business = await prisma.business.findUniqueUndeleted({
                        where: { id: input.businessId },
                    });

                    if (!business) {
                        return {
                            success: false,
                            message: 'La empresa no existe',
                        };
                    }

                    // Verificar que no tenga ya un perfil de facturación
                    const existingProfile =
                        await prisma.billingProfile.findUniqueUndeleted({
                            where: { businessId: input.businessId },
                        });

                    if (existingProfile) {
                        return {
                            success: false,
                            message: 'La empresa ya tiene un perfil de facturación',
                        };
                    }

                    // Crear el nuevo perfil de facturación
                    const newBillingProfile = await prisma.billingProfile.create({
                        data: {
                            CUIT: input.businessCUIT!,
                            legalName: input.businessLegalName!,
                            IVACondition: input.businessIVACondition as any,
                            comercialAddress: input.businessComercialAddress!,
                            billingEmail: input.businessBillingEmail!,
                            business: {
                                connect: { id: input.businessId },
                            },
                            contacts:
                                input.contacts?.map((contact) => ({
                                    fullName: contact.fullName,
                                    email: contact.email,
                                    phone: contact.phone,
                                    notes: contact.notes || '',
                                })) || [],
                        },
                    });

                    billingProfileId = newBillingProfile.id;
                }

                // Verificar que el perfil de facturación existe
                const billingProfile = await prisma.billingProfile.findUniqueUndeleted({
                    where: { id: billingProfileId! },
                });

                if (!billingProfile) {
                    return {
                        success: false,
                        message: 'El perfil de facturación no existe',
                    };
                }

                // Crear el presupuesto
                const budget = await prisma.budget.create({
                    data: {
                        subject: input.subject,
                        description: input.description,
                        price: input.price,
                        gmailThreadId: input.gmailThreadId,
                        billingProfile: {
                            connect: { id: billingProfileId! },
                        },
                        ...(input.clientId && {
                            client: {
                                connect: { id: input.clientId },
                            },
                        }),
                        ...(input.branchId && {
                            branch: {
                                connect: { id: input.branchId },
                            },
                        }),
                        createdBy: {
                            connect: { id: user.id },
                        },
                    },
                });

                return {
                    success: true,
                    budget,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al crear el presupuesto: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),
}));
