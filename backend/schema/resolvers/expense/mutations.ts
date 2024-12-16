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

import { createImageSignedUrlAsync } from 'backend/s3Client';
import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

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
                    or: ['IsTecnico', 'IsAdministrativoTecnico', 'IsAuditor'],
                },
            ],
        },
        resolve: async (root, args, _context, _info) => {
            try {
                const { id } = args;

                const expense = await prisma.expense.softDeleteOne({
                    id,
                });

                if (!expense) {
                    return {
                        message: 'El gasto no existe',
                        success: false,
                    };
                }
                const image = await prisma.image.softDeleteOne({
                    id: expense.imageId,
                });

                if (!image) {
                    return {
                        message: 'El gasto no poseia una foto',
                        success: false,
                    };
                }

                return {
                    success: true,
                    expense,
                };
            } catch (error) {
                return {
                    message: 'Error al eliminar el gasto',
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
                console.log('creando gastoooo');
                const newExpense = await prisma.expense.create({
                    data: {
                        amount: parseFloat(String(expenseData.amount)),
                        expenseType: expenseData.expenseType,
                        paySource: expenseData.paySource,
                        doneBy: expenseData.doneBy,
                        paySourceBank: expenseData.paySourceBank,
                        installments: expenseData.installments,
                        expenseDate: expenseData.expenseDate,
                        observations: expenseData.observations,
                        status: ExpenseStatus.Enviado,
                        registeredBy: { connect: { id: _context.user.id } },
                        ...(taskId && { task: { connect: { id: taskId } } }),
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
                console.error(error);
                return {
                    success: false,
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
                    status: ExpenseStatus.Aprobado,
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
                const worksheet = workbook.addWorksheet('Gastos Aprobados');

                worksheet.columns = [
                    {
                        header: 'Monto',
                        key: 'amount',
                        width: 15,
                    },
                    {
                        header: 'Tipo',
                        key: 'expenseType',
                        width: 20,
                    },
                    {
                        header: 'Fuente de pago',
                        key: 'paySource',
                        width: 30,
                    },
                    {
                        header: 'Fecha',
                        key: 'expenseDate',
                        width: 15,
                    },
                    {
                        header: 'Registrado por',
                        key: 'registeredBy',
                        width: 25,
                    },
                    {
                        header: 'Pagado por',
                        key: 'doneBy',
                        width: 25,
                    },
                    {
                        header: 'Tarea',
                        key: 'task',
                        width: 15,
                    },
                    {
                        header: 'Observaciones',
                        key: 'observations',
                        width: 40,
                    },
                ];

                expenses.forEach((expense, index) => {
                    let paySourceText = expense.paySource;
                    if (['Credito', 'Debito'].includes(expense.paySource)) {
                        paySourceText += ` - ${expense.paySourceBank}`;
                        if (expense.paySource === 'Credito') {
                            paySourceText += ` (${expense.installments} cuotas)`;
                        }
                    }

                    worksheet.addRow({
                        amount: expense.amount.toLocaleString('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                        }),
                        expenseType: expense.expenseType,
                        paySource: paySourceText,
                        expenseDate: format(
                            new Date(expense.expenseDate ?? ''),
                            'dd/MM/yyyy',
                        ),
                        registeredBy: expense.registeredBy.fullName,
                        doneBy: expense.doneBy,
                        task: expense.task?.id || 'Sin tarea',
                        observations: expense.observations || '-',
                    });

                    worksheet.getRow(index + 2).height = -1;
                });

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

                const fileName = `gastos-aprobados-${format(
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
}));
