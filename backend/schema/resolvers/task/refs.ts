import { Task, TaskStatus, TaskType } from '@prisma/client';

import { updateImageSignedUrlAsync } from 'backend/schema/utils';
import { prisma } from 'lib/prisma';

import { builder } from '../../builder';
import { UserPothosRef } from '../users';
import { ExpensePothosRef } from '../expense';

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
