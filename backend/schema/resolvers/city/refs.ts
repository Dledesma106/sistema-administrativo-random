import { City } from '@prisma/client';

import { builder } from '../../builder';

export const CityRef = builder.prismaObject('City', {
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        province: t.relation('province'),
    }),
});

export const CityInputRef = builder.inputType('CityInput', {
    fields: (t) => ({
        name: t.string({ required: true }),
        provinceId: t.string({ required: true }),
    }),
});

export const CityCrudRef = builder
    .objectRef<{
        success: boolean;
        message?: string | null;
        city?: City | null;
    }>('CityCrudRef')
    .implement({
        fields: (t) => ({
            success: t.exposeBoolean('success'),
            message: t.exposeString('message', { nullable: true }),
            city: t.field({
                type: CityRef,
                nullable: true,
                resolve: (parent) => parent.city,
            }),
        }),
    });
