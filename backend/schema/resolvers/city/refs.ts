import { builder } from '../../builder';

export const CityRef = builder.prismaObject('City', {
    name: 'City',
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        province: t.relation('province'),
    }),
});
