import {
    BudgetStatus,
    IVACondition,
    ServiceOrderStatus,
    TipoDocumento,
} from '@prisma/client';

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
import {
    extractParticipantsFromManpower,
    processParticipantsAndAssigned,
    convertManpowerIdsToNames,
} from '../../../services/participantService';

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

                // Extraer participantes desde manpower (puede contener IDs o nombres)
                const participantsFromManpower = extractParticipantsFromManpower(
                    input.manpower,
                );

                // Procesar participantes y asignados
                const { updatedAssignedIDs } = await processParticipantsAndAssigned(
                    participantsFromManpower,
                    [], // No hay asignados iniciales
                );

                // Convertir IDs a nombres en manpower antes de guardar
                const processedManpower = await convertManpowerIdsToNames(input.manpower);

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
                        manpower: processedManpower || [],
                        customBranch: input.customBranch,
                        totalExpectedExpenses:
                            input.expectedExpenses?.reduce(
                                (sum, expense) => sum + expense.amount,
                                0,
                            ) || 0,
                        assignedTechnicians: {
                            connect: updatedAssignedIDs.map((id) => ({ id })),
                        },
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
                if (!input.billingProfileId && !input.businessNumeroDocumento) {
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
                        numeroDocumento: input.businessNumeroDocumento!,
                        tipoDocumento: input.businessTipoDocumento as TipoDocumento,
                        legalName: input.businessLegalName!,
                        IVACondition: input.businessIVACondition as IVACondition,
                        comercialAddress: input.businessComercialAddress!,
                        billingEmails: input.businessBillingEmails || [],
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

                // Extraer participantes desde manpower (puede contener IDs o nombres)
                const participantsFromManpower = extractParticipantsFromManpower(
                    input.manpower,
                );

                // Procesar participantes y asignados
                const { updatedAssignedIDs } = await processParticipantsAndAssigned(
                    participantsFromManpower,
                    [], // No hay asignados iniciales
                );

                // Convertir IDs a nombres en manpower antes de guardar
                const processedManpower = await convertManpowerIdsToNames(input.manpower);

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
                        manpower: processedManpower || [],
                        customBranch: input.customBranch,
                        totalExpectedExpenses:
                            input.expectedExpenses?.reduce(
                                (sum, expense) => sum + expense.amount,
                                0,
                            ) || 0,
                        assignedTechnicians: {
                            connect: updatedAssignedIDs.map((id) => ({ id })),
                        },
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
                    select: {
                        assignedTechnicianIDs: true,
                    },
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
                    // Extraer participantes desde manpower (puede contener IDs o nombres)
                    const participantsFromManpower = extractParticipantsFromManpower(
                        input.manpower,
                    );

                    // Procesar participantes y asignados usando los asignados existentes como base
                    const { updatedAssignedIDs } = await processParticipantsAndAssigned(
                        participantsFromManpower,
                        existingBudget.assignedTechnicianIDs || [],
                    );

                    // Convertir IDs a nombres en manpower antes de guardar
                    const processedManpower = await convertManpowerIdsToNames(
                        input.manpower,
                    );

                    updateData.manpower = processedManpower;
                    updateData.assignedTechnicians = {
                        set: updatedAssignedIDs.map((id) => ({ id })),
                    };
                }
                if (input.customBranch !== undefined) {
                    updateData.customBranch = input.customBranch;
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
                        // Preparar datos de actualización para la orden de servicio
                        const serviceOrderUpdateData: any = {
                            clientId: budget.clientId!,
                            businessId: budget.billingProfile.businessId,
                            branchId: budget.branchId!,
                            description: budget.description,
                            subject: budget.subject,
                            participants:
                                budget.manpower?.map((manpower) => manpower.technician) ||
                                [],
                        };

                        // Actualizar campos opcionales solo si tienen valor
                        if (budget.clientName || budget.client?.name) {
                            serviceOrderUpdateData.clientName =
                                budget.clientName || budget.client?.name;
                        }
                        if (budget.customBranch) {
                            serviceOrderUpdateData.customBranch = budget.customBranch;
                        }

                        // Actualizar técnicos asignados si se modificó manpower
                        if (input.manpower !== undefined) {
                            serviceOrderUpdateData.assignedTechnicians = {
                                set: budget.assignedTechnicianIDs.map((id) => ({ id })),
                            };
                        }

                        // Actualizar orden de servicio con los nuevos datos
                        await prisma.serviceOrder.update({
                            where: { id: serviceOrder.id },
                            data: serviceOrderUpdateData,
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
                    include: {
                        billingProfile: { include: { business: true } },
                        branch: true,
                        client: true,
                    },
                });

                if (!existingBudget) {
                    return {
                        success: false,
                        message: 'El presupuesto no existe',
                    };
                }

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

                        // Preparar datos para crear la orden de servicio
                        const serviceOrderData: any = {
                            serviceOrderNumber: nextNumber,
                            status: ServiceOrderStatus.Pendiente,
                            business: {
                                connect: {
                                    id: existingBudget.billingProfile.businessId!,
                                },
                            },
                            budget: {
                                connect: { id: existingBudget.id },
                            },
                            // Heredar campos del presupuesto
                            subject: existingBudget.subject,
                            // Heredar técnicos asignados (IDs)
                            assignedTechnicians: {
                                connect: existingBudget.assignedTechnicianIDs.map(
                                    (id) => ({
                                        id,
                                    }),
                                ),
                            },
                            // Heredar participantes (nombres desde manpower)
                            participants:
                                existingBudget.manpower?.map(
                                    (manpower) => manpower.technician,
                                ) || [],
                        };

                        // Agregar branch solo si existe
                        if (existingBudget.branchId) {
                            serviceOrderData.branch = {
                                connect: { id: existingBudget.branchId },
                            };
                        }

                        // Agregar campos opcionales
                        if (existingBudget.description) {
                            serviceOrderData.description = existingBudget.description;
                        }
                        if (existingBudget.clientName) {
                            serviceOrderData.clientName = existingBudget.clientName;
                        }
                        if (existingBudget.client) {
                            serviceOrderData.client = {
                                connect: { id: existingBudget.clientId! },
                            };
                        }
                        if (existingBudget.customBranch) {
                            serviceOrderData.customBranch = existingBudget.customBranch;
                        }

                        // Crear orden de servicio con técnicos asignados y participantes
                        let serviceOrder;
                        try {
                            serviceOrder = await prisma.serviceOrder.create({
                                data: serviceOrderData,
                            });
                        } catch (serviceOrderError) {
                            console.error(
                                'Error al crear orden de servicio:',
                                serviceOrderError,
                            );
                            return {
                                success: false,
                                message:
                                    'No se pudo crear la orden de servicio. Verifique que el presupuesto tenga todos los datos requeridos (empresa, asunto).',
                            };
                        }

                        // Enviar notificación por email (no bloquea si falla)
                        try {
                            const adminUsers = await prisma.user.findMany({
                                where: {
                                    roles: {
                                        has: 'AdministrativoTecnico',
                                    },
                                },
                                select: { id: true },
                            });

                            if (adminUsers.length > 0) {
                                const clientName =
                                    existingBudget.clientName ||
                                    existingBudget.client?.name ||
                                    'No especificado';
                                const businessName =
                                    existingBudget.billingProfile.business?.name ||
                                    'No especificada';
                                const technicians =
                                    existingBudget.manpower
                                        ?.map((m) => m.technician)
                                        .join(', ') || 'No especificados';

                                const message = `
                                    <h3>Nueva Orden de Servicio Creada</h3>
                                    <p><strong>Número de Orden:</strong> ${serviceOrder.serviceOrderNumber}</p>
                                    <p><strong>Asunto:</strong> ${existingBudget.subject}</p>
                                    <p><strong>Cliente:</strong> ${clientName}</p>
                                    <p><strong>Empresa:</strong> ${businessName}</p>
                                    <p><strong>Técnicos Asignados:</strong> ${technicians}</p>
                                    <p><strong>Descripción:</strong> ${existingBudget.description || 'No especificada'}</p>
                                `;
                                await Mailer.sendEmailNotification(
                                    adminUsers.map((user) => user.id),
                                    `Nueva Orden de Servicio #${serviceOrder.serviceOrderNumber}`,
                                    message,
                                );
                            }
                        } catch (emailError) {
                            // Log del error pero no bloquear la operación
                            console.error(
                                'Error al enviar notificación de orden de servicio:',
                                emailError,
                            );
                        }
                    }
                }

                // Actualizar el estado del presupuesto
                const budget = await prisma.budget.update({
                    where: { id },
                    data: {
                        status: input.status,
                    },
                });

                return {
                    success: true,
                    budget,
                };
            } catch (error) {
                // Log del error técnico para debugging
                console.error('Error en updateBudgetStatus:', error);

                // Determinar mensaje amigable según el tipo de error
                let userMessage =
                    'Ocurrió un error al actualizar el estado del presupuesto';

                if (error instanceof Error) {
                    const errorMsg = error.message.toLowerCase();

                    if (errorMsg.includes('client') || errorMsg.includes('clientid')) {
                        userMessage =
                            'El presupuesto no tiene un cliente válido asignado. Por favor, edite el presupuesto y asigne un cliente.';
                    } else if (
                        errorMsg.includes('business') ||
                        errorMsg.includes('billingprofile')
                    ) {
                        userMessage =
                            'El presupuesto no tiene una empresa o perfil de facturación válido.';
                    } else if (errorMsg.includes('branch')) {
                        userMessage =
                            'Hubo un problema con la sucursal asignada al presupuesto.';
                    } else if (
                        errorMsg.includes('connect') ||
                        errorMsg.includes('database')
                    ) {
                        userMessage =
                            'Error de conexión con la base de datos. Por favor, intente nuevamente.';
                    } else if (errorMsg.includes('email') || errorMsg.includes('smtp')) {
                        userMessage =
                            'La orden de servicio se creó correctamente, pero hubo un problema al enviar las notificaciones por email.';
                    }
                }

                return {
                    success: false,
                    message: userMessage,
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
