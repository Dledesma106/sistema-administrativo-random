import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ExpenseStatus, TaskStatus, Task, PreventiveStatus } from '@prisma/client';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import JSZip from 'jszip';

import {
    TaskCrudResultPothosRef,
    TaskInputPothosRef,
    UpdateMyTaskInput,
    MyTaskInputPothosRef,
    TaskStatusPothosRef,
    DownloadTaskPhotosResultPothosRef,
    UpdateTaskAdministrativeInput,
} from './refs';

import { createImageSignedUrlAsync, getFileSignedUrl } from 'backend/s3Client';
import { builder } from 'backend/schema/builder';
import { removeDeleted } from 'backend/schema/utils';
import { prisma } from 'lib/prisma';

import { sendPushNotification } from '../../../services/notifications';

/**
 * Genera un nuevo número de tarea basado en el último número existente
 * @returns Número de tarea generado
 */
async function generateTaskNumber(): Promise<number> {
    const maxTaskNumber = await prisma.task.findFirst({
        orderBy: { taskNumber: 'desc' },
        select: { taskNumber: true },
    });
    return (maxTaskNumber?.taskNumber ?? 0) + 1;
}

/**
 * Procesa los participantes y asignados de una tarea y los devuelve en dos arreglos, uno con los IDs de los usuarios asignados y otro con los nombres de los participantes
 * @param participants - Array de participantes (IDs o nombres)
 * @param assignedIDs - Array de IDs de usuarios asignados
 * @param currentUserId - ID del usuario actual (opcional)
 * @returns Objeto con los arrays actualizados de asignados y nombres de participantes
 */
async function processParticipantsAndAssigned(
    participants: string[] | undefined,
    assignedIDs: string[],
    currentUserId?: string,
): Promise<{ updatedAssignedIDs: string[]; participantNames: string[] }> {
    let updatedAssignedIDs = [...assignedIDs];
    let participantNames: string[] = [];
    const validUserIds = new Set<string>();
    const idToNameMap = new Map<string, string>();

    // Obtener nombres de todos los asignados
    const assignedUsers = await prisma.user.findMany({
        where: {
            id: { in: updatedAssignedIDs },
            deleted: false,
        },
        select: {
            id: true,
            fullName: true,
        },
    });

    // Mapear IDs a nombres de todos los asignados
    assignedUsers.forEach((user) => {
        idToNameMap.set(user.id, user.fullName);
    });

    if (currentUserId) {
        if (!updatedAssignedIDs.includes(currentUserId)) {
            updatedAssignedIDs.push(currentUserId);
        }
        const currentUser = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { fullName: true },
        });
        if (currentUser) {
            idToNameMap.set(currentUserId, currentUser.fullName);
        }
    }

    if (participants && participants.length > 0) {
        const potentialUserIds = participants.filter((p) => /^[0-9a-fA-F]{24}$/.test(p));

        if (potentialUserIds.length > 0) {
            const existingUsers = await prisma.user.findMany({
                where: {
                    id: { in: potentialUserIds },
                    deleted: false,
                },
                select: {
                    id: true,
                    fullName: true,
                },
            });

            existingUsers.forEach((user) => {
                validUserIds.add(user.id);
                idToNameMap.set(user.id, user.fullName);
                if (!updatedAssignedIDs.includes(user.id)) {
                    updatedAssignedIDs.push(user.id);
                }
            });
        }

        participantNames = participants.map((participant) => {
            if (/^[0-9a-fA-F]{24}$/.test(participant) && idToNameMap.has(participant)) {
                return idToNameMap.get(participant)!;
            }
            return participant;
        });

        // Solo filtrar asignados si no están ni por ID ni por nombre en participantes
        updatedAssignedIDs = updatedAssignedIDs.filter((id) => {
            const userName = idToNameMap.get(id);
            return (
                validUserIds.has(id) ||
                participantNames.includes(userName!) ||
                (currentUserId && id === currentUserId)
            );
        });
    }

    if (currentUserId && idToNameMap.has(currentUserId)) {
        const currentUserName = idToNameMap.get(currentUserId)!;
        if (!participantNames.includes(currentUserName)) {
            participantNames.push(currentUserName);
        }
    }

    return {
        updatedAssignedIDs,
        participantNames,
    };
}

