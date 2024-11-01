import { Task, TaskStatus, TaskType } from '@prisma/client';

import { updateImageSignedUrlAsync } from 'backend/schema/utils';
import { prisma } from 'lib/prisma';

import { builder } from '../../builder';
import { ExpenseInputType, ExpensePothosRef } from '../expense/refs';
import { UserPothosRef } from '../users';

export const TaskTypePothosRef = builder.enumType('TaskType', {
    values: Object.fromEntries(
        Object.entries(TaskType).map(([name, value]) => [name, { value }]),
    ),
});

export const TaskStatusPothosRef = builder.enumType('TaskStatus', {
    values: Object.fromEntries(
        Object.entries(TaskStatus).map(([name, value]) => [name, { value }]),
    ),
});

export const TaskPothosRef = builder.prismaObject('Task', {
    fields: (t) => ({
        id: t.exposeID('id'),
        description: t.exposeString('description'),
        createdAt: t.field({
            type: 'DateTime',
            resolve: (root) => root.createdAt,
        }),
        closedAt: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.closedAt,
        }),
        status: t.field({
            type: TaskStatusPothosRef,
            resolve: (root) => root.status as TaskStatus,
        }),
        taskType: t.field({
            type: TaskTypePothosRef,
            resolve: (root) => root.taskType as TaskType,
        }),
        workOrderNumber: t.exposeInt('workOrderNumber', {
            nullable: true,
        }),
        branch: t.relation('branch'),
        business: t.relation('business'),
        auditor: t.relation('auditor', {
            nullable: true,
        }),
        assigned: t.field({
            type: [UserPothosRef],
            resolve: (root: Task) => {
                return prisma.user.findManyUndeleted({
                    where: {
                        id: {
                            in: root.assignedIDs,
                        },
                        deleted: false,
                    },
                });
            },
        }),
        imagesIDs: t.exposeStringList('imagesIDs'),
        images: t.prismaField({
            type: ['Image'],
            resolve: async (root, parent) => {
                const images = await prisma.image.findManyUndeleted({
                    where: {
                        id: {
                            in: parent.imagesIDs,
                        },
                    },
                });

                await Promise.all(
                    images.map((image) => updateImageSignedUrlAsync(image)),
                );

                return prisma.image.findManyUndeleted({
                    where: {
                        id: {
                            in: parent.imagesIDs,
                        },
                    },
                });
            },
        }),
        expenses: t.relation('expenses', {
            type: ExpensePothosRef,
            resolve: async (root, parent, args, context) => {
                return prisma.expense.findManyUndeleted({
                    where: {
                        taskId: parent.id,
                    },
                });
            },
        }),
        metadata: t.field({
            type: 'JSON',
            resolve: (root) => (root.metadata || {}) as Record<string, any> as any,
        }),
        observations: t.exposeString('observations', {
            nullable: true,
        }),
    }),
});

export const TaskInputPothosRef = builder.inputType('TaskInput', {
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

export const MyTaskInputPothosRef = builder.inputType('MyTaskInput', {
    fields: (t) => ({
        description: t.string({ required: true }),
        taskType: t.field({ type: TaskTypePothosRef, required: true }),
        branch: t.string({ required: true }),
        business: t.string({ required: true }),
        auditor: t.string({ required: false }),
        assigned: t.stringList({ required: false }),
        workOrderNumber: t.string({ required: false }),
        imageKeys: t.stringList({ required: false }),
        observations: t.string({ required: false }),
        closedAt: t.field({ type: 'DateTime', required: false }),
        expenses: t.field({ type: [ExpenseInputType], required: false }),
    }),
});

export const UpdateMyTaskInput = builder.inputType('UpdateMyTaskInput', {
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

export const TaskCrudResultPothosRef = builder
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
