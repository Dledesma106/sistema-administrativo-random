import { Image } from '@prisma/client';
import dayjs from 'dayjs';

import { createImageSignedUrlAsync } from 'backend/s3Client';
import { prisma } from 'lib/prisma';

export const updateImageSignedUrlAsync = async (image: Image) => {
    if (image.url && image.urlExpire && dayjs(image.urlExpire).isAfter(dayjs())) {
        return {
            id: image.id,
            url: image.url,
        };
    }

    const { url, urlExpire } = await createImageSignedUrlAsync(image.key);

    return prisma.image.update({
        where: {
            id: image.id,
        },
        data: {
            url,
            urlExpire,
        },
    });
};

export function removeDeleted<T extends { deleted: boolean }>(arr: T[]): T[] {
    return arr
        .filter((item) => !item.deleted)
        .map((item) => {
            // Iterar sobre las propiedades del objeto
            for (const key in item) {
                if (Array.isArray(item[key])) {
                    // Si la propiedad es un arreglo, aplicar la función recursivamente
                    (item[key] as any) = removeDeleted(item[key]);
                }
            }
            return item;
        });
}
