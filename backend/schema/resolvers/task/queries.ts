import { Role } from '@prisma/client';

import { TaskStatusPothosRef, TaskTypePothosRef } from './refs';

import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

builder.queryFields((t) => ({
    tasks: t.prismaField({
        type: ['Task'],
        authz: {
            rules: ['IsAuthenticated'],
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
        resolve: async (query, _parent, _args, { user }) => {
            if (
                user.roles.some(
                    (role) =>
                        role === Role.AdministrativoContable ||
                        role === Role.AdministrativoTecnico ||
                        role === Role.Auditor,
                )
            ) {
                return await prisma.task.findManyUndeleted(query);
            }

            return await prisma.task.findManyUndeleted({
                where: {
                    assignedIDs: {
                        has: user.id,
                    },
                },
            });
        },
    }),
}));
