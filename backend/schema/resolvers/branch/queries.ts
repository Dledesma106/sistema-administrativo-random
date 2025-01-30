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
            cityId: t.arg.string({ required: false }),
            businessId: t.arg.string({ required: false }),
            provinceId: t.arg.string({ required: false }),
        },
        resolve: async (query, _parent, args, _info) => {
            const where = {
                clientId: args.clientId,
                ...(args.cityId && { cityId: args.cityId }),
                ...(args.businessId && { businessesIDs: { has: args.businessId } }),
                ...(args.provinceId && { city: { provinceId: args.provinceId } }),
            };

            return prisma.branch.findManyUndeleted({
                ...query,
                where,
            });
        },
    }),
}));