function calculateMaxRowHeight(row: ExcelJS.Row, worksheet: ExcelJS.Worksheet): number {
    let maxHeight = 20; // Aumentamos la altura mínima a 20

    row.eachCell({ includeEmpty: false }, (cell) => {
        // Configurar el ajuste de texto para campos largos
        cell.alignment = {
            wrapText: true,
            vertical: 'top',
        };

        const value = cell.text || '';
        // Obtener el ancho de la columna actual
        const columnWidth = worksheet.getColumn(cell.col).width || 10;
        const charsPerLine = Math.floor(columnWidth * 1.2); // Aproximación de caracteres por línea
        // Dividir por saltos de línea explícitos
        const textLines = value.toString().split('\n');
        let lines = 1;

        // Para la columna de participantes, tratamos cada nombre como una línea separada
        if (worksheet.getColumn(cell.col).key === 'participants') {
            // Si hay muchos participantes, aseguramos que tengan suficiente espacio
            lines = Math.max(textLines.length, value.split(',').length);
        } else {
            // Para otras columnas, calculamos basado en la longitud del texto
            lines = textLines.reduce((count, line) => {
                // Calculamos líneas adicionales por longitud
                return count + Math.max(1, Math.ceil(line.length / charsPerLine));
            }, 0);
        }

        // Multiplicamos por un factor mayor para dar más espacio
        const estimatedHeight = Math.max(lines * 18, 20);
        maxHeight = Math.max(maxHeight, estimatedHeight);
    });

    // Añadimos un pequeño margen adicional
    return maxHeight + 5;
}

