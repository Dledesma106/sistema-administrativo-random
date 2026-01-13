import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BILL_DETAIL_QUERY_KEY } from './useGetBillById';
import { BILLS_QUERY_KEY } from './useGetBills';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateBillStatusDocument,
    type UpdateBillStatusMutation,
    type UpdateBillStatusMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useUpdateBillStatus = () => {
    const queryClient = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<
        UpdateBillStatusMutation,
        Error,
        UpdateBillStatusMutationVariables
    >({
        mutationFn: (variables) => fetchClient(UpdateBillStatusDocument, variables),
        onSuccess: (data, variables) => {
            const serverResponse = data.updateBillStatus;
            triggerAlert({
                type: serverResponse.success ? 'Success' : 'Failure',
                message:
                    serverResponse.message ||
                    (serverResponse.success
                        ? 'Estado actualizado correctamente'
                        : 'Error al actualizar el estado'),
            });
            if (serverResponse.success) {
                queryClient.invalidateQueries({ queryKey: [BILLS_QUERY_KEY] });
                queryClient.invalidateQueries({
                    queryKey: BILL_DETAIL_QUERY_KEY(variables.id),
                });
            }
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `Error: ${error.message}`,
            });
        },
    });
};
