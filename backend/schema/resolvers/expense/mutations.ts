import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ExpenseStatus } from '@prisma/client';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';

import {
    ExpenseCrudResultPothosRef,
    ExpenseInputType,
    ExpenseStatusPothosRef,
} from './refs';

import { createImageSignedUrlAsync, getFileSignedUrl } from 'backend/s3Client';
import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

import { calculateRowHeight } from '../../utils';

function buildWhereClause(filters: any) {
    const whereClause: any = {};

    filters.forEach((filter: { id: string; value: any }) => {
        switch (filter.id) {
            case 'registeredBy':
                whereClause.registeredBy = { id: { in: filter.value } };
                break;
            case 'expenseStatus':
                whereClause.status = { in: filter.value };
                break;
            case 'expenseType':
                whereClause.expenseType = { in: filter.value };
                break;
            case 'paySource':
                whereClause.paySource = { in: filter.value };
                break;
            default:
                break;
        }
    });

    return whereClause;
}

export const ExpenseMutations = builder.mutationFields((t) => ({
    deleteExpense: t.field({
        type: ExpenseCrudResultPothosRef,
        args: {
            id: t.arg.string({
                required: true,
            }),
            taskId: t.arg.string({
                required: true,
            }),
        },
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                {
                    or: ['IsTecnico', 'IsAdministrativoContable', 'IsAuditor'],
                },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { id } = args;

                // Primero obtenemos el gasto con sus relaciones
                const expense = await prisma.expense.findUnique({
                    where: { id },
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

                // Eliminamos las imágenes asociadas
                if (expense.images && expense.images.length > 0) {
                    await Promise.all(
                        expense.images.map((image) =>
                            prisma.image.softDeleteOne({
                                id: image.id,
                            }),
                        ),
                    );
                }

                // Eliminamos los archivos asociados
                if (expense.files && expense.files.length > 0) {
                    await Promise.all(
                        expense.files.map((file) =>
                            prisma.file.softDeleteOne({
                                id: file.id,
                            }),
                        ),
                    );
                }

                // Finalmente eliminamos el gasto
                const deletedExpense = await prisma.expense.softDeleteOne({
                    id,
                });

                return {
                    success: true,
                    expense: deletedExpense,
                };
            } catch (error) {
                console.error('Error al eliminar el gasto:', error);
                return {
                    message: `Error al eliminar el gasto: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                    success: false,
                };
            }
        },
    }),
    createExpense: t.field({
        type: ExpenseCrudResultPothosRef,
        args: {
            taskId: t.arg.string({ required: false }),
            expenseData: t.arg({
                type: ExpenseInputType,
                required: true,
            }),
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
                let expenseNumber = '';

                if (taskId) {
                    // Primero obtener la tarea para conseguir el taskNumber
                    const task = await prisma.task.findUnique({
                        where: { id: taskId },
                        select: { taskNumber: true },
                    });

                    if (!task) {
                        throw new Error('Tarea no encontrada');
                    }

                    // Mejorar la búsqueda del último gasto
                    const lastExpense = await prisma.expense.findFirst({
                        where: {
                            deleted: false,
                            task: { id: taskId },
                            expenseNumber: { startsWith: `${task.taskNumber}-` },
                        },
                        orderBy: [
                            {
                                expenseNumber: 'desc',
                            },
                        ],
                    });

                    // Extraer y validar el último número de secuencia
                    let sequence = 1;
                    if (lastExpense) {
                        const [, sequenceStr] = lastExpense.expenseNumber.split('-');
                        const lastSequence = parseInt(sequenceStr);
                        if (!isNaN(lastSequence)) {
                            sequence = lastSequence + 1;
                        }
                    }

                    // Buscar un número disponible incrementando la secuencia hasta encontrar uno libre
                    let expenseNumberAvailable = false;
                    while (!expenseNumberAvailable) {
                        expenseNumber = `${task.taskNumber}-${sequence}`;
                        const existingExpense = await prisma.expense.findFirst({
                            where: {
                                deleted: false,
                                expenseNumber,
                            },
                        });

                        if (!existingExpense) {
                            expenseNumberAvailable = true;
                        } else {
                            sequence++;
                        }
                    }
                } else {
                    // Mejorar la lógica para gastos sin tarea
                    const lastExpense = await prisma.expense.findFirst({
                        where: {
                            deleted: false,
                            task: null,
                            expenseNumber: {
                                not: { contains: '-' }, // Solo gastos individuales
                            },
                        },
                        orderBy: {
                            createdAt: 'desc', // Ordenar por fecha de creación
                        },
                        take: 1,
                    });

                    // Convertir el último número a entero y sumar 1
                    const nextNumber = lastExpense
                        ? parseInt(lastExpense.expenseNumber) + 1
                        : 1;

                    // Verificar que el número no exista
                    let numberAvailable = false;
                    let currentNumber = nextNumber;

                    while (!numberAvailable) {
                        const existingExpense = await prisma.expense.findFirst({
                            where: {
                                deleted: false,
                                task: null,
                                expenseNumber: currentNumber.toString(),
                            },
                        });

                        if (!existingExpense) {
                            numberAvailable = true;
                            expenseNumber = currentNumber.toString();
                        } else {
                            currentNumber++;
                        }
                    }
                }

                // Validar que se proporcione al menos una imagen o archivo
                if (
                    (!expenseData.imageKeys || expenseData.imageKeys.length === 0) &&
                    (!expenseData.fileKeys || expenseData.fileKeys.length === 0)
                ) {
                    return {
                        success: false,
                        message: 'Se debe proporcionar al menos una imagen o un archivo',
                    };
                }

                // Limitar a 5 adjuntos en total
                const totalAttachments =
                    (expenseData.imageKeys?.length || 0) +
                    (expenseData.fileKeys?.length || 0);

                if (totalAttachments > 5) {
                    return {
                        success: false,
                        message: 'No se pueden adjuntar más de 5 archivos en total',
                    };
                }

                // Crear arrays para las conexiones de imágenes y archivos
                const imageConnections = [];
                const fileConnections = [];

                // Procesar imágenes si existen
                if (expenseData.imageKeys && expenseData.imageKeys.length > 0) {
                    for (const imageKey of expenseData.imageKeys) {
                        const imageData = await createImageSignedUrlAsync(imageKey);
                        imageConnections.push({
                            ...imageData,
                            key: imageKey,
                        });
                    }
                }

                // Procesar archivos si existen
                if (expenseData.fileKeys && expenseData.fileKeys.length > 0) {
                    for (let i = 0; i < expenseData.fileKeys.length; i++) {
                        const fileKey = expenseData.fileKeys[i];
                        const mimeType =
                            expenseData.mimeTypes?.[i] || 'application/octet-stream';
                        const filename = expenseData.filenames?.[i] || 'file';
                        const size = expenseData.sizes?.[i] || 0;

                        const fileData = await getFileSignedUrl(fileKey, mimeType);
                        fileConnections.push({
                            ...fileData,
                            key: fileKey,
                            filename,
                            mimeType,
                            size,
                        });
                    }
                }

                // Crear el gasto con las conexiones de imágenes y archivos
                const newExpense = await prisma.expense.create({
                    data: {
                        expenseNumber,
                        amount: parseFloat(String(expenseData.amount)),
                        expenseType: expenseData.expenseType,
                        cityName: expenseData.cityName,
                        paySource: expenseData.paySource,
                        doneBy: expenseData.doneBy,
                        paySourceBank: expenseData.paySourceBank,
                        installments: expenseData.installments,
                        expenseDate: expenseData.expenseDate,
                        observations: expenseData.observations,
                        status: ExpenseStatus.Enviado,
                        registeredBy: { connect: { id: _context.user.id } },
                        ...(taskId && { task: { connect: { id: taskId } } }),
                        ...(imageConnections.length > 0 && {
                            images: {
                                create: imageConnections,
                            },
                        }),
                        ...(fileConnections.length > 0 && {
                            files: {
                                create: fileConnections,
                            },
                        }),
                    },
                });

                return {
                    success: true,
                    expense: newExpense,
                };
            } catch (error) {
                console.error(error);
                return {
                    success: false,
                    message: `Error al crear el gasto: ${
                        error instanceof Error ? error.message : 'Error desconocido'
                    }`,
                };
            }
        },
    }),
    updateExpenseStatus: t.field({
        type: ExpenseCrudResultPothosRef,
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
                    or: ['IsAdministrativoContable'],
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
                        task: true,
                    },
                });

                if (!foundExpense) {
                    return {
                        message: 'El gasto no existe',
                        success: false,
                    };
                }

                const newExpense = await prisma.expense.update({
                    where: {
                        id: expenseId,
                    },
                    data: {
                        status,
                    },
                });

                return {
                    success: true,
                    expense: newExpense,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al actualizar el estado del gasto: ${error}`,
                };
            }
        },
    }),
    generateApprovedExpensesReport: t.field({
        type: 'String',
        args: {
            startDate: t.arg.string({ required: true }),
            endDate: t.arg.string({ required: true }),
            filters: t.arg({
                type: 'JSON',
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
                    deleted: false,
                    expenseDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                    ...(filters && buildWhereClause(filters)),
                };

                const expenses = await prisma.expense.findMany({
                    where: whereClause,
                    include: {
                        registeredBy: true,
                        task: true,
                    },
                    orderBy: {
                        expenseDate: 'desc',
                    },
                });

                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Reporte de Gastos');

                worksheet.properties.defaultRowHeight = 20;

                worksheet.columns = [
                    {
                        header: 'Número de gasto',
                        key: 'expenseNumber',
                        width: 15,
                    },
                    {
                        header: 'Localidad',
                        key: 'cityName',
                        width: 15,
                    },
                    {
                        header: 'Fecha',
                        key: 'expenseDate',
                        width: 15,
                    },
                    {
                        header: 'Tipo',
                        key: 'expenseType',
                        width: 20,
                    },
                    {
                        header: 'Observaciones',
                        key: 'observations',
                        width: 40,
                        style: { alignment: { wrapText: true } },
                    },
                    {
                        header: 'Monto',
                        key: 'amount',
                        width: 15,
                    },
                    {
                        header: 'Realizado por',
                        key: 'doneBy',
                        width: 25,
                    },
                    {
                        header: 'Fuente de pago',
                        key: 'paySource',
                        width: 20,
                    },
                    {
                        header: 'Cantidad de cuotas',
                        key: 'installments',
                        width: 15,
                    },
                    {
                        header: 'Valor de cuota',
                        key: 'installmentValue',
                        width: 15,
                    },
                    {
                        header: 'Factura recibida',
                        key: 'status',
                        width: 15,
                    },
                ];

                expenses.forEach((expense, index) => {
                    // Calcular el valor de la cuota si corresponde
                    let installmentValue = null;
                    // Usar discountAmount si existe, de lo contrario usar amount
                    const finalAmount =
                        expense.discountAmount !== null
                            ? expense.discountAmount
                            : expense.amount;

                    if (
                        expense.paySource === 'Credito' &&
                        expense.installments &&
                        expense.installments > 0
                    ) {
                        installmentValue = finalAmount / expense.installments;
                    }

                    // Mapear el estado según las especificaciones
                    let statusText;
                    switch (expense.status) {
                        case ExpenseStatus.Enviado:
                            statusText = 'Pendiente';
                            break;
                        case ExpenseStatus.Aprobado:
                            statusText = 'OK';
                            break;
                        case ExpenseStatus.Rechazado:
                            statusText = 'Rechazado';
                            break;
                        default:
                            statusText = expense.status;
                    }

                    worksheet.addRow({
                        expenseNumber: `#${expense.expenseNumber}`,
                        cityName: expense.cityName ?? '-',
                        expenseDate: format(
                            new Date(expense.expenseDate ?? ''),
                            'dd/MM/yyyy',
                        ),
                        expenseType: expense.expenseType,
                        observations: expense.observations || '-',
                        amount: finalAmount.toLocaleString('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                        }),
                        doneBy: expense.doneBy,
                        paySource: expense.paySource,
                        installments: expense.installments || '-',
                        installmentValue: installmentValue
                            ? installmentValue.toLocaleString('es-AR', {
                                  style: 'currency',
                                  currency: 'ARS',
                              })
                            : '-',
                        status: statusText,
                    });

                    const row = worksheet.getRow(index + 2);
                    const observationsHeight = calculateRowHeight(
                        expense.observations || '',
                        40,
                    );
                    row.height = observationsHeight;
                    row.alignment = { wrapText: true };
                });

                worksheet.getRow(1).height = 30;
                worksheet.getRow(1).font = { bold: true };
                worksheet.getRow(1).alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true,
                };

                const buffer = await workbook.xlsx.writeBuffer();

                const s3Client = new S3Client({
                    region: process.env.AWS_REGION,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                    },
                });

                const fileName = `reporte-gastos-${format(
                    new Date(),
                    'yyyy-MM-dd-HH-mm-ss',
                )}.xlsx`;

                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: `reports/${fileName}`,
                        Body: new Uint8Array(buffer),
                        ContentType:
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    }),
                );

                const getCommand = new GetObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: `reports/${fileName}`,
                });

                return await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
            } catch (error) {
                console.error('Error generating expenses report:', error);
                throw new Error('Error al generar el reporte de gastos');
            }
        },
    }),
    updateExpenseDiscountAmount: t.field({
        type: ExpenseCrudResultPothosRef,
        args: {
            expenseId: t.arg.string({
                required: true,
            }),
            discountAmount: t.arg.float({
                required: false,
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
        resolve: async (root, args) => {
            try {
                const { expenseId, discountAmount } = args;
                const foundExpense = await prisma.expense.findUniqueUndeleted({
                    where: {
                        id: expenseId,
                    },
                });

                if (!foundExpense) {
                    return {
                        message: 'El gasto no existe',
                        success: false,
                    };
                }

                const updatedExpense = await prisma.expense.update({
                    where: {
                        id: expenseId,
                    },
                    data: {
                        discountAmount,
                    },
                });

                return {
                    success: true,
                    expense: updatedExpense,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Error al actualizar el monto con descuento: ${error}`,
                };
            }
        },
    }),
}));
