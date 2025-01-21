import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ExpenseStatus, TaskStatus, Task } from '@prisma/client';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';

import {
    TaskCrudResultPothosRef,
    TaskInputPothosRef,
    UpdateMyTaskInput,
    MyTaskInputPothosRef,
    TaskStatusPothosRef,
} from './refs';

import { createImageSignedUrlAsync } from 'backend/s3Client';
import { builder } from 'backend/schema/builder';
import { removeDeleted, calculateMaxRowHeight } from 'backend/schema/utils';
import { prisma } from 'lib/prisma';

function buildWhereClause(filters: any): any {
    const whereClause: any = {};

    filters.forEach((filter: { id: string; value: any }) => {
        switch (filter.id) {
            case 'client':
                whereClause['branch.client.id'] = filter.value;
                break;
            case 'branch':
                whereClause['branch.city.id'] = filter.value;
                break;
            case 'business':
                whereClause['business.id'] = filter.value;
                break;
            case 'assigned':
                whereClause['assigned.some'] = { id: { in: filter.value } };
                break;
            case 'taskStatus':
                whereClause['status'] = { in: filter.value };
                break;
            case 'taskType':
                whereClause['taskType'] = { in: filter.value };
                break;
            default:
                break;
        }
    });

    return whereClause;
}

const TaskReportFilterInput = builder.inputType('TaskReportFilterInput', {
    fields: (t) => ({
        id: t.string({ required: true }),
        value: t.field({
            type: 'JSON',
            required: true,
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
                    or: ['IsAdministrativoTecnico'],
                },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { input } = args;
                const maxTaskNumber = await prisma.task.findFirst({
                    orderBy: { taskNumber: 'desc' },
                    select: { taskNumber: true },
                });
                const task: Task = await prisma.task.create({
                    data: {
                        taskNumber: (maxTaskNumber?.taskNumber ?? 0) + 1,
                        actNumber: input.actNumber,
                        auditorId: input.auditor,
                        branchId: input.branch ?? undefined,
                        businessId: input.business ?? undefined,
                        clientName: input.clientName ?? undefined,
                        businessName: input.businessName ?? undefined,
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
                const { user } = _context;
                const { input } = args;
                const maxTaskNumber = await prisma.task.findFirst({
                    orderBy: { taskNumber: 'desc' },
                    select: { taskNumber: true },
                });
                const taskNumber = (maxTaskNumber?.taskNumber ?? 0) + 1;
                const task: Task = await prisma.task.create({
                    data: {
                        taskNumber,
                        actNumber: Number(input.actNumber),
                        branchId: input.branch ?? undefined,
                        businessId: input.business ?? undefined,
                        clientName: input.clientName ?? undefined,
                        businessName: input.businessName ?? undefined,
                        description: `Tarea creada por ${user.fullName} desde APK`,
                        observations: input.observations,
                        status: TaskStatus.Finalizada,
                        taskType: input.taskType,
                        ...(input.assigned && {
                            assignedIDs: {
                                set: input.assigned,
                            },
                        }),
                        closedAt: input.closedAt,
                        startedAt: input.startedAt,
                        images: {
                            create: input.imageKeys
                                ? await Promise.all(
                                      input.imageKeys.map(async (key) => {
                                          return {
                                              ...(await createImageSignedUrlAsync(key)),
                                              key,
                                          };
                                      }),
                                  )
                                : [],
                        },
                        expenses: {
                            create: input.expenses
                                ? await Promise.all(
                                      input.expenses.map(async (expenseData, index) => {
                                          return {
                                              expenseNumber: `${taskNumber}-${index + 1}`,
                                              amount: expenseData.amount,
                                              expenseType: expenseData.expenseType,
                                              paySource: expenseData.paySource,
                                              paySourceBank: expenseData.paySourceBank,
                                              installments: expenseData.installments,
                                              expenseDate: expenseData.expenseDate,
                                              doneBy: expenseData.doneBy,
                                              status: ExpenseStatus.Enviado,
                                              cityName: expenseData.cityName,
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
                    message: `Error al crear la tarea: ${
                        error instanceof Error ? error.message : 'Unknown error'
                    }`,
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
                    actNumber: input.actNumber ?? undefined,
                    auditorId: input.auditor ?? undefined,
                    branchId: input.branch ?? undefined,
                    businessId: input.business ?? undefined,
                    description: input.description,
                    taskType: input.taskType,
                    assignedIDs: {
                        set: input.assigned,
                    },
                    movitecTicket: input.movitecTicket ?? undefined,
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
                const task = await prisma.task.findUniqueUndeleted({
                    where: { id },
                    select: {
                        closedAt: true,
                        status: true,
                    },
                });

                if (!task?.closedAt) {
                    throw new Error('La tarea no tiene fecha de cierre');
                }

                if (!task) {
                    throw new Error('La tarea no existe');
                }

                const taskUpdated = await prisma.task.update({
                    where: { id },
                    data: { status },
                });

                return {
                    success: true,
                    task: taskUpdated,
                };
            } catch (error) {
                return {
                    message: `Error al actualizar el estado de la tarea: ${
                        error instanceof Error ? error.message : 'Unknown error'
                    }`,
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
                        startedAt,
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
                        startedAt: startedAt,
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
                                      expenses.map(async (expenseData, index) => {
                                          // Encontrar el último número de secuencia para esta tarea
                                          const task = await prisma.task.findUnique({
                                              where: { id },
                                              select: { taskNumber: true },
                                          });

                                          if (!task) {
                                              throw new Error('Task not found');
                                          }

                                          const lastExpense =
                                              await prisma.expense.findFirst({
                                                  where: {
                                                      task: { id },
                                                      expenseNumber: {
                                                          contains:
                                                              task.taskNumber.toString(),
                                                      },
                                                  },
                                                  orderBy: {
                                                      expenseNumber: 'desc',
                                                  },
                                              });

                                          const sequence = lastExpense
                                              ? parseInt(
                                                    lastExpense.expenseNumber.split(
                                                        '-',
                                                    )[1],
                                                ) + 1
                                              : 1;

                                          return {
                                              expenseNumber: `${task.taskNumber}-${
                                                  sequence + index
                                              }`,
                                              amount: expenseData.amount,
                                              expenseType: expenseData.expenseType,
                                              paySource: expenseData.paySource,
                                              status: ExpenseStatus.Enviado,
                                              doneBy: expenseData.doneBy,
                                              cityName: expenseData.cityName,
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
    generateApprovedTasksReport: t.field({
        type: 'String',
        args: {
            startDate: t.arg.string({ required: true }),
            endDate: t.arg.string({ required: true }),
            filters: t.arg({
                type: [TaskReportFilterInput],
                required: false,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (root, { startDate, endDate, filters }) => {
            try {
                const whereClause = {
                    status: TaskStatus.Aprobada,
                    deleted: false,
                    closedAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                    ...(filters && buildWhereClause(filters)),
                };

                const tasks = await prisma.task.findMany({
                    where: whereClause,
                    include: {
                        assigned: true,
                        business: true,
                        branch: {
                            include: {
                                client: true,
                                city: true,
                            },
                        },
                        expenses: true,
                    },
                    orderBy: {
                        closedAt: 'desc',
                    },
                });

                // 2. Crear el archivo Excel
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Tareas Aprobadas');

                // 3. Definir encabezados
                worksheet.columns = [
                    {
                        header: 'Número de tarea',
                        key: 'taskNumber',
                        width: 15,
                    },
                    {
                        header: 'Técnicos',
                        key: 'technicians',
                        width: 20,
                    },
                    {
                        header: 'Empresa',
                        key: 'business',
                        width: 20,
                    },
                    {
                        header: 'Cliente',
                        key: 'client',
                        width: 20,
                    },
                    {
                        header: 'Sucursal',
                        key: 'branch',
                        width: 25,
                    },
                    {
                        header: 'Descripción',
                        key: 'description',
                        width: 40,
                        style: { alignment: { wrapText: true } },
                    },
                    {
                        header: 'Fecha de Inicio',
                        key: 'startedAt',
                        width: 20,
                    },
                    {
                        header: 'Fecha de Cierre',
                        key: 'closedAt',
                        width: 20,
                    },
                    {
                        header: 'Número de Acta',
                        key: 'actNumber',
                        width: 16,
                    },
                    {
                        header: 'Gastos Totales',
                        key: 'expenses',
                        width: 15,
                    },
                    {
                        header: 'Observaciones',
                        key: 'observations',
                        width: 40,
                        style: { alignment: { wrapText: true } },
                    },
                ];

                // 4. Agregar datos
                tasks.forEach((task, index) => {
                    const filteredExpenses = removeDeleted(task.expenses);
                    const totalExpenses = filteredExpenses.reduce((acc, expense) => {
                        return acc + expense.amount;
                    }, 0);

                    worksheet.addRow({
                        taskNumber: `#${task.taskNumber}`,
                        technicians: task.assigned
                            .map((tech) => tech.fullName)
                            .join(', '),
                        business: task.business?.name ?? task.businessName,
                        client: task.branch?.client.name ?? task.clientName,
                        branch: `#${
                            `${task.branch?.number}, ${task.branch?.city.name}` ?? 'N/A'
                        }`,
                        description: task.description,
                        startedAt: task.startedAt
                            ? format(task.startedAt, 'dd/MM/yyyy HH:mm')
                            : 'N/A',
                        closedAt: task.closedAt
                            ? format(task.closedAt, 'dd/MM/yyyy HH:mm')
                            : 'N/A',
                        actNumber: task.actNumber,
                        expenses: `${totalExpenses.toLocaleString('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                        })} en ${filteredExpenses.length} gastos distintos`,
                        observations: task.observations,
                    });

                    const row = worksheet.getRow(index + 2);
                    const rowHeight = calculateMaxRowHeight({
                        description: {
                            text: task.description || '',
                            width: 40,
                        },
                        observations: {
                            text: task.observations || '',
                            width: 40,
                        },
                        technicians: {
                            text: task.assigned.map((tech) => tech.fullName).join(', '),
                            width: 20,
                        },
                    });

                    row.height = rowHeight;
                    row.alignment = { wrapText: true };
                });

                // 5. Dar formato a la tabla
                worksheet.getRow(1).font = { bold: true };
                worksheet.getRow(1).alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                };

                // 6. Generar el buffer del archivo
                const buffer = await workbook.xlsx.writeBuffer();

                // 7. Configurar el cliente S3
                const s3Client = new S3Client({
                    region: process.env.AWS_REGION,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                    },
                });

                // 8. Generar nombre único para el archivo
                const fileName = `tareas-aprobadas-${format(
                    new Date(),
                    'yyyy-MM-dd-HH-mm-ss',
                )}.xlsx`;

                // 9. Subir a S3
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: `reports/${fileName}`,
                        Body: new Uint8Array(buffer),
                        ContentType:
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    }),
                );

                // 10. Generar URL firmada para descarga
                const getCommand = new GetObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: `reports/${fileName}`,
                });

                const downloadUrl = await getSignedUrl(s3Client, getCommand, {
                    expiresIn: 3600,
                });

                return downloadUrl;
            } catch (error) {
                console.error('Error generating report:', error);
                throw new Error('Error al generar el reporte');
            }
        },
    }),
}));
