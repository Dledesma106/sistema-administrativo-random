import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EXPENSE_DETAIL_QUERY_KEY } from './useGetExpense';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateExpenseAdministrativeDocument,
    UpdateExpenseAdministrativeMutation,
    UpdateExpenseAdministrativeMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useUpdateExpenseAdministrative = () => {
    const client = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<
        UpdateExpenseAdministrativeMutation,
        Error,
        UpdateExpenseAdministrativeMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(UpdateExpenseAdministrativeDocument, data);
        },
        onSuccess: (data) => {
            client.invalidateQueries({
                queryKey: EXPENSE_DETAIL_QUERY_KEY(
                    data.updateExpenseAdministrative.expense?.id ?? '',
                ),
            });
            triggerAlert({
                type: 'Success',
                message: 'Anotaciones y archivos adjuntos actualizadas correctamente',
            });
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `Error: ${error}`,
            });
        },
    });
};
