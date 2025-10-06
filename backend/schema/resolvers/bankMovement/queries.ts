import { BankMovementPothosRef } from './refs';
import { prisma } from 'lib/prisma';
import { builder } from '../../builder';

builder.queryFields((t) => ({
  bankMovements: t.field({
    type: [BankMovementPothosRef],
    args: {
      skip: t.arg.int({ required: false }),
      take: t.arg.int({ required: false }),
      sourceAccountId: t.arg.string({ required: false }),
      destinationAccountId: t.arg.string({ required: false }),
      startDate: t.arg({ type: 'DateTime', required: false }),
      endDate: t.arg({ type: 'DateTime', required: false }),
      orderBy: t.arg.string({ required: false }),
      orderDirection: t.arg.string({ required: false }),
    },
    authz: {
      compositeRules: [
        { and: ['IsAuthenticated'] },
        { or: ['IsAdministrativoContable'] },
      ],
    },
    resolve: async (_root, args, _ctx, _info) => {
      const {
        skip = 0,
        take = 10,
        sourceAccountId,
        destinationAccountId,
        startDate,
        endDate,
        orderBy,
        orderDirection,
      } = args;

      const sortDirection = orderDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';
      let orderConfig = {};
      if (orderBy) {
        if (orderBy === 'date') {
          orderConfig = { date: sortDirection };
        } else if (orderBy === 'amount') {
          orderConfig = { amount: sortDirection };
        } else {
          orderConfig = { [orderBy]: sortDirection };
        }
      } else {
        orderConfig = { date: 'desc' };
      }

      const dateFilter: any = {};
      if (startDate) dateFilter.gte = startDate;
      if (endDate) dateFilter.lte = endDate;

      return prisma.bankMovement.findMany({
        where: {
          deleted: false,
          ...(sourceAccountId && { sourceAccountId }),
          ...(destinationAccountId && { destinationAccountId }),
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
        },
        skip: skip || 0,
        take: take || 10,
        include: {
          sourceAccount: true,
          destinationAccount: true,
        },
        orderBy: orderConfig,
      });
    },
  }),

  bankMovementsCount: t.int({
    args: {
      sourceAccountId: t.arg.string({ required: false }),
      destinationAccountId: t.arg.string({ required: false }),
      startDate: t.arg({ type: 'DateTime', required: false }),
      endDate: t.arg({ type: 'DateTime', required: false }),
    },
    authz: {
      compositeRules: [
        { and: ['IsAuthenticated'] },
        { or: ['IsAdministrativoContable'] },
      ],
    },
    resolve: async (_root, args, _ctx, _info) => {
      const { sourceAccountId, destinationAccountId, startDate, endDate } = args;
      const dateFilter: any = {};
      if (startDate) dateFilter.gte = startDate;
      if (endDate) dateFilter.lte = endDate;
      return prisma.bankMovement.count({
        where: {
          deleted: false,
          ...(sourceAccountId && { sourceAccountId }),
          ...(destinationAccountId && { destinationAccountId }),
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
        },
      });
    },
  }),

  bankMovement: t.field({
    type: BankMovementPothosRef,
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    authz: {
      compositeRules: [
        { and: ['IsAuthenticated'] },
        { or: ['IsAdministrativoContable'] },
      ],
    },
    resolve: async (_root, args, _ctx, _info) => {
      return prisma.bankMovement.findFirst({
        where: {
          id: args.id,
          deleted: false,
        },
        include: {
          sourceAccount: true,
          destinationAccount: true,
        },
      });
    },
  }),
})); 