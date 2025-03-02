import { Preventive, PreventiveStatus } from '@prisma/client';

import { builder } from '../../builder';

// Primero definimos el enum
export const PreventiveStatusRef = builder.enumType('PreventiveStatus', {
    values: Object.fromEntries(
        Object.entries(PreventiveStatus).map(([key, value]) => [key, { value }]),
    ),
});

export const PreventiveRef = builder.prismaObject('Preventive', {
    fields: (t) => ({
        id: t.exposeID('id'),
        lastDoneAt: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.lastDoneAt,
        }),
        batteryChangedAt: t.field({
            type: 'DateTime',
            nullable: true,
            resolve: (root) => root.batteryChangedAt,
        }),
        frequency: t.exposeInt('frequency'),
        months: t.exposeStringList('months'),
        observations: t.exposeString('observations', { nullable: true }),
        status: t.expose('status', { type: PreventiveStatusRef }),
        business: t.relation('business'),
        branch: t.relation('branch'),
        assigned: t.relation('assigned'),
        tasks: t.relation('tasks'),
    }),
});

export const PreventiveInputRef = builder.inputType('PreventiveInput', {
    fields: (t) => ({
        lastDoneAt: t.field({
            type: 'DateTime',
            required: false,
        }),
        batteryChangedAt: t.field({
            type: 'DateTime',
            required: false,
        }),
        frequency: t.int({ required: true }),
        months: t.stringList({ required: true }),
        observations: t.string({ required: false }),
        status: t.field({
            type: PreventiveStatusRef,
            required: true,
        }),
        businessId: t.string({ required: true }),
        branchId: t.string({ required: true }),
        assignedIds: t.stringList({ required: true }),
    }),
});

export const PreventiveCrudRef = builder
    .objectRef<{
        success: boolean;
        message?: string | null;
        preventive?: Preventive | null;
    }>('PreventiveCrudRef')
    .implement({
        fields: (t) => ({
            success: t.exposeBoolean('success'),
            message: t.exposeString('message', { nullable: true }),
            preventive: t.field({
                type: PreventiveRef,
                nullable: true,
                resolve: (parent) => parent.preventive,
            }),
        }),
    });
