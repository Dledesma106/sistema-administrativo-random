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
            if (!data.downloadTaskPhotos) {
                triggerAlert({
                    type: 'Failure',
                    message: 'No se pudo generar el archivo de fotos',
                });
                return;
            }

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
