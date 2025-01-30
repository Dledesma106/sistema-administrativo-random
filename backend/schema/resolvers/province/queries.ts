import { ProvinceRef } from './refs';

import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const ProvinceQueries = builder.queryFields((t) => ({
    provinces: t.field({
        type: [ProvinceRef],
        resolve: async () => {
            return await prisma.province.findMany({
                where: { deleted: false },
                orderBy: { name: 'asc' },
            });
        },
    }),
    provinceById: t.field({
        type: ProvinceRef,
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (root, { id }) => {
            const province = await prisma.province.findUniqueUndeleted({
                where: { id },
            });

            if (!province) {
                throw new Error('Provincia no encontrada');
            }

            return province;
        },
    }),
}));
