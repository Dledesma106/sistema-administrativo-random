import { ExpenseStatus, Task, TaskStatus } from '@prisma/client';

import { TaskPothosRef, TaskStatusPothosRef, TaskTypePothosRef } from './refs';

import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

import { ExpenseStatusPothosRef } from '../expense';

const TaskInputPothosRef = builder.inputType('TaskInput', {
    fields: (t) => ({
        description: t.string({
            required: true,
        }),

        status: t.field({
            type: TaskStatusPothosRef,
            required: true,
        }),
        taskType: t.field({
            type: TaskTypePothosRef,
            required: true,
        }),
        workOrderNumber: t.int({
            required: false,
        }),
        branch: t.string({
            required: true,
        }),
        business: t.string({
            required: true,
        }),
        auditor: t.string({
            required: false,
        }),
        assigned: t.stringList({
            required: true,
        }),
    }),
});

const TaskCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        task?: Task;
    }>('TaskCrudResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            task: t.field({
                type: TaskPothosRef,
                nullable: true,
                resolve: (result) => result.task,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
        }),
    });

builder.mutationFields((t) => ({
    createTask: t.field({
        type: TaskCrudResultPothosRef,
        args: {
            input: t.arg({
                type: TaskInputPothosRef,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoTecnico', 'IsTecnico'],
                },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { input } = args;
                const task = await prisma.task.create({
                    data: {
                        workOrderNumber: input.workOrderNumber,
                        auditorId: input.auditor,
                        branchId: input.branch,
                        businessId: input.business,
                        description: input.description,
                        status: input.status,
                        taskType: input.taskType,
                        assignedIDs: {
                            set: input.assigned,
                        },
                    },
                });
                return {
                    success: true,
                    task,
                };
            } catch (error) {
                return {
                    success: false,
                };
            }
        },
    }),
    updateTask: t.field({
        type: TaskCrudResultPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
            input: t.arg({
                type: TaskInputPothosRef,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                {
                    or: ['IsAdministrativoTecnico', 'IsAuditor'],
                },
            ],
        },
        resolve: async (root, args, { user }, _info) => {
            try {
                const { id, input } = args;

                const foundTask = await prisma.task.findUnique({
                    where: {
                        id,
                    },
                    select: {
                        status: true,
                        auditorId: true,
                        expenses: {
                            select: {
                                status: true,
                            },
                        },
                    },
                });
                if (!foundTask) {
                    return {
                        message: 'La tarea no existe',
                        success: false,
                    };
                }

                const data = {
                    workOrderNumber: input.workOrderNumber,
                    auditorId: input.auditor,
                    branchId: input.branch,
                    businessId: input.business,
                    description: input.description,
                    status: input.status,
                    taskType: input.taskType,
                    assignedIDs: {
                        set: input.assigned,
                    },
                };

                if (foundTask.status === data.status) {
                    data.auditorId = foundTask.auditorId;
                } else {
                    if (data.status === TaskStatus.Aprobada) {
                        data.auditorId = user.id;
                    } else {
                        data.auditorId = null;
                    }
                }

                if (data.status === TaskStatus.Aprobada) {
                    const expenses = foundTask.expenses.filter(
                        (expense) => expense.status === ExpenseStatus.Enviado,
                    );

                    if (expenses.length > 0) {
                        return {
                            message:
                                'No se puede aprobar la tarea porque hay gastos pendientes de aprobar',
                            success: false,
                        };
                    }
                }

                const task = await prisma.task.update({
                    where: {
                        id,
                    },
                    data,
                });

                return {
                    success: true,
                    task,
                };
            } catch (error) {
                return {
                    success: false,
                };
            }
        },
    }),
    deleteTask: t.field({
        type: TaskCrudResultPothosRef,
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
                const task = await prisma.task.softDeleteOne({
                    id,
                });

                if (!task) {
                    return {
                        message: 'La tarea no existe',
                        success: false,
                    };
                }

                return {
                    success: true,
                    task,
                };
            } catch (error) {
                return {
                    message: 'Error al eliminar la tarea',
                    success: false,
                };
            }
        },
    }),
    updateMyAssignedTask: t.field({
        type: TaskCrudResultPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
            status: t.arg({
                type: TaskStatusPothosRef,
                required: false,
            }),
            workOrderNumber: t.arg.int({
                required: false,
            }),
            imageIdToDelete: t.arg.string({
                required: false,
            }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsTecnico'],
                },
            ],
        },
        resolve: async (root, args, { user }) => {
            try {
                const { id, status, workOrderNumber, imageIdToDelete } = args;

                const foundTask = await prisma.task.findUnique({
                    where: {
                        id,
                        assignedIDs: {
                            has: user.id,
                        },
                    },
                    select: {
                        status: true,
                        workOrderNumber: true,
                        imagesIDs: true,
                    },
                });
                if (!foundTask) {
                    return {
                        message: 'La tarea no existe',
                        success: false,
                    };
                }

                if (foundTask.status === TaskStatus.Finalizada) {
                    return {
                        message:
                            'No se puede actualizar la tarea porque ya fue finalizada',
                        success: false,
                    };
                }

                if (foundTask.status === TaskStatus.Aprobada) {
                    return {
                        message: 'No se puede actualizar la tarea porque ya fue aprobada',
                        success: false,
                    };
                }

                const data = {
                    workOrderNumber: workOrderNumber ?? foundTask.workOrderNumber,
                    status: status ?? foundTask.status,
                    imagesIDs: {
                        set: imageIdToDelete
                            ? foundTask.imagesIDs.filter((id) => id !== imageIdToDelete)
                            : foundTask.imagesIDs,
                    },
                };

                // TODO: Delete image from storage S3
                if (imageIdToDelete && foundTask.imagesIDs.includes(imageIdToDelete)) {
                    await prisma.image.delete({
                        where: {
                            id: imageIdToDelete,
                        },
                    });
                }

                const task = await prisma.task.update({
                    where: {
                        id,
                    },
                    data,
                });

                return {
                    success: true,
                    task,
                };
            } catch (error) {
                return {
                    success: false,
                };
            }
        },
    }),
    updateTaskExpenseStatus: t.field({
        type: TaskCrudResultPothosRef,
        args: {
            expenseId: t.arg.string({
                required: true,
            }),
            status: t.arg({
                type: ExpenseStatusPothosRef,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoTecnico', 'IsAuditor'],
                },
            ],
        },
        resolve: async (root, args) => {
            try {
                const { expenseId, status } = args;
                const foundExpense = await prisma.expense.findUnique({
                    where: {
                        id: expenseId,
                    },
                    select: {
                        task: {
                            select: {
                                status: true,
                            },
                        },
                    },
                });

                if (!foundExpense) {
                    return {
                        message: 'El gasto no existe',
                        success: false,
                    };
                }

                if (foundExpense.task.status === TaskStatus.Aprobada) {
                    return {
                        message:
                            'No se puede actualizar el estado del gasto porque la tarea ya fue aprobada',
                        success: false,
                    };
                }

                const expense = await prisma.expense.update({
                    where: {
                        id: expenseId,
                    },
                    data: {
                        status,
                    },
                    select: {
                        task: true,
                    },
                });

                return {
                    success: true,
                    task: expense.task,
                };
            } catch (error) {
                return {
                    success: false,
                };
            }
        },
    }),
}));
