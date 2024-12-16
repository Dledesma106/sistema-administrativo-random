import { useMutation } from '@tanstack/react-query';
import { ColumnFiltersState } from '@tanstack/react-table';

import { fetchClient } from '@/api/fetch-client';
import {
    GenerateApprovedExpensesReportDocument,
    GenerateApprovedExpensesReportMutation,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

type GenerateReportParams = {
    startDate: string;
    endDate: string;
    filters?: ColumnFiltersState;
};

export const useGenerateApprovedExpensesReport = () => {
    const { triggerAlert } = useAlert();

    const { mutateAsync: generateReport, isPending: isGeneratingReport } = useMutation<
        GenerateApprovedExpensesReportMutation,
        Error,
        GenerateReportParams
    >({
        mutationFn: ({ startDate, endDate, filters }) =>
            fetchClient(GenerateApprovedExpensesReportDocument, {
                startDate,
                endDate,
                filters,
            }),
        onSuccess: (data) => {
            const downloadUrl = data.generateApprovedExpensesReport;

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'gastos-aprobados.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            triggerAlert({
                type: 'Success',
                message: 'Reporte de gastos generado con éxito',
            });
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `Error al generar el reporte de gastos: ${error}`,
            });
        },
    });

    return {
        generateReport,
        isGeneratingReport,
    };
};
