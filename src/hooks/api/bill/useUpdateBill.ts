import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BILL_DETAIL_QUERY_KEY } from './useGetBillById';
import { BILLS_QUERY_KEY } from './useGetBills';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateBillDocument,
    type UpdateBillMutation,
    type UpdateBillMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useUpdateBill = () => {
    const queryClient = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<UpdateBillMutation, Error, UpdateBillMutationVariables>({
        mutationFn: (variables) => fetchClient(UpdateBillDocument, variables),
        onSuccess: (data, variables) => {
            const serverResponse = data.updateBill;
            triggerAlert({
                type: serverResponse.success ? 'Success' : 'Failure',
                message:
                    serverResponse.message ||
                    (serverResponse.success
                        ? 'Factura actualizada correctamente'
                        : 'Error al actualizar la factura'),
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
