import { prisma } from 'lib/prisma';

import { builder } from '../builder';

builder.prismaObject('Expense', {
    name: 'Expense',
    fields: (t) => ({
        id: t.exposeID('id'),
        amount: t.exposeInt('amount'),
        expenseType: t.exposeString('expenseType'),
        paySource: t.exposeString('paySource'),
        status: t.exposeString('status'),
    }),
});

builder.queryFields((t) => ({
    expenses: t.prismaField({
        type: ['Expense'],
        resolve: async (query, _parent, _args, _info) => {
            return prisma.expense.findMany(query);
        },
    }),
}));
