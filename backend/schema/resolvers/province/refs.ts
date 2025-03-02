import { Province } from '@prisma/client';

import { builder } from '../../builder';

export const ProvinceRef = builder.prismaObject('Province', {
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        createdAt: t.expose('createdAt', { type: 'Date' }),
        updatedAt: t.expose('updatedAt', { type: 'Date' }),
        cities: t.relation('cities'),
    }),
});

export const ProvinceCrudResultPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        province?: Province;
    }>('ProvinceCrudResult')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            province: t.field({
                type: ProvinceRef,
                nullable: true,
                resolve: (result) => result.province,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
        }),
    });

export const ProvinceInputType = builder.inputType('ProvinceInput', {
    fields: (t) => ({
        name: t.string({ required: true }),
    }),
});
