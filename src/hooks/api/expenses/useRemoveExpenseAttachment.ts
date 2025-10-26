import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EXPENSE_DETAIL_QUERY_KEY } from './useGetExpense';

import { fetchClient } from '@/api/fetch-client';
import {
    RemoveExpenseAttachmentDocument,
    RemoveExpenseAttachmentMutation,
    RemoveExpenseAttachmentMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useRemoveExpenseAttachment = () => {
    const client = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<
        RemoveExpenseAttachmentMutation,
        Error,
        RemoveExpenseAttachmentMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(RemoveExpenseAttachmentDocument, data);
        },
        onSuccess: (data) => {
            const expenseId = data.removeExpenseAttachment.expense?.id ?? '';

            // Invalidar la query específica del gasto
            client.invalidateQueries({
                queryKey: EXPENSE_DETAIL_QUERY_KEY(expenseId),
            });

            // También invalidar todas las queries relacionadas con gastos
            client.invalidateQueries({
                queryKey: ['expenses'],
            });

            // Forzar un refetch inmediato
            client.refetchQueries({
                queryKey: EXPENSE_DETAIL_QUERY_KEY(expenseId),
            });

            triggerAlert({
                type: 'Success',
                message: 'Archivo adjunto eliminado correctamente',
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
