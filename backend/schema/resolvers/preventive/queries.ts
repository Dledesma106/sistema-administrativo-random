import { PreventiveFrequencyRef, PreventiveStatusRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const PreventiveQueries = builder.queryFields((t) => ({
    preventives: t.prismaField({
        type: ['Preventive'],
        args: {
            skip: t.arg.int({ defaultValue: 0 }),
            take: t.arg.int({ defaultValue: 10 }),
            business: t.arg({
                type: ['String'],
                required: false,
            }),
            city: t.arg({
                type: ['String'],
                required: false,
            }),
            assigned: t.arg({
                type: ['String'],
                required: false,
            }),
            client: t.arg({
                type: ['String'],
                required: false,
            }),
            frequency: t.arg({
                type: [PreventiveFrequencyRef],
                required: false,
            }),
            months: t.arg({
                type: ['String'],
                required: false,
            }),
            status: t.arg({
                type: [PreventiveStatusRef],
                required: false,
            }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { skip, take, ...filters }) => {
            return prisma.preventive.findManyUndeleted({
                ...query,
                skip: skip || 0,
                take: take || 10,
                where: {
                    deleted: false,
                    ...(filters.business?.length && {
                        businessId: { in: filters.business },
                    }),
                    ...(filters.city?.length && {
                        branch: { cityId: { in: filters.city } },
                    }),
                    ...(filters.assigned?.length && {
                        assignedIDs: { hasSome: filters.assigned },
                    }),
                    ...(filters.client?.length && {
                        branch: { clientId: { in: filters.client } },
                    }),
                    ...(filters.frequency?.length && {
                        frequency: { in: filters.frequency },
                    }),
                    ...(filters.months?.length && {
                        months: { hasSome: filters.months },
                    }),
                    ...(filters.status?.length && {
                        status: { in: filters.status },
                    }),
                },
            });
        },
    }),

    preventivesCount: t.int({
        args: {
            business: t.arg({
                type: ['String'],
                required: false,
            }),
            city: t.arg({
                type: ['String'],
                required: false,
            }),
            assigned: t.arg({
                type: ['String'],
                required: false,
            }),
            client: t.arg({
                type: ['String'],
                required: false,
            }),
            frequency: t.arg({
                type: [PreventiveFrequencyRef],
                required: false,
            }),
            months: t.arg({
                type: ['String'],
                required: false,
            }),
            status: t.arg({
                type: [PreventiveStatusRef],
                required: false,
            }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (_parent, filters) => {
            return prisma.preventive.count({
                where: {
                    deleted: false,
                    ...(filters.business?.length && {
                        businessId: { in: filters.business },
                    }),
                    ...(filters.city?.length && {
                        branch: { cityId: { in: filters.city } },
                    }),
                    ...(filters.assigned?.length && {
                        assignedIDs: { hasSome: filters.assigned },
                    }),
                    ...(filters.client?.length && {
                        branch: { clientId: { in: filters.client } },
                    }),
                    ...(filters.frequency?.length && {
                        frequency: { in: filters.frequency },
                    }),
                    ...(filters.months?.length && {
                        months: { hasSome: filters.months },
                    }),
                    ...(filters.status?.length && {
                        status: { in: filters.status },
                    }),
                },
            });
        },
    }),

    preventive: t.prismaField({
        type: 'Preventive',
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated'],
        },
        resolve: async (query, _parent, { id }) => {
            const preventive = await prisma.preventive.findUniqueUndeleted({
                ...query,
                where: { id },
            });
            if (!preventive) {
                throw new Error('Preventivo no encontrado');
            }
            return preventive;
        },
    }),
}));
