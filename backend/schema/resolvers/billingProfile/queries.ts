import { builder } from 'backend/schema/builder';
import { prisma } from 'lib/prisma';

builder.queryFields((t) => ({
    billingProfiles: t.prismaField({
        type: ['BillingProfile'],
        args: {
            businessId: t.arg({
                type: ['String'],
                required: false,
            }),
            skip: t.arg.int({ required: false }),
            take: t.arg.int({ required: false }),
            orderBy: t.arg.string({ required: false }),
            orderDirection: t.arg.string({ required: false }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (
            query,
            _parent,
            { businessId, skip, take, orderBy, orderDirection },
        ) => {
            const sortDirection =
                orderDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';

            let orderConfig = {};

            if (orderBy) {
                if (orderBy === 'business') {
                    orderConfig = {
                        business: {
                            name: sortDirection,
                        },
                    };
                } else if (orderBy === 'CUIT') {
                    orderConfig = {
                        CUIT: sortDirection,
                    };
                } else if (orderBy === 'billingEmail') {
                    orderConfig = {
                        billingEmail: sortDirection,
                    };
                } else if (orderBy === 'contactName' || orderBy === 'contactEmail') {
                    // Para ordenar por contactos, necesitamos obtener todos los perfiles y ordenarlos en memoria
                    const billingProfiles = await prisma.billingProfile.findManyUndeleted(
                        {
                            ...query,
                            where: {
                                ...(businessId?.length && {
                                    businessId: { in: businessId },
                                }),
                            },
                            include: {
                                business: true,
                            },
                        },
                    );

                    // Ordenar por el primer contacto
                    const sortedProfiles = billingProfiles.sort((a, b) => {
                        const aContact = a.contacts?.[0];
                        const bContact = b.contacts?.[0];

                        let aValue = '';
                        let bValue = '';

                        if (orderBy === 'contactName') {
                            aValue = aContact?.fullName || '';
                            bValue = bContact?.fullName || '';
                        } else if (orderBy === 'contactEmail') {
                            aValue = aContact?.email || '';
                            bValue = bContact?.email || '';
                        }

                        if (sortDirection === 'asc') {
                            return aValue.localeCompare(bValue);
                        } else {
                            return bValue.localeCompare(aValue);
                        }
                    });

                    // Aplicar paginación
                    const paginatedProfiles = sortedProfiles.slice(
                        skip || 0,
                        (skip || 0) + (take || 10),
                    );

                    return paginatedProfiles;
                } else {
                    orderConfig = { [orderBy]: sortDirection };
                }
            } else {
                orderConfig = { createdAt: 'desc' };
            }

            // Si no es ordenamiento por contactos, usar Prisma
            if (orderBy !== 'contactName' && orderBy !== 'contactEmail') {
                return await prisma.billingProfile.findManyUndeleted({
                    ...query,
                    where: {
                        ...(businessId?.length && {
                            businessId: { in: businessId },
                        }),
                    },
                    skip: skip || 0,
                    take: take || 10,
                    orderBy: orderConfig,
                    include: {
                        business: true,
                    },
                });
            }

            // Para ordenamiento por contactos, ya retornamos el resultado arriba
            return [];
        },
    }),
    billingProfilesCount: t.int({
        args: {
            businessId: t.arg({
                type: ['String'],
                required: false,
            }),
        },
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        resolve: async (_parent, { businessId }) => {
            return prisma.billingProfile.count({
                where: {
                    deleted: false,
                    ...(businessId?.length && {
                        businessId: { in: businessId },
                    }),
                },
            });
        },
    }),
    billingProfileById: t.prismaField({
        type: 'BillingProfile',
        nullable: true,
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        args: {
            id: t.arg.string({
                required: true,
            }),
        },
        resolve: async (query, _parent, { id }) => {
            return await prisma.billingProfile.findUniqueUndeleted({
                ...query,
                where: {
                    id,
                },
            });
        },
    }),
    billingProfileByBusinessId: t.prismaField({
        type: 'BillingProfile',
        nullable: true,
        authz: {
            compositeRules: [
                {
                    and: ['IsAuthenticated'],
                },
                {
                    or: ['IsAdministrativoContable'],
                },
            ],
        },
        args: {
            businessId: t.arg.string({
                required: true,
            }),
        },
        resolve: async (query, _parent, { businessId }) => {
            return await prisma.billingProfile.findUniqueUndeleted({
                ...query,
                where: {
                    businessId,
                },
            });
        },
    }),
}));