builder.objectType(DownloadTaskPhotosResultPothosRef, {
    fields: (t) => ({
        success: t.boolean({ resolve: (parent) => parent.success }),
        url: t.string({
            nullable: true,
            resolve: (parent) => parent.url,
        }),
        message: t.string({
            nullable: true,
            resolve: (parent) => parent.message,
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
                const taskNumber = await generateTaskNumber();

                // Obtener nombres completos de los técnicos asignados para inicializar participantes
                let participantNames: string[] = [];
                let assignedUserIds: string[] = []; // Store assigned user IDs for notification

                if (input.assigned && input.assigned.length > 0) {
                    assignedUserIds = [...input.assigned]; // Save IDs for notifications
                    const assignedUsers = await prisma.user.findMany({
                        where: {
                            id: {
                                in: input.assigned,
                            },
                            deleted: false,
                        },
                        select: {
                            fullName: true,
                        },
                    });

                    participantNames = assignedUsers.map((user) => user.fullName);
                }

                const task = await prisma.task.create({
                    data: {
                        taskNumber,
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
                        participants: {
                            set: participantNames, // Inicializar con nombres de asignados
                        },
                        movitecTicket: input.movitecTicket,
                        serviceOrderId: input.serviceOrderId,
                    },
                });

                const taskForNotification = await prisma.task.findUnique({
                    where: { id: task.id },
                    select: {
                        branch: {
                            select: {
                                client: true,
                                name: true,
                                number: true,
                            },
                        },
                        clientName: true,
                        taskNumber: true,
                        description: true,
                        id: true,
                    },
                });

                const clientName =
                    taskForNotification?.branch?.client?.name ??
                    taskForNotification?.clientName;
                const branchIdentifier = `${
                    taskForNotification?.branch?.number
                        ? `#${taskForNotification?.branch?.number}`
                        : ''
                }${
                    taskForNotification?.branch?.name
                        ? ` - ${taskForNotification?.branch?.name}`
                        : ''
                }`;
                // Enviar notificación push si hay usuarios asignados
                if (assignedUserIds.length > 0) {
                    await sendPushNotification(assignedUserIds, {
                        title: `Nueva Tarea Asignada! ${
                            taskForNotification?.branch
                                ? `En ${branchIdentifier} de`
                                : 'Para'
                        } ${clientName}`,
                        body: `Se te ha asignado la tarea N° ${task.taskNumber}: ${task.description}`,
                        data: {
                            taskId: task.id,
                            taskNumber: task.taskNumber,
                            type: 'NEW_TASK_ASSIGNED', // Tipo de notificación para el cliente móvil
                        },
                    });
                }

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
        resolve: async (root, args, { user }) => {
            try {
                const { input } = args;

                // Generar número de tarea
                const taskNumber = await generateTaskNumber();

                // Procesar participantes
                const initialAssignedIDs = input.assigned ? [...input.assigned] : [];
                if (!initialAssignedIDs.includes(user.id)) {
                    initialAssignedIDs.push(user.id);
                }

                // Usar processParticipantsAndAssigned para manejar participantes
                const { updatedAssignedIDs, participantNames } =
                    await processParticipantsAndAssigned(
                        input.participants || [],
                        initialAssignedIDs,
                        user.id,
                    );

                // Crear la tarea
                const task: Task = await prisma.task.create({
                    data: {
                        taskNumber,
                        actNumber: Number(input.actNumber),
                        branchId: input.branch ?? undefined,
                        businessId: input.business ?? undefined,
                        clientName: input.clientName ?? undefined,
                        businessName: input.businessName ?? undefined,
                        description: `Tarea creada por ${user.fullName} desde APK`,
                        useMaterials: input.useMaterials,
                        observations: input.observations,
                        status: TaskStatus.Pendiente,
                        taskType: input.taskType,
                        assignedIDs: {
                            set: updatedAssignedIDs,
                        },
                        participants: {
                            set: participantNames,
                        },
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
                                          // Procesar imágenes del gasto
                                          const imageCreations = expenseData.imageKeys
                                              ? await Promise.all(
                                                    expenseData.imageKeys.map(
                                                        async (imageKey) => {
                                                            return {
                                                                ...(await createImageSignedUrlAsync(
                                                                    imageKey,
                                                                )),
                                                                key: imageKey,
                                                            };
                                                        },
                                                    ),
                                                )
                                              : [];

                                          // Procesar archivos del gasto
                                          const fileCreations = [];
                                          if (
                                              expenseData.fileKeys &&
                                              expenseData.fileKeys.length > 0
                                          ) {
                                              for (
                                                  let i = 0;
                                                  i < expenseData.fileKeys.length;
                                                  i++
                                              ) {
                                                  const fileKey = expenseData.fileKeys[i];
                                                  const mimeType =
                                                      expenseData.mimeTypes?.[i] ||
                                                      'application/octet-stream';
                                                  const filename =
                                                      expenseData.filenames?.[i] ||
                                                      'file';
                                                  const size =
                                                      expenseData.sizes?.[i] || 0;

                                                  fileCreations.push({
                                                      ...(await getFileSignedUrl(
                                                          fileKey,
                                                          mimeType,
                                                      )),
                                                      key: fileKey,
                                                      filename,
                                                      mimeType,
                                                      size,
                                                  });
                                              }
                                          }

                                          return {
                                              expenseNumber: `${taskNumber}-${index + 1}`,
                                              amount: expenseData.amount,
                                              expenseType: expenseData.expenseType,
                                              paySource: expenseData.paySource,
                                              paySourceBank: expenseData.paySourceBank,
                                              installments: expenseData.installments,
                                              expenseDate: expenseData.expenseDate,
                                              observations: expenseData.observations,
                                              doneBy: expenseData.doneBy,
                                              invoiceType: expenseData.invoiceType,
                                              status: ExpenseStatus.Enviado,
                                              cityName: expenseData.cityName,
                                              registeredBy: {
                                                  connect: { id: user.id },
                                              },
                                              images: {
                                                  create: imageCreations,
                                              },
                                              files: {
                                                  create: fileCreations,
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
        resolve: async (root, args, _context, _info) => {
            try {
                const { id, input } = args;
                const foundTask = await prisma.task.findUniqueUndeleted({
                    where: {
                        id,
                    },
                    select: {
                        status: true,
                        auditorId: true,
                        participants: true,
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

                let participantNames: string[] = [];
                if (input.assigned && input.assigned.length > 0) {
                    const assignedUsers = await prisma.user.findMany({
                        where: {
                            id: {
                                in: input.assigned,
                            },
                            deleted: false,
                        },
                        select: {
                            fullName: true,
                        },
                    });

                    participantNames = Array.from(
                        new Set([
                            ...assignedUsers.map((user) => user.fullName),
                            ...foundTask.participants,
                        ]),
                    );
                }

                const data = {
                    participants: {
                        set: participantNames,
                    },
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
                        preventiveId: true,
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

                if (status === TaskStatus.Aprobada && task.preventiveId) {
                    await prisma.preventive.update({
                        where: { id: task.preventiveId },
                        data: {
                            status: PreventiveStatus.AlDia,
                            lastDoneAt: task.closedAt,
                        },
                    });
                }

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

                // Buscar la tarea con sus imágenes
                const task = await prisma.task.findUniqueUndeleted({
                    where: { id },
                    include: {
                        images: true,
                        expenses: {
                            include: {
                                images: true,
                                files: true,
                            },
                        },
                    },
                });

                if (!task) {
                    return {
                        message: 'La tarea no existe',
                        success: false,
                    };
                }

                // Eliminar todos los gastos y sus adjuntos
                for (const expense of task.expenses) {
                    // Eliminar imágenes de gastos
                    if (expense.images && expense.images.length > 0) {
                        await Promise.all(
                            expense.images.map((image) =>
                                prisma.image.softDeleteOne({ id: image.id }),
                            ),
                        );
                    }

                    // Eliminar archivos de gastos
                    if (expense.files && expense.files.length > 0) {
                        await Promise.all(
                            expense.files.map((file) =>
                                prisma.file.softDeleteOne({ id: file.id }),
                            ),
                        );
                    }

                    // Eliminar el gasto
                    await prisma.expense.softDeleteOne({ id: expense.id });
                }

                // Eliminar imágenes de la tarea
                if (task.images && task.images.length > 0) {
                    await Promise.all(
                        task.images.map((image) =>
                            prisma.image.softDeleteOne({ id: image.id }),
                        ),
                    );
                }

                // Finalmente eliminar la tarea
                const deletedTask = await prisma.task.softDeleteOne({ id });

                return {
                    success: true,
                    task: deletedTask,
                };
            } catch (error) {
                console.error('Error al eliminar la tarea:', error);
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
                        participants,
                        useMaterials,
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
                        taskNumber: true,
                        participants: true,
                        assignedIDs: true,
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
                    for (const expenseId of expenseIdsToDelete) {
                        const expense = await prisma.expense.findUnique({
                            where: { id: expenseId },
                            include: {
                                images: true,
                                files: true,
                            },
                        });

                        if (!expense) {
                            return {
                                message: 'El gasto no existe',
                                success: false,
                            };
                        }

                        // Eliminar imágenes asociadas
                        if (expense.images && expense.images.length > 0) {
                            await Promise.all(
                                expense.images.map((image) =>
                                    prisma.image.softDeleteOne({ id: image.id }),
                                ),
                            );
                        }

                        // Eliminar archivos asociados
                        if (expense.files && expense.files.length > 0) {
                            await Promise.all(
                                expense.files.map((file) =>
                                    prisma.file.softDeleteOne({ id: file.id }),
                                ),
                            );
                        }

                        // Eliminar el gasto
                        await prisma.expense.softDeleteOne({ id: expenseId });
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
                const { updatedAssignedIDs, participantNames } =
                    await processParticipantsAndAssigned(
                        participants ?? [],
                        foundTask.assignedIDs,
                        user.id,
                    );
                const newImages = imageKeys
                    ? await Promise.all(
                          imageKeys.map(async (key) => {
                              return {
                                  ...(await createImageSignedUrlAsync(key)),
                                  key,
                              };
                          }),
                      )
                    : [];
                const newExpenses = expenses
                    ? await Promise.all(
                          expenses.map(async (expenseData, index) => {
                              // Procesar imágenes del gasto
                              const imageCreations = expenseData.imageKeys
                                  ? await Promise.all(
                                        expenseData.imageKeys.map(async (imageKey) => {
                                            return {
                                                ...(await createImageSignedUrlAsync(
                                                    imageKey,
                                                )),
                                                key: imageKey,
                                            };
                                        }),
                                    )
                                  : [];

                              // Procesar archivos del gasto
                              const fileCreations = [];
                              if (
                                  expenseData.fileKeys &&
                                  expenseData.fileKeys.length > 0
                              ) {
                                  for (let i = 0; i < expenseData.fileKeys.length; i++) {
                                      const fileKey = expenseData.fileKeys[i];
                                      const mimeType =
                                          expenseData.mimeTypes?.[i] ||
                                          'application/octet-stream';
                                      const filename =
                                          expenseData.filenames?.[i] || 'file';
                                      const size = expenseData.sizes?.[i] || 0;

                                      fileCreations.push({
                                          ...(await getFileSignedUrl(fileKey, mimeType)),
                                          key: fileKey,
                                          filename,
                                          mimeType,
                                          size,
                                      });
                                  }
                              }

                              return {
                                  expenseNumber: `${foundTask.taskNumber}-${index + 1}`,
                                  amount: expenseData.amount,
                                  expenseType: expenseData.expenseType,
                                  paySource: expenseData.paySource,
                                  paySourceBank: expenseData.paySourceBank,
                                  installments: expenseData.installments,
                                  expenseDate: expenseData.expenseDate,
                                  observations: expenseData.observations,
                                  doneBy: expenseData.doneBy,
                                  invoiceType: expenseData.invoiceType,
                                  status: ExpenseStatus.Enviado,
                                  cityName: expenseData.cityName,
                                  registeredBy: {
                                      connect: { id: user.id },
                                  },
                                  images: {
                                      create: imageCreations,
                                  },
                                  files: {
                                      create: fileCreations,
                                  },
                              };
                          }),
                      )
                    : [];
                const task = await prisma.task.update({
                    where: {
                        id,
                    },
                    data: {
                        actNumber: actNumber ? Number(actNumber) : undefined,
                        observations,
                        closedAt,
                        startedAt,
                        assignedIDs: {
                            set: updatedAssignedIDs,
                        },
                        participants: {
                            set: participantNames,
                        },
                        images: {
                            create: newImages,
                        },
                        expenses: {
                            create: newExpenses,
                        },
                        useMaterials,
                    },
                });

                return {
                    success: true,
                    task,
                };
            } catch (error) {
                console.error(error);
                return {
                    message: `Error al actualizar la tarea: ${
                        error instanceof Error ? error.message : 'Unknown error'
                    }`,
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
            startDate: t.arg({
                type: 'DateTime',
                required: true,
            }),
            endDate: t.arg({
                type: 'DateTime',
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { startDate, endDate } = args;

                console.log(startDate, endDate);
                if (startDate) {
                    startDate.setHours(0, 0, 0, 0);
                }
                if (endDate) {
                    endDate.setHours(23, 59, 59, 999);
                }

                // Construir la cláusula where
                const whereClause = {
                    deleted: false,
                    status: TaskStatus.Aprobada, // Solo tareas aprobadas
                    closedAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                };

                // Obtener las tareas con sus relaciones
                const tasks = await prisma.task.findMany({
                    where: whereClause,
                    include: {
                        branch: {
                            include: {
                                client: true,
                                city: true,
                            },
                        },
                        business: true,
                        expenses: {
                            where: {
                                deleted: false,
                            },
                        },
                    },
                    orderBy: {
                        taskNumber: 'asc',
                    },
                });

                if (tasks.length === 0) {
                    throw new Error(
                        'No se encontraron tareas con los filtros proporcionados',
                    );
                }

                // Crear el libro de Excel
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Reporte de Tareas');

                // Definir las columnas en el orden especificado
                worksheet.columns = [
                    {
                        header: 'Número de Tarea',
                        key: 'taskNumber',
                        width: 15,
                    },
                    {
                        header: 'Empresa',
                        key: 'business',
                        width: 20,
                    },
                    {
                        header: 'Fecha de Inicio',
                        key: 'startDate',
                        width: 15,
                    },
                    {
                        header: 'Hora de Inicio',
                        key: 'startTime',
                        width: 15,
                    },
                    {
                        header: 'Fecha de Cierre',
                        key: 'closeDate',
                        width: 15,
                    },
                    {
                        header: 'Hora de Cierre',
                        key: 'closeTime',
                        width: 15,
                    },
                    {
                        header: 'Número de Acta',
                        key: 'actNumber',
                        width: 15,
                    },
                    {
                        header: 'Cliente',
                        key: 'client',
                        width: 20,
                    },
                    {
                        header: 'Sucursal',
                        key: 'branch',
                        width: 20,
                    },
                    {
                        header: 'Localidad',
                        key: 'city',
                        width: 20,
                    },
                    {
                        header: 'Tipo',
                        key: 'taskType',
                        width: 15,
                    },
                    {
                        header: 'Descripción',
                        key: 'description',
                        width: 40,
                    },
                    {
                        header: 'Técnicos Participantes',
                        key: 'participants',
                        width: 35,
                    },
                    {
                        header: 'Gastos Totales',
                        key: 'totalExpenses',
                        width: 15,
                    },
                    {
                        header: 'Cantidad de Gastos',
                        key: 'expenseCount',
                        width: 15,
                    },
                    {
                        header: 'Observaciones',
                        key: 'observations',
                        width: 40,
                    },
                    {
                        header: 'Anotaciones',
                        key: 'administrativeNotes',
                        width: 40,
                        style: { alignment: { wrapText: true } },
                    },
                    {
                        header: 'Archivos Adjuntos',
                        key: 'hasAttachments',
                        width: 15,
                    },
                ];

                // Estilo para el encabezado
                worksheet.getRow(1).font = { bold: true };
                worksheet.getRow(1).alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                };

                // Agregar los datos de las tareas
                tasks.forEach((task) => {
                    // Calcular gastos totales
                    const totalExpenses = task.expenses.reduce(
                        (sum, expense) => sum + (expense.amount || 0),
                        0,
                    );

                    // Formatear fechas y horas
                    const startDate = task.startedAt
                        ? format(task.startedAt, 'dd/MM/yyyy')
                        : '';
                    const startTime = task.startedAt
                        ? format(task.startedAt, 'HH:mm')
                        : '';
                    const closeDate = task.closedAt
                        ? format(task.closedAt, 'dd/MM/yyyy')
                        : '';
                    const closeTime = task.closedAt ? format(task.closedAt, 'HH:mm') : '';

                    // Obtener nombre de empresa
                    const businessName = task.business?.name || task.businessName || '';

                    // Obtener nombre de cliente y sucursal
                    const clientName = task.branch?.client?.name || task.clientName || '';
                    const branchName = task.branch ? `#${task.branch.number}` : '';

                    // Agregar fila con los datos
                    worksheet.addRow({
                        taskNumber: `#${task.taskNumber}`,
                        business: businessName,
                        startDate,
                        startTime,
                        closeDate,
                        closeTime,
                        actNumber: task.actNumber || '',
                        client: clientName,
                        branch: branchName,
                        city: task.branch?.city?.name || '',
                        taskType: task.taskType,
                        description: task.description,
                        participants: (task.participants || []).join('\n'),
                        totalExpenses: totalExpenses.toLocaleString('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                        }),
                        expenseCount: task.expenses.length,
                        observations: task.observations || '',
                        administrativeNotes: task.administrativeNotes || '',
                        hasAttachments:
                            task.attachmentFiles && task.attachmentFiles.length > 0
                                ? 'Sí'
                                : 'No',
                    });
                });

                // Ajustar altura de filas para contenido multilínea
                worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                    if (rowNumber > 1) {
                        // Omitir la fila de encabezado
                        // Configurar ajuste de texto para toda la fila
                        row.eachCell((cell) => {
                            cell.alignment = {
                                wrapText: true,
                                vertical: 'top',
                            };
                        });

                        const maxHeight = calculateMaxRowHeight(row, worksheet);
                        row.height = maxHeight;
                    }
                });

                // Generar el archivo Excel
                const buffer = await workbook.xlsx.writeBuffer();

                // Subir a S3
                const s3Client = new S3Client({
                    region: process.env.AWS_REGION || 'us-east-1',
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
                    },
                });

                const fileName = `reporte-tareas-${format(
                    new Date(),
                    'yyyy-MM-dd-HH-mm-ss',
                )}.xlsx`;
                const key = `reports/${fileName}`;

                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: key,
                        Body: new Uint8Array(buffer),
                        ContentType:
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    }),
                );

                // Generar URL firmada para descargar el archivo
                const command = new GetObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: key,
                });

                const signedUrl = await getSignedUrl(s3Client, command, {
                    expiresIn: 3600,
                });

                return signedUrl;
            } catch (error) {
                console.error('Error generando reporte de tareas:', error);
                throw new Error(
                    `Error al generar el reporte: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                );
            }
        },
    }),
    finishTask: t.field({
        type: TaskCrudResultPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
        },
        authz: {
            compositeRules: [{ and: ['IsAuthenticated'] }, { or: ['IsTecnico'] }],
        },
        resolve: async (root, args, { user }) => {
            try {
                const { id } = args;

                // Verificar que la tarea existe y que el usuario está asignado a ella
                const task = await prisma.task.findUniqueUndeleted({
                    where: {
                        id,
                        assignedIDs: {
                            has: user.id,
                        },
                    },
                });

                if (!task) {
                    return {
                        message: 'La tarea no existe o no estás asignado a ella',
                        success: false,
                    };
                }
                //Verificar que la tarea tenga fecha de inicio
                if (!task.startedAt) {
                    return {
                        message: 'La tarea no tiene fecha de inicio',
                        success: false,
                    };
                }
                // Verificar que la tarea tiene fecha de cierre
                if (!task.closedAt) {
                    return {
                        message: 'La tarea no tiene fecha de cierre',
                        success: false,
                    };
                }

                if (!task.imagesIDs || task.imagesIDs.length === 0) {
                    return {
                        message: 'La tarea no tiene imágenes',
                        success: false,
                    };
                }

                if (!task.actNumber) {
                    return {
                        message: 'La tarea no tiene número de acta',
                        success: false,
                    };
                }

                // Actualizar la tarea
                const updatedTask = await prisma.task.update({
                    where: { id },
                    data: {
                        status: TaskStatus.Finalizada,
                        // No modificamos assignedIDs ni participants
                    },
                });

                return {
                    success: true,
                    task: updatedTask,
                };
            } catch (error) {
                console.error('Error al finalizar la tarea:', error);
                return {
                    message: `Error al finalizar la tarea: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                    success: false,
                };
            }
        },
    }),
    downloadTaskPhotos: t.field({
        type: DownloadTaskPhotosResultPothosRef,
        args: {
            startDate: t.arg({
                type: 'DateTime',
                required: true,
            }),
            endDate: t.arg({
                type: 'DateTime',
                required: true,
            }),
            businessId: t.arg({
                type: 'String',
                required: false,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { startDate, endDate, businessId } = args;
                if (startDate) {
                    startDate.setHours(0, 0, 0, 0);
                }
                if (endDate) {
                    endDate.setHours(23, 59, 59, 999);
                }
                const business = await prisma.business.findUniqueUndeleted({
                    where: {
                        id: businessId || '',
                    },
                });

                // Buscar las tareas que coincidan con los filtros
                const tasks = await prisma.task.findManyUndeleted({
                    where: {
                        closedAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                        businessId,
                        status: {
                            in: [TaskStatus.Finalizada, TaskStatus.Aprobada],
                        },
                        images: {
                            some: {
                                deleted: false,
                            },
                        },
                    },
                    include: {
                        images: true,
                        business: true,
                    },
                });

                if (tasks.length === 0) {
                    return {
                        success: false,
                        message: `No se encontraron tareas finalizadas o aprobadas con imágenes para la empresa ${business?.name} en el período del ${format(startDate, 'dd/MM/yyyy')} al ${format(endDate, 'dd/MM/yyyy')}`,
                    };
                }

                // Crear un archivo ZIP
                const zip = new JSZip();

                // Configurar el cliente S3
                const s3Client = new S3Client({
                    region: process.env.AWS_REGION,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                    },
                });

                // Descargar y agregar cada imagen al ZIP
                for (const task of tasks) {
                    for (let i = 0; i < task.images.length; i++) {
                        const image = task.images[i];
                        if (image.deleted) {
                            continue;
                        }

                        try {
                            // Obtener la URL firmada para la imagen
                            const command = new GetObjectCommand({
                                Bucket: process.env.AWS_S3_BUCKET_NAME,
                                Key: image.key,
                            });
                            const signedUrl = await getSignedUrl(s3Client, command, {
                                expiresIn: 3600,
                            });

                            // Descargar la imagen
                            const response = await fetch(signedUrl);
                            if (!response.ok) {
                                return {
                                    success: false,
                                    message: `Error al descargar la imagen: ${response.statusText}`,
                                };
                            }
                            const imageBuffer = await response.arrayBuffer();

                            // Crear el nombre del archivo
                            const fileName = `${task.actNumber || ''}_${task.taskNumber}_${task.business?.name || task.businessName}_${i + 1}.jpg`;

                            // Agregar la imagen al ZIP
                            zip.file(fileName, imageBuffer);
                        } catch (error) {
                            console.error(
                                `Error procesando imagen de la tarea ${task.taskNumber}:`,
                                error,
                            );
                            return {
                                success: false,
                                message: `Error al procesar las imágenes de la tarea ${task.taskNumber}: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                            };
                        }
                    }
                }

                try {
                    // Generar el archivo ZIP
                    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

                    // Subir el ZIP a S3
                    const zipKey = `temp/downloads/fotos-tareas-${tasks[0].business?.name}-${format(startDate, 'dd-MM-yyyy')}-${format(endDate, 'dd-MM-yyyy')}.zip`;
                    await s3Client.send(
                        new PutObjectCommand({
                            Bucket: process.env.AWS_S3_BUCKET_NAME,
                            Key: zipKey,
                            Body: zipBuffer,
                            ContentType: 'application/zip',
                        }),
                    );

                    // Generar una URL firmada para el ZIP
                    const zipCommand = new GetObjectCommand({
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: zipKey,
                    });
                    const zipSignedUrl = await getSignedUrl(s3Client, zipCommand, {
                        expiresIn: 3600,
                    });

                    return {
                        success: true,
                        url: zipSignedUrl,
                    };
                } catch (error) {
                    console.error('Error al generar o subir el archivo ZIP:', error);
                    return {
                        success: false,
                        message: `Error al generar el archivo ZIP: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                    };
                }
            } catch (error) {
                console.error('Error en downloadTaskPhotos resolver:', error);
                return {
                    success: false,
                    message: `Error al procesar la solicitud: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                };
            }
        },
    }),

    updateTaskAdministrative: t.field({
        type: TaskCrudResultPothosRef,
        args: {
            id: t.arg.string({ required: true }),
            input: t.arg({
                type: UpdateTaskAdministrativeInput,
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { id, input } = args;

                // Verificar que la tarea existe
                const existingTask = await prisma.task.findUnique({
                    where: { id },
                });

                if (!existingTask) {
                    return {
                        success: false,
                        message: 'Tarea no encontrada',
                    };
                }

                const updateData: any = {};

                // Actualizar anotaciones administrativas si se proporcionan
                if (input.administrativeNotes !== undefined) {
                    updateData.administrativeNotes = input.administrativeNotes;
                }

                // Si hay archivos nuevos, procesarlos
                if (input.fileKeys && input.fileKeys.length > 0) {
                    const attachmentFiles = await Promise.all(
                        input.fileKeys.map(async (key, index) => {
                            // Generar URL presignada para S3
                            const s3Client = new S3Client({
                                region: process.env.AWS_REGION,
                                credentials: {
                                    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                                },
                            });

                            const command = new GetObjectCommand({
                                Bucket: process.env.AWS_S3_BUCKET_NAME,
                                Key: key,
                            });

                            const url = await getSignedUrl(s3Client, command, {
                                expiresIn: 3600, // 1 hora
                            });

                            return {
                                key,
                                filename: input.filenames?.[index] || '',
                                mimeType: input.mimeTypes?.[index] || '',
                                size: input.sizes?.[index] || 0,
                                url,
                                urlExpire: new Date(Date.now() + 3600 * 1000), // 1 hora desde ahora
                            };
                        }),
                    );

                    updateData.attachmentFiles = attachmentFiles;
                }

                // Actualizar la tarea
                const updatedTask = await prisma.task.update({
                    where: { id },
                    data: updateData,
                    include: {
                        assigned: true,
                        auditor: true,
                        createdBy: true,
                        branch: true,
                        business: true,
                        preventive: true,
                        serviceOrder: true,
                        images: {
                            where: { deleted: false },
                        },
                    },
                });

                return {
                    success: true,
                    task: updatedTask,
                    message: 'Anotaciones administrativas actualizadas correctamente',
                };
            } catch (error) {
                console.error('Error updating task administrative:', error);
                return {
                    success: false,
                    message: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                };
            }
        },
    }),

    removeTaskAttachment: t.field({
        type: TaskCrudResultPothosRef,
        args: {
            id: t.arg.string({ required: true }),
            fileKey: t.arg.string({ required: true }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                { or: ['IsAdministrativoContable'] },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { id, fileKey } = args;

                // Obtener la tarea actual para acceder a los archivos adjuntos
                const task = await prisma.task.findUnique({
                    where: { id },
                    select: { attachmentFiles: true },
                });

                if (!task) {
                    return {
                        success: false,
                        message: 'Tarea no encontrada',
                    };
                }

                // Filtrar el archivo a eliminar
                const updatedAttachmentFiles = (task.attachmentFiles as any[]).filter(
                    (file: any) => file.key !== fileKey,
                );

                // Actualizar la base de datos
                const updatedTask = await prisma.task.update({
                    where: { id },
                    data: {
                        attachmentFiles: updatedAttachmentFiles,
                    },
                    include: {
                        assigned: true,
                        auditor: true,
                        createdBy: true,
                        branch: true,
                        business: true,
                        preventive: true,
                        serviceOrder: true,
                        images: { where: { deleted: false } },
                    },
                });

                // Eliminar el archivo de S3
                try {
                    const s3Client = new S3Client({
                        region: process.env.AWS_REGION,
                        credentials: {
                            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                        },
                    });

                    const deleteCommand = new DeleteObjectCommand({
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: fileKey,
                    });

                    await s3Client.send(deleteCommand);
                } catch (s3Error) {
                    // eslint-disable-next-line no-console
                    console.error('Error deleting file from S3:', s3Error);
                    // No fallar la operación si S3 falla, ya que el archivo ya se eliminó de la BD
                }

                return {
                    success: true,
                    task: updatedTask,
                    message: 'Archivo adjunto eliminado correctamente',
                };
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error removing task attachment:', error);
                return {
                    success: false,
                    message: 'Error al eliminar archivo adjunto',
                };
            }
        },
    }),
}));
