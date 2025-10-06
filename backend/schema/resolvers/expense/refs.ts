import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
    ExpenseStatus,
    ExpenseType,
    ExpensePaySource,
    Expense,
    ExpensePaySourceBank,
    ExpenseInvoiceType,
} from '@prisma/client';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';
import { FileRef } from '../file/refs';
export const AttachmentFileRef = builder
    .objectRef<{
        key: string;
        filename: string;
        mimeType: string;
        size: number;
        url: string;
        urlExpire: Date | null;
    }>('AttachmentFile')
    .implement({
        fields: (t) => ({
            key: t.exposeString('key'),
            filename: t.exposeString('filename'),
            mimeType: t.exposeString('mimeType'),
            size: t.exposeInt('size'),
            url: t.exposeString('url'),
            urlExpire: t.expose('urlExpire', {
                type: 'DateTime',
                nullable: true,
            }),
        }),
    });
import { ImagePothosRef } from '../image';

export const ExpenseTypePothosRef = builder.enumType('ExpenseType', {
    values: Object.fromEntries(
        Object.entries(ExpenseType).map(([name, value]) => [name, { value }]),
    ),
});

export const ExpenseStatusPothosRef = builder.enumType('ExpenseStatus', {
    values: Object.fromEntries(
        Object.entries(ExpenseStatus).map(([name, value]) => [name, { value }]),
    ),
});

export const ExpensePaySourcePothosRef = builder.enumType('ExpensePaySource', {
    values: Object.fromEntries(
        Object.entries(ExpensePaySource).map(([name, value]) => [name, { value }]),
    ),
});

export const ExpensePaySourceBankPothosRef = builder.enumType('ExpensePaySourceBank', {
    values: Object.fromEntries(
        Object.entries(ExpensePaySourceBank).map(([name, value]) => [name, { value }]),
    ),
});

export const ExpenseInvoiceTypePothosRef = builder.enumType('ExpenseInvoiceType', {
    values: Object.fromEntries(
        Object.entries(ExpenseInvoiceType).map(([name, value]) => [name, { value }]),
    ),
});

export const ExpenseInputType = builder.inputType('ExpenseInput', {
    fields: (t) => ({
        amount: t.float({ required: true }),
        expenseType: t.field({
            type: ExpenseTypePothosRef,
            required: true,
        }),
        paySource: t.field({
            type: ExpensePaySourcePothosRef,
            required: true,
        }),
        paySourceBank: t.field({
            type: ExpensePaySourceBankPothosRef,
            required: false,
        }),
        invoiceType: t.field({
            type: ExpenseInvoiceTypePothosRef,
            required: true,
        }),
        installments: t.int({ required: true }),
        expenseDate: t.field({
            type: 'DateTime',
            required: false,
        }),
        observations: t.string(),
        doneBy: t.string({ required: true }),
        imageKeys: t.stringList({ required: false }),
        fileKeys: t.stringList({ required: false }),
        filenames: t.stringList({ required: false }),
        mimeTypes: t.stringList({ required: false }),
        sizes: t.intList({ required: false }),
        cityName: t.string({ required: true }),
    }),
});

export const ExpensePothosRef = builder.prismaObject('Expense', {
    name: 'Expense',
    fields: (t) => ({
        id: t.exposeID('id'),
        expenseNumber: t.exposeString('expenseNumber', { nullable: false }),
        createdAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.createdAt,
        }),
        expenseDate: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.expenseDate,
        }),
        amount: t.exposeFloat('amount'),
        discountAmount: t.exposeFloat('discountAmount', {
            nullable: true,
        }),
        expenseType: t.field({
            type: ExpenseTypePothosRef,
            resolve: (root) => root.expenseType as ExpenseType,
        }),
        paySource: t.field({
            type: ExpensePaySourcePothosRef,
            resolve: (root) => root.paySource as ExpensePaySource,
        }),
        paySourceBank: t.field({
            nullable: true,
            type: ExpensePaySourceBankPothosRef,
            resolve: (root) => root.paySourceBank as ExpensePaySourceBank,
        }),
        invoiceType: t.field({
            type: ExpenseInvoiceTypePothosRef,
            resolve: (root) => root.invoiceType as ExpenseInvoiceType,
        }),
        installments: t.exposeInt('installments', {
            nullable: true,
        }),
        status: t.field({
            type: ExpenseStatusPothosRef,
            resolve: (root) => root.status as ExpenseStatus,
        }),
        auditor: t.relation('auditor', {
            nullable: true,
        }),
        cityName: t.exposeString('cityName', { nullable: true }),
        images: t.field({
            type: [ImagePothosRef],
            resolve: async (expense) => {
                const images = await prisma.image.findMany({
                    where: {
                        expenseIDs: { has: expense.id },
                        deleted: false,
                    },
                });
                return images;
            },
        }),
        files: t.field({
            type: [FileRef],
            resolve: async (expense) => {
                const files = await prisma.file.findMany({
                    where: {
                        expenseIDs: { has: expense.id },
                        deleted: false,
                    },
                });
                return files;
            },
        }),
        attachmentFiles: t.field({
            type: [AttachmentFileRef],
            resolve: async (root) => {
                if (!root.attachmentFiles || root.attachmentFiles.length === 0) {
                    return [];
                }

                // Regenerar URLs si han expirado
                const s3Client = new S3Client({
                    region: process.env.AWS_REGION,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                    },
                });

                return Promise.all(
                    root.attachmentFiles.map(async (file: any) => {
                        const now = new Date();
                        const urlExpire = file.urlExpire
                            ? new Date(file.urlExpire)
                            : null;

                        // Si la URL ha expirado o no existe, generar una nueva
                        if (!urlExpire || urlExpire <= now) {
                            const command = new GetObjectCommand({
                                Bucket: process.env.AWS_S3_BUCKET_NAME,
                                Key: file.key,
                            });

                            const url = await getSignedUrl(s3Client, command, {
                                expiresIn: 3600, // 1 hora
                            });

                            return {
                                ...file,
                                url,
                                urlExpire: new Date(Date.now() + 3600 * 1000),
                            };
                        }

                        return file;
                    }),
                );
            },
        }),
        registeredBy: t.relation('registeredBy'),
        doneBy: t.exposeString('doneBy'),
        observations: t.exposeString('observations', {
            nullable: true,
        }),
        administrativeNotes: t.exposeString('administrativeNotes', {
            nullable: true,
        }),
        task: t.relation('task', { nullable: true }),
    }),
});

export const UpdateExpenseAdministrativeInput = builder.inputType(
    'UpdateExpenseAdministrativeInput',
    {
        fields: (t) => ({
            administrativeNotes: t.string({ required: false }),
            fileKeys: t.stringList({ required: false }),
            filenames: t.stringList({ required: false }),
            mimeTypes: t.stringList({ required: false }),
            sizes: t.intList({ required: false }),
        }),
    },
);

export const ExpenseCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        expense?: Expense;
    }>('ExpenseCrudResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            expense: t.field({
                type: ExpensePothosRef,
                nullable: true,
                resolve: (result) => result.expense,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
        }),
    });
