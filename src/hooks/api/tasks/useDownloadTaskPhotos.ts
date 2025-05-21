import { useMutation } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { DownloadTaskPhotosDocument, DownloadTaskPhotosMutation } from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useDownloadTaskPhotos = () => {
    const { triggerAlert } = useAlert();
    const { mutateAsync: downloadPhotos, isPending: isDownloading } = useMutation<
        DownloadTaskPhotosMutation,
        Error,
        {
            startDate: Date;
            endDate: Date;
            businessId?: string;
        }
    >({
        mutationFn: ({ startDate, endDate, businessId }) =>
            fetchClient(DownloadTaskPhotosDocument, {
                startDate,
                endDate,
                businessId: businessId ?? null,
            }),
        onSuccess: (data) => {
            const downloadUrl = data.downloadTaskPhotos;

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'fotos-tareas.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            triggerAlert({
                type: 'Success',
                message: 'Fotos de tareas descargadas con éxito',
            });
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `Error al descargar las fotos de tareas: ${error}`,
            });
        },
    });

    return {
        downloadPhotos,
        isDownloading,
    };
};
