import { Task, TaskStatus, TaskType } from '@prisma/client';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';
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
                return prisma.user.findMany({
                    where: {
                        id: {
                            in: root.assignedIDs,
                        },
                        deleted: false,
                    },
                });
            },
        }),
        images: t.relation('images'),
        expenses: t.relation('expense'),
    }),
});
