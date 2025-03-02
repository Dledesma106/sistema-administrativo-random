import { TaskStatus, TaskType } from '@prisma/client';

import { TaskStatusPothosRef, TaskTypePothosRef } from './refs';

import { builder } from 'backend/schema/builder';
import { removeDeleted } from 'backend/schema/utils';
import { prisma } from 'lib/prisma';

builder.queryFields((t) => ({
    tasks: t.prismaField({
        type: ['Task'],
        args: {
            city: t.arg({
                type: ['String'],
                required: false,
            }),
            assigned: t.arg({
                type: ['String'],
                required: false,
            }),
            business: t.arg({
                type: ['String'],
                required: false,
            }),
            client: t.arg({
                type: ['String'],
                required: false,
            }),
            status: t.arg({
                type: [TaskStatusPothosRef],
                required: false,
            }),
            taskType: t.arg({
                type: [TaskTypePothosRef],
                required: false,
            }),
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
        },
        resolve: async (query, _parent, { skip, take, ...filters }) => {
            return removeDeleted(
                await prisma.task.findManyUndeleted({
                    ...query,
                    where: {
                        deleted: false,
                        ...(filters.status?.length && {
                            status: { in: filters.status },
                        }),
                        ...(filters.taskType?.length && {
                            taskType: { in: filters.taskType },
                        }),
                        ...(filters.business?.length && {
                            businessId: { in: filters.business },
                        }),
                        ...(filters.city?.length && {
                            branch: { cityId: { in: filters.city } },
                        }),
                        ...(filters.client?.length && {
                            branch: { clientId: { in: filters.client } },
                        }),
                        ...(filters.assigned?.length && {
                            assignedIDs: { hasSome: filters.assigned },
                        }),
                    },
                    skip: skip || 0,
                    take: take || 10,
                    orderBy: { createdAt: 'desc' },
                }),
            );
        },
    }),
    tasksCount: t.int({
        args: {
            city: t.arg({
                type: ['String'],
                required: false,
            }),
            assigned: t.arg({
                type: ['String'],
                required: false,
            }),
            business: t.arg({
                type: ['String'],
                required: false,
            }),
            client: t.arg({
                type: ['String'],
                required: false,
            }),
            status: t.arg({
                type: [TaskStatusPothosRef],
                required: false,
            }),
            taskType: t.arg({
                type: [TaskTypePothosRef],
                required: false,
            }),
        },
        resolve: async (_parent, filters) => {
            return prisma.task.count({
                where: {
                    deleted: false,
                    ...(filters.status?.length && {
                        status: { in: filters.status },
                    }),
                    ...(filters.taskType?.length && {
                        taskType: { in: filters.taskType },
                    }),
                    ...(filters.business?.length && {
                        businessId: { in: filters.business },
                    }),
                    ...(filters.city?.length && {
                        branch: { cityId: { in: filters.city } },
                    }),
                    ...(filters.client?.length && {
                        branch: { clientId: { in: filters.client } },
                    }),

                    ...(filters.assigned?.length && {
                        assignedIDs: { hasSome: filters.assigned },
                    }),
                },
            });
        },
    }),
    taskById: t.prismaField({
        type: 'Task',
        nullable: true,
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: [
                        'IsAdministrativoTecnico',
                        'IsAuditor',
                        'IsAdministrativoContable',
                    ],
                },
            ],
        },
        args: {
            id: t.arg.string({
                required: true,
            }),
        },
        resolve: async (query, parent, { id }) => {
            return await prisma.task.findUniqueUndeleted({
                where: {
                    id,
                },
            });
        },
    }),
    myAssignedTaskById: t.prismaField({
        type: 'Task',
        nullable: true,
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                {
                    or: ['IsTecnico'],
                },
            ],
        },
        args: {
            id: t.arg.string({
                required: true,
            }),
        },
        resolve: async (query, parent, { id }, { user }) => {
            return await prisma.task.findUniqueUndeleted({
                where: {
                    id,
                    assignedIDs: {
                        has: user.id,
                    },
                },
            });
        },
    }),
    myAssignedTasks: t.prismaField({
        type: ['Task'],
        authz: {
            compositeRules: [
                { and: ['IsAuthenticated'] },
                {
                    or: ['IsTecnico'],
                },
            ],
        },
        resolve: async (query, _parent, _args, { user }) => {
            return await prisma.task.findManyUndeleted({
                where: {
                    assignedIDs: {
                        has: user.id,
                    },
                    status: {
                        not: TaskStatus.SinAsignar,
                    },
                },
            });
        },
    }),
    taskTypes: t.field({
        type: [TaskTypePothosRef],
        resolve: () => {
            return Object.values(TaskType);
        },
    }),
}));
