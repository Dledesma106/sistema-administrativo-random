import { ExpenseStatus, Task, TaskStatus } from '@prisma/client';

import { TaskPothosRef, TaskStatusPothosRef, TaskTypePothosRef } from './refs';

import { createImageSignedUrlAsync } from 'backend/s3Client';
import { builder } from 'backend/schema/builder';
import { removeDeleted } from 'backend/schema/utils';
import { prisma } from 'lib/prisma';

import {
    ExpenseTypePothosRef,
    ExpensePaySourcePothosRef,
    ExpenseCrudResultPothosRef,
    ExpenseStatusPothosRef,
} from '../expense';

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
        metadata: t.field({
            type: 'JSON',
            required: true,
        }),
    }),
});

const ExpenseInputType = builder.inputType('ExpenseInput', {
    fields: (t) => ({
        amount: t.int({ required: true }),
        expenseType: t.field({ type: ExpenseTypePothosRef, required: true }),
        paySource: t.field({ type: ExpensePaySourcePothosRef, required: true }),
        imageKey: t.string({ required: true }),
    }),
});

const UpdateMyTaskInput = builder.inputType('UpdateMyTaskInput', {
    fields: (t) => ({
        id: t.string({ required: true }),
        workOrderNumber: t.string({ required: false }),
        imageKeys: t.stringList({ required: false }),
        expenseIdsToDelete: t.stringList({ required: false }),
        imageIdsToDelete: t.stringList({ required: false }),
        observations: t.string({ required: false }),
        closedAt: t.field({ type: 'DateTime', required: false }),
        expenses: t.field({ type: [ExpenseInputType], required: false }),
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
                        metadata: input.metadata,
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

                const foundTask = await prisma.task.findUniqueUndeleted({
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
                    metadata: input.metadata,
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
            compositeRules: [
                { and: ['IsAuthenticated'] },
                {
                    or: ['IsAdministrativoTecnico', 'IsAuditor'],
                },
            ],
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
    createExpenseOnTask: t.field({
        type: ExpenseCrudResultPothosRef,
        args: {
            taskId: t.arg.string({ required: true }),
            expenseData: t.arg({ type: ExpenseInputType, required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                {
                    or: ['IsTecnico'],
                },
            ],
        },
        resolve: async (_parent, { taskId, expenseData }, _context) => {
            try {
                const newExpense = await prisma.expense.create({
                    data: {
                        amount: expenseData.amount,
                        expenseType: expenseData.expenseType,
                        paySource: expenseData.paySource,
                        status: ExpenseStatus.Enviado,
                        doneBy: { connect: { id: _context.user.id } },
                        task: { connect: { id: taskId } },
                        image: {
                            create: {
                                ...(await createImageSignedUrlAsync(
                                    expenseData.imageKey,
                                )),
                                key: expenseData.imageKey,
                            },
                        },
                    },
                });
                return {
                    success: true,
                    expense: newExpense,
                };
            } catch (error) {
                return {
                    success: false,
                };
            }
        },
    }),
    updateMyAssignedTask: t.field({
        type: TaskCrudResultPothosRef,
        args: {
            input: t.arg({
                type: UpdateMyTaskInput,
                required: true,
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
                const {
                    input: {
                        id,
                        workOrderNumber,
                        imageKeys,
                        observations,
                        closedAt,
                        expenses,
                        expenseIdsToDelete,
                        imageIdsToDelete,
                    },
                } = args;

                const foundTask = await prisma.task.findUniqueUndeleted({
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
                        observations: true,
                        images: true,
                    },
                });
                if (!foundTask) {
                    return {
                        message: 'La tarea no existe',
                        success: false,
                    };
                }

                if (foundTask.status === TaskStatus.Aprobada) {
                    return {
                        message: 'No se puede actualizar la tarea porque ya fue aprobada',
                        success: false,
                    };
                }
                if (expenseIdsToDelete) {
                    for (const id of expenseIdsToDelete) {
                        const expense = await prisma.expense.softDeleteOne({
                            id,
                        });
                        if (!expense) {
                            return {
                                message: 'El gasto no existe',
                                success: false,
                            };
                        }
                        await prisma.image.softDeleteOne({
                            id: expense.imageId,
                        });
                    }
                }
                const filteredImages = removeDeleted(foundTask.images);
                if (imageIdsToDelete) {
                    for (const id of imageIdsToDelete) {
                        const image = filteredImages.find((img) => img.id === id);
                        if (!image) {
                            throw new Error('Image not found in the specified task');
                        }
                        await prisma.image.softDeleteOne({ id });
                    }
                }
                const task = await prisma.task.update({
                    where: {
                        id,
                    },
                    data: {
                        workOrderNumber: workOrderNumber
                            ? parseInt(workOrderNumber, 10)
                            : foundTask.workOrderNumber,
                        status: TaskStatus.Finalizada,
                        observations: observations ?? foundTask.observations,
                        closedAt: closedAt,
                        images: {
                            create: imageKeys
                                ? await Promise.all(
                                      imageKeys.map(async (key) => {
                                          return {
                                              ...(await createImageSignedUrlAsync(key)),
                                              key,
                                          };
                                      }),
                                  )
                                : [],
                        },
                        expenses: {
                            create: expenses
                                ? await Promise.all(
                                      expenses.map(async (expenseData) => {
                                          return {
                                              amount: expenseData.amount,
                                              expenseType: expenseData.expenseType,
                                              paySource: expenseData.paySource,
                                              status: ExpenseStatus.Enviado,
                                              doneBy: { connect: { id: user.id } },
                                              image: {
                                                  create: {
                                                      ...(await createImageSignedUrlAsync(
                                                          expenseData.imageKey,
                                                      )),
                                                      key: expenseData.imageKey,
                                                  },
                                              },
                                          };
                                      }),
                                  )
                                : [],
                        },
                    },
                });

                return {
                    success: true,
                    task,
                };
            } catch (error) {
                console.error(error);
                return {
                    success: false,
                };
            }
        },
    }),
    deleteImage: t.field({
        type: TaskCrudResultPothosRef,
        args: {
            taskId: t.arg.string({ required: true }),
            imageId: t.arg.string({ required: true }),
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
        resolve: async (root, { taskId, imageId }, { user }) => {
            try {
                // Verificar que la imagen pertenece a la tarea
                const task = await prisma.task.findUniqueUndeleted({
                    where: { id: taskId },
                    include: { images: true },
                });

                if (!task) {
                    throw new Error('Task not found');
                }
                const filteredImages = removeDeleted(task.images);
                const image = filteredImages.find((img) => img.id === imageId);
                if (!image) {
                    throw new Error('Image not found in the specified task');
                }

                // Eliminar la imagen
                await prisma.image.softDeleteOne({ id: imageId });

                return { success: true, task };
            } catch (error) {
                console.error(error);
                return { success: false };
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
                const foundExpense = await prisma.expense.findUniqueUndeleted({
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
