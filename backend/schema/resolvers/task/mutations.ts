import { ExpenseStatus, TaskStatus } from '@prisma/client';

import {
    TaskCrudResultPothosRef,
    TaskInputPothosRef,
    UpdateMyTaskInput,
    MyTaskInputPothosRef,
    TaskStatusPothosRef,
} from './refs';

import { createImageSignedUrlAsync } from 'backend/s3Client';
import { builder } from 'backend/schema/builder';
import { removeDeleted } from 'backend/schema/utils';
import { prisma } from 'lib/prisma';

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
                    or: ['IsAdministrativoTecnico'],
                },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { input } = args;
                const task = await prisma.task.create({
                    data: {
                        actNumber: input.actNumber,
                        auditorId: input.auditor,
                        branchId: input.branch,
                        businessId: input.business,
                        description: input.description,
                        status: TaskStatus.Pendiente,
                        taskType: input.taskType,
                        assignedIDs: {
                            set: input.assigned,
                        },
                        movitecTicket: input.movitecTicket,
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
    createMyTask: t.field({
        type: TaskCrudResultPothosRef,
        args: {
            input: t.arg({
                type: MyTaskInputPothosRef,
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
        resolve: async (root, args, _context, _info) => {
            try {
                const {
                    input: {
                        actNumber,
                        branch,
                        business,
                        observations,
                        closedAt,
                        imageKeys,
                        expenses,
                        taskType,
                        assigned,
                    },
                } = args;
                const task = await prisma.task.create({
                    data: {
                        actNumber: Number(actNumber),
                        branchId: branch,
                        businessId: business,
                        description: 'Tarea de emergencia',
                        observations,
                        status: TaskStatus.Finalizada,
                        taskType: taskType,
                        ...(assigned && {
                            assignedIDs: {
                                set: assigned,
                            },
                        }),
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
                                              paySourceBank: expenseData.paySourceBank,
                                              installments: expenseData.installments,
                                              expenseDate: expenseData.expenseDate,
                                              doneBy: expenseData.doneBy,
                                              status: ExpenseStatus.Enviado,
                                              registeredBy: {
                                                  connect: { id: _context.user.id },
                                              },
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
                console.log(error);
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
        resolve: async (root, args, _info) => {
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
                    actNumber: input.actNumber,
                    auditorId: input.auditor,
                    branchId: input.branch,
                    businessId: input.business,
                    description: input.description,
                    taskType: input.taskType,
                    assignedIDs: {
                        set: input.assigned,
                    },
                    movitecTicket: input.movitecTicket,
                };

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
    updateTaskStatus: t.field({
        type: TaskCrudResultPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
            status: t.arg({
                type: TaskStatusPothosRef,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                {
                    or: ['IsAdministrativoTecnico'],
                },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { id, status } = args;
                const task = await prisma.task.update({
                    where: { id },
                    data: { status },
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

                const expensesToDelete = await prisma.expense.findManyUndeleted({
                    where: {
                        taskId: id,
                    },
                });

                for (const expense of expensesToDelete) {
                    const expenseToDelete = await prisma.expense.softDeleteOne({
                        id: expense.id,
                    });
                    await prisma.image.softDeleteOne({ id: expenseToDelete.imageId });
                }

                const imagesToDelete = task.imagesIDs;

                for (const imageId of imagesToDelete) {
                    await prisma.image.softDeleteOne({ id: imageId });
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
                        actNumber,
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
                        actNumber: true,
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
                        actNumber: actNumber
                            ? parseInt(actNumber, 10)
                            : foundTask.actNumber,
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
                                              doneBy: expenseData.doneBy,
                                              installments: expenseData.installments,
                                              expenseDate: expenseData.expenseDate,
                                              paySourceBank: expenseData.paySourceBank,
                                              observations: expenseData.observations,
                                              registeredBy: { connect: { id: user.id } },
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
        resolve: async (root, { taskId, imageId }) => {
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

                return {
                    success: true,
                    task,
                };
            } catch (error) {
                console.error(error);
                return { success: false };
            }
        },
    }),
}));
