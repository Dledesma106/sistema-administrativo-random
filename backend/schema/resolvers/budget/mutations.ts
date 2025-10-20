import { BudgetStatus, IVACondition, ServiceOrderStatus } from '@prisma/client';

import {
    BudgetCrudResultPothosRef,
    BudgetInputPothosRef,
    CreateBudgetWithBillingProfileInputPothosRef,
    UpdateBudgetInputPothosRef,
    UpdateBudgetStatusInputPothosRef,
} from './refs';

import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

import Mailer from '../../../../lib/nodemailer';

// Función auxiliar para generar el próximo número de presupuesto
async function getNextBudgetNumber(): Promise<number> {
    const maxBudget = await prisma.budget.findFirst({
        orderBy: { budgetNumber: 'desc' },
        select: { budgetNumber: true },
    });
    return (maxBudget?.budgetNumber ?? 0) + 1;
}

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

                // Generar número de presupuesto
                const budgetNumber = await getNextBudgetNumber();

                // Crear el presupuesto
                const budget = await prisma.budget.create({
                    data: {
                        budgetNumber,
                        subject: input.subject,
                        description: input.description,
                        price: input.price,
                        clientName: input.clientName,
                        markup: input.markup,
                        expectedExpenses: input.expectedExpenses || [],
                        manpower: input.manpower || [],
                        budgetBranch: input.budgetBranch,
                        totalExpectedExpenses:
                            input.expectedExpenses?.reduce(
                                (sum, expense) => sum + expense.amount,
                                0,
                            ) || 0,
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
                if (!input.billingProfileId && !input.businessCUIT) {
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
                let businessId = input.businessId;
                if (!input.businessId) {
                    if (!input.businessName) {
                        return {
                            success: false,
                            message:
                                'No se proporciono un nombre de empresa ni una empresa valida',
                        };
                    } else {
                        const newBusiness = await prisma.business.create({
                            data: {
                                name: input.businessName!,
                            },
                        });
                        businessId = newBusiness.id;
                    }
                }

                // Verificar que no tenga ya un perfil de facturación
                const existingProfile = await prisma.billingProfile.findUniqueUndeleted({
                    where: { businessId: businessId! },
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
                        IVACondition: input.businessIVACondition as IVACondition,
                        comercialAddress: input.businessComercialAddress!,
                        billingEmail: input.businessBillingEmail!,
                        business: {
                            connect: { id: businessId! },
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

                // Generar número de presupuesto
                const budgetNumber = await getNextBudgetNumber();

                // Crear el presupuesto
                const budget = await prisma.budget.create({
                    data: {
                        budgetNumber,
                        subject: input.subject,
                        description: input.description,
                        price: input.price,
                        clientName: input.clientName,
                        markup: input.markup,
                        expectedExpenses: input.expectedExpenses || [],
                        manpower: input.manpower || [],
                        budgetBranch: input.budgetBranch,
                        totalExpectedExpenses:
                            input.expectedExpenses?.reduce(
                                (sum, expense) => sum + expense.amount,
                                0,
                            ) || 0,
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
                if (input.clientName !== undefined) {
                    updateData.clientName = input.clientName;
                }
                if (input.markup !== undefined) {
                    updateData.markup = input.markup;
                }
                if (input.expectedExpenses !== undefined) {
                    updateData.expectedExpenses = input.expectedExpenses;
                    updateData.totalExpectedExpenses = input.expectedExpenses?.reduce(
                        (sum, expense) => sum + expense.amount,
                        0,
                    );
                }
                if (input.manpower !== undefined) {
                    updateData.manpower = input.manpower;
                }
                if (input.budgetBranch !== undefined) {
                    updateData.budgetBranch = input.budgetBranch;
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
                    include: {
                        billingProfile: {
                            include: {
                                business: true,
                            },
                        },
                        client: true,
                        branch: true,
                    },
                });

                // Si el presupuesto está aprobado, actualizar la orden de servicio asociada
                if (budget.status === BudgetStatus.Aprobado) {
                    const serviceOrder = await prisma.serviceOrder.findFirst({
                        where: { budgetId: budget.id },
                    });

                    if (serviceOrder) {
                        // Actualizar orden de servicio con los nuevos datos
                        await prisma.serviceOrder.update({
                            where: { id: serviceOrder.id },
                            data: {
                                clientId: budget.clientId!,
                                businessId: budget.billingProfile.businessId,
                                branchId: budget.branchId!,
                                description: budget.description,
                                // assignedTechnicians:
                                //     budget.manpower?.map(
                                //         (manpower) => manpower.technician,
                                //     ) || [],
                            },
                        });

                        // Obtener usuarios administrativos técnicos para notificación
                        const adminUsers = await prisma.user.findMany({
                            where: {
                                roles: {
                                    has: 'AdministrativoTecnico',
                                },
                            },
                            select: { id: true },
                        });

                        // Enviar notificación por email sobre la actualización
                        if (adminUsers.length > 0) {
                            const message = `
                                <h3>Orden de Servicio Actualizada</h3>
                                <p><strong>Número de Orden:</strong> ${serviceOrder.serviceOrderNumber}</p>
                                <p><strong>Presupuesto:</strong> ${budget.subject}</p>
                                <p><strong>Cliente:</strong> ${budget.clientName || budget.client?.name || 'No especificado'}</p>
                                <p><strong>Empresa:</strong> ${budget.billingProfile.business?.name || 'No especificada'}</p>
                                <p><strong>Sucursal:</strong> ${budget.branch?.name || 'No especificada'}</p>
                                <p><strong>Técnicos Asignados:</strong> ${budget.manpower?.map((m) => m.technician).join(', ') || 'No especificados'}</p>
                                <p><strong>Descripción:</strong> ${budget.description || 'No especificada'}</p>
                                <p><em>Los datos de la orden de servicio han sido actualizados según los cambios realizados en el presupuesto.</em></p>
                            `;

                            await Mailer.sendEmailNotification(
                                adminUsers.map((user) => user.id),
                                `Orden de Servicio #${serviceOrder.serviceOrderNumber} Actualizada`,
                                message,
                            );
                        }
                    }
                }

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
                    include: { billingProfile: { include: { business: true } } },
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
                    // Verificar si ya existe una orden de servicio para este presupuesto
                    const existingServiceOrder = await prisma.serviceOrder.findFirst({
                        where: {
                            budgetId: existingBudget.id,
                        },
                    });

                    if (!existingServiceOrder) {
                        // Generar el próximo número de orden de servicio
                        const maxOrder = await prisma.serviceOrder.findFirst({
                            orderBy: { serviceOrderNumber: 'desc' },
                            select: { serviceOrderNumber: true },
                        });
                        const nextNumber = (maxOrder?.serviceOrderNumber ?? 0) + 1;

                        // Crear orden de servicio con técnicos asignados
                        const serviceOrder = await prisma.serviceOrder.create({
                            data: {
                                serviceOrderNumber: nextNumber,
                                status: ServiceOrderStatus.Pendiente,
                                clientId: existingBudget.clientId!,
                                businessId: existingBudget.billingProfile.businessId!,
                                branchId: existingBudget.branchId!,
                                description: existingBudget.description ?? undefined,
                                budgetId: existingBudget.id,
                                // Agregar técnicos asignados desde la mano de obra del presupuesto
                                // assignedTechnicians:
                                //     existingBudget.manpower?.map(
                                //         (manpower) => manpower.technician,
                                //     ) || [],
                            },
                        });

                        // Obtener usuarios administrativos técnicos para notificación
                        const adminUsers = await prisma.user.findMany({
                            where: {
                                roles: {
                                    has: 'AdministrativoTecnico',
                                },
                            },
                            select: { id: true },
                        });

                        // Enviar notificación por email
                        if (adminUsers.length > 0) {
                            const message = `
                                <h3>Nueva Orden de Servicio Creada</h3>
                                <p><strong>Número de Orden:</strong> ${serviceOrder.serviceOrderNumber}</p>
                                <p><strong>Presupuesto:</strong> ${existingBudget.subject}</p>
                                <p><strong>Cliente:</strong> ${existingBudget.clientName || 'No especificado'}</p>
                                <p><strong>Empresa:</strong> ${existingBudget.billingProfile.business?.name || 'No especificada'}</p>
                                <p><strong>Técnicos Asignados:</strong> ${existingBudget.manpower?.map((manpower) => manpower.technician).join(', ') || 'No especificados'}</p>
                                <p><strong>Descripción:</strong> ${existingBudget.description || 'No especificada'}</p>
                            `;
                            await Mailer.sendEmailNotification(
                                adminUsers.map((user) => user.id),
                                `Nueva Orden de Servicio #${serviceOrder.serviceOrderNumber}`,
                                message,
                            );
                        }
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
}));
