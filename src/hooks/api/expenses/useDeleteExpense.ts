import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    DeleteExpenseDocument,
    DeleteExpenseMutation,
    DeleteExpenseMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';
import { getCleanErrorMessage } from '@/lib/utils';

export const useDeleteExpense = (id: string) => {
    const client = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<DeleteExpenseMutation, Error, DeleteExpenseMutationVariables>({
        mutationFn: () =>
            fetchClient(DeleteExpenseDocument, {
                id,
                taskId: '',
            }),
        onSuccess: (data, { taskId }) => {
            if (!data) {
                return;
            }

            // Invalidar la query de gastos para forzar una recarga
            client.invalidateQueries({ queryKey: ['expenses'] });

            if (taskId) {
                client.invalidateQueries({
                    queryKey: ['task', taskId],
                });
            }

            triggerAlert({
                type: 'Success',
                message: 'Gasto eliminado correctamente',
            });
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `Error al eliminar el gasto: ${getCleanErrorMessage(error)}`,
            });
        },
    });
};
