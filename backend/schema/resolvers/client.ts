import { prisma } from 'lib/prisma';
import { builder } from '../builder';
import { removeDeleted } from '../utils';

export const ClientPothosRef = builder.prismaObject('Client', {
    name: 'Client',
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        branches: t.prismaField({
            type: ['Branch'],
            resolve: async (root, parent, query) => {
                const branches = await prisma.branch.findManyUndeleted({
                    where: {
                        clientId: parent.id,
                    },
                    ...query,
                });
                return branches;
            },
        }),
    }),
});

builder.queryFields((t) => ({
    clients: t.prismaField({
        type: ['Client'],
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
                        'IsTecnico',
                    ],
                },
            ],
        },
        resolve: async (query) => {
            console.log(query);
            const clients = await prisma.client.findManyUndeleted({
                ...query,
            });
            return clients;
        },
    }),
}));
