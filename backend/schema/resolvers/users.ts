import { prisma } from 'lib/prisma';

import { builder } from '../builder';

export const UserPothosRef = builder.prismaObject('User', {
    fields: (t) => ({
        id: t.exposeID('id'),
        email: t.exposeString('email'),
        firstName: t.exposeString('firstName'),
        lastName: t.exposeString('lastName'),
        fullName: t.exposeString('fullName'),
        city: t.relation('city', {
            nullable: true,
        }),
    }),
});

builder.queryFields((t) => ({
    users: t.prismaField({
        type: ['User'],
        resolve: async (query, _parent, _args, _info) => {
            return prisma.user.findMany(query);
        },
    }),
}));

builder.mutationFields((t) => ({
    createUser: t.prismaField({
        type: 'User',
        nullable: true,
        args: {
            email: t.arg.string(),
            firstName: t.arg.string(),
            lastName: t.arg.string(),
        },
        resolve: async (_query, _parent, _args, _info) => {
            return (await prisma.user.findFirst({
                where: {
                    id: '1',
                },
            })) as any;
        },
    }),
}));
