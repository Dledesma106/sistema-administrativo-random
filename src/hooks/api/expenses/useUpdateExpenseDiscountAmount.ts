import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EXPENSE_DETAIL_QUERY_KEY } from './useGetExpense';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateExpenseDiscountAmountDocument,
    UpdateExpenseDiscountAmountMutation,
    UpdateExpenseDiscountAmountMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useUpdateExpenseDiscountAmount = () => {
    const client = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<
        UpdateExpenseDiscountAmountMutation,
        Error,
        UpdateExpenseDiscountAmountMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(UpdateExpenseDiscountAmountDocument, data);
        },
        onSuccess: (data) => {
            client.invalidateQueries({
                queryKey: EXPENSE_DETAIL_QUERY_KEY(
                    data.updateExpenseDiscountAmount.expense?.id ?? '',
                ),
            });

            // Invalidar la lista de gastos para reflejar los cambios
            client.invalidateQueries({
                queryKey: ['GetExpenses'],
            });

            triggerAlert({
                type: 'Success',
                message: 'Monto con descuento actualizado correctamente',
            });
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `Error al actualizar el monto con descuento: ${error}`,
            });
        },
    });
};
