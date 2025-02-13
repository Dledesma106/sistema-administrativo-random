import { BranchPothosRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

builder.queryFields((t) => ({
    branches: t.prismaField({
        type: [BranchPothosRef],
        resolve: async (query, _parent, _args, _info) => {
            return prisma.branch.findManyUndeleted(query);
        },
    }),
    branch: t.prismaField({
        type: BranchPothosRef,
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, _parent, args, _info) => {
            const branch = await prisma.branch.findUniqueUndeleted({
                ...query,
                where: { id: args.id },
            });

            if (!branch) {
                throw new Error('Sucursal no encontrada');
            }

            return branch;
        },
    }),
    clientBranches: t.prismaField({
        type: [BranchPothosRef],
        args: {
            clientId: t.arg.string({ required: true }),
            cityId: t.arg({
                type: ['String'],
                required: false,
            }),
            businessId: t.arg({
                type: ['String'],
                required: false,
            }),
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
        },
        resolve: async (query, _parent, { skip, take, ...args }, _ctx) => {
            const where = {
                clientId: args.clientId,
                ...(args.cityId?.length && { cityId: { in: args.cityId } }),
                ...(args.businessId?.length && {
                    businessesIDs: { hasSome: args.businessId },
                }),
            };

            return prisma.branch.findManyUndeleted({
                ...query,
                where,
                skip: skip || 0,
                take: take || 10,
                orderBy: { number: 'asc' },
            });
        },
    }),
    clientBranchesCount: t.int({
        args: {
            clientId: t.arg.string({ required: true }),
            cityId: t.arg({
                type: ['String'],
                required: false,
            }),
            businessId: t.arg({
                type: ['String'],
                required: false,
            }),
            provinceId: t.arg({
                type: ['String'],
                required: false,
            }),
        },
        resolve: async (_parent, args) => {
            const where = {
                clientId: args.clientId,
                ...(args.cityId?.length && { cityId: { in: args.cityId } }),
                ...(args.businessId?.length && {
                    businessesIDs: { hasSome: args.businessId },
                }),
                ...(args.provinceId?.length && {
                    city: { provinceId: { in: args.provinceId } },
                }),
                deleted: false,
            };

            return prisma.branch.count({ where });
        },
    }),
}));
