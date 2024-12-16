import { useMutation } from '@tanstack/react-query';
import { ColumnFiltersState } from '@tanstack/react-table';

import { fetchClient } from '@/api/fetch-client';
import {
    GenerateApprovedTasksReportDocument,
    GenerateApprovedTasksReportMutation,
} from '@/api/graphql';

export const useGenerateApprovedTasksReport = () => {
    const { mutateAsync: generateReport, isPending: isGeneratingReport } = useMutation<
        GenerateApprovedTasksReportMutation,
        Error,
        {
            startDate: string;
            endDate: string;
            filters?: ColumnFiltersState;
        }
    >({
        mutationFn: ({ startDate, endDate, filters }) =>
            fetchClient(GenerateApprovedTasksReportDocument, {
                startDate,
                endDate,
                filters,
            }),
        onSuccess: (data) => {
            const downloadUrl = data.generateApprovedTasksReport;

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'tareas-aprobadas.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    });

    return {
        generateReport,
        isGeneratingReport,
    };
};
