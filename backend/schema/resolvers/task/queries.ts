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
            startDate: t.arg({
                type: 'DateTime',
                required: false,
            }),
            endDate: t.arg({
                type: 'DateTime',
                required: false,
            }),
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
            orderBy: t.arg.string({ required: false }),
            orderDirection: t.arg.string({ required: false }),
        },
        resolve: async (
            query,
            _parent,
            { skip, take, orderBy, orderDirection, ...filters },
        ) => {
            const startDate = filters.startDate;
            const endDate = filters.endDate;
            if (startDate) {
                startDate.setHours(0, 0, 0, 0);
            }
            if (endDate) {
                endDate.setHours(23, 59, 59, 999);
            }

            const sortDirection =
                orderDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';

            let orderConfig = {};

            if (orderBy) {
                if (orderBy === 'assigned') {
                    orderConfig = {
                        assigned: {
                            fullName: sortDirection,
                        },
                    };
                } else if (orderBy === 'business') {
                    orderConfig = {
                        business: {
                            name: sortDirection,
                        },
                    };
                } else if (orderBy === 'branch') {
                    orderConfig = {
                        branch: {
                            number: sortDirection,
                        },
                    };
                } else if (orderBy === 'expenses') {
                    // Para ordenar por gastos, primero obtenemos todas las tareas con sus gastos
                    const tasks = await prisma.task.findManyUndeleted({
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
                            ...((filters.startDate || filters.endDate) && {
                                closedAt: {
                                    ...(startDate && {
                                        gte: startDate,
                                    }),
                                    ...(endDate && { lte: endDate }),
                                },
                            }),
                        },
                        include: {
                            expenses: true,
                        },
                    });

                    // Calculamos el total de gastos para cada tarea
                    const tasksWithTotalExpenses = removeDeleted(tasks).map((task) => ({
                        ...task,
                        totalExpenses: task.expenses.reduce(
                            (acc, expense) => acc + expense.amount,
                            0,
                        ),
                    }));

                    // Ordenamos las tareas por el total de gastos
                    const sortedTasks = tasksWithTotalExpenses.sort((a, b) => {
                        if (sortDirection === 'asc') {
                            return a.totalExpenses - b.totalExpenses;
                        }
                        return b.totalExpenses - a.totalExpenses;
                    });

                    // Aplicamos paginación
                    const paginatedTasks = sortedTasks.slice(
                        skip || 0,
                        (skip || 0) + (take || 10),
                    );

                    return paginatedTasks.map((task) => {
                        const { totalExpenses, ...taskWithoutTotal } = task;
                        void totalExpenses;
                        return taskWithoutTotal;
                    });
                } else {
                    orderConfig = { [orderBy]: sortDirection };
                }
            } else {
                orderConfig = { createdAt: 'desc' };
            }
            const tasks = await prisma.task.findManyUndeleted({
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
                    ...((filters.startDate || filters.endDate) && {
                        closedAt: {
                            ...(startDate && {
                                gte: startDate,
                            }),
                            ...(endDate && { lte: endDate }),
                        },
                    }),
                },
                skip: skip || 0,
                take: take || 10,
                orderBy: orderConfig,
                include: {
                    expenses: true,
                },
            });

            return removeDeleted(tasks);
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
            startDate: t.arg({
                type: 'DateTime',
                required: false,
            }),
            endDate: t.arg({
                type: 'DateTime',
                required: false,
            }),
        },
        resolve: async (_parent, filters) => {
            const startDate = filters.startDate;
            const endDate = filters.endDate;
            if (startDate) {
                startDate.setHours(0, 0, 0, 0);
            }
            if (endDate) {
                endDate.setHours(23, 59, 59, 999);
            }

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
                    ...((filters.startDate || filters.endDate) && {
                        closedAt: {
                            ...(startDate && {
                                gte: startDate,
                            }),
                            ...(endDate && { lte: endDate }),
                        },
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
