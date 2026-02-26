import { useMutation } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { DownloadBillPdfDocument } from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useDownloadBillPdf = () => {
    const { triggerAlert } = useAlert();

    return useMutation<{ downloadBillPdf: string }, Error, { id: string }>({
        mutationFn: ({ id }) => fetchClient(DownloadBillPdfDocument as any, { id }),
        onSuccess: (data) => {
            const url = (data as any).downloadBillPdf;
            if (!url) {
                triggerAlert({
                    type: 'Failure',
                    message: 'No se obtuvo URL para descargar el PDF',
                });
                return;
            }

            const link = document.createElement('a');
            link.href = url;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            triggerAlert({
                type: 'Success',
                message: 'Descarga iniciada',
            });
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `Error descargando PDF: ${error.message}`,
            });
        },
    });
};
