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
            businessId: string;
        }
    >({
        mutationFn: ({ startDate, endDate, businessId }) =>
            fetchClient(DownloadTaskPhotosDocument, {
                startDate,
                endDate,
                businessId,
            }),
        onSuccess: (data) => {
            const result = data.downloadTaskPhotos;

            if (!result.success) {
                triggerAlert({
                    type: 'Failure',
                    message: result.message || 'No se pudo generar el archivo de fotos',
                });
                return;
            }

            if (!result.url) {
                triggerAlert({
                    type: 'Failure',
                    message: 'No se pudo obtener la URL de descarga',
                });
                return;
            }

            const link = document.createElement('a');
            link.href = result.url;
            link.download = 'fotos-tareas.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            triggerAlert({
                type: 'Success',
                message: 'Fotos de tareas descargadas con éxito',
            });
        },
        onError: (error: any) => {
            let errorMessage = 'Error al descargar las fotos';

            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                console.log(error);
                errorMessage = error.graphQLErrors[0].extensions.originalError.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            triggerAlert({
                type: 'Failure',
                message: errorMessage,
            });
        },
    });

    return {
        downloadPhotos,
        isDownloading,
    };
};
