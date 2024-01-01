import { builder } from '../builder';

builder.prismaObject('Client', {
    name: 'Client',
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
    }),
});
