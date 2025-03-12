import { useMutation } from '@tanstack/react-query';
import { ColumnFiltersState } from '@tanstack/react-table';

import { fetchClient } from '@/api/fetch-client';
import {
    GenerateApprovedTasksReportDocument,
    GenerateApprovedTasksReportMutation,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useGenerateApprovedTasksReport = () => {
    const { triggerAlert } = useAlert();
    const { mutateAsync: generateReport, isPending: isGeneratingReport } = useMutation<
        GenerateApprovedTasksReportMutation,
        Error,
        {
            startDate: Date;
            endDate: Date;
            filters?: ColumnFiltersState;
        }
    >({
        mutationFn: ({ startDate, endDate, filters }) =>
            fetchClient(GenerateApprovedTasksReportDocument, {
                startDate,
                endDate,
                filters: filters || [],
            }),
        onSuccess: (data) => {
            const downloadUrl = data.generateApprovedTasksReport;

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'tareas-aprobadas.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            triggerAlert({
                type: 'Success',
                message: 'Reporte de tareas generado con éxito',
            });
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `Error al generar el reporte de tareas: ${error}`,
            });
        },
    });

    return {
        generateReport,
        isGeneratingReport,
    };
};
