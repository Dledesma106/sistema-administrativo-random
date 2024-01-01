import { Task } from '@prisma/client';

import { TaskPothosRef, TaskStatusPothosRef, TaskTypePothosRef } from './refs';

import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

const TaskInputPothosRef = builder.inputType('TaskInput', {
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
    }),
});

const TaskCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
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
        resolve: async (root, args, _context, _info) => {
            try {
                const { input } = args;
                const task = await prisma.task.create({
                    data: {
                        workOrderNumber: input.workOrderNumber,
                        auditorId: input.auditor,
                        branchId: input.branch,
                        businessId: input.business,
                        description: input.description,
                        status: input.status,
                        taskType: input.taskType,
                        assignedIDs: {
                            set: input.assigned,
                        },
                    },
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
        resolve: async (root, args, _context, _info) => {
            try {
                const { id, input } = args;
                const task = await prisma.task.update({
                    where: {
                        id,
                    },
                    data: {
                        workOrderNumber: input.workOrderNumber,
                        auditorId: input.auditor,
                        branchId: input.branch,
                        businessId: input.business,
                        description: input.description,
                        status: input.status,
                        taskType: input.taskType,
                        assignedIDs: {
                            set: input.assigned,
                        },
                    },
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
}));
