import { TaskStatus } from '@prisma/client';

import { TaskStatusPothosRef, TaskTypePothosRef } from './refs';

import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';
import { removeDeleted } from 'backend/schema/utils';

builder.queryFields((t) => ({
    tasks: t.prismaField({
        type: ['Task'],
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
            city: t.arg.string({
                required: false,
            }),
            assigneed: t.arg({
                type: ['String'],
                required: false,
            }),
            business: t.arg.string({
                required: false,
            }),
            client: t.arg.string({
                required: false,
            }),
            status: t.arg({
                type: TaskStatusPothosRef,
                required: false,
            }),
            taskType: t.arg({
                type: TaskTypePothosRef,
                required: false,
            }),
        },
        resolve: async (query) => {
            const tasks = await prisma.task.findManyUndeleted({
                orderBy: {
                    createdAt: 'desc',
                },
                ...query,
            });
            const filteredTasks = removeDeleted(tasks);
            return filteredTasks;
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
}));
