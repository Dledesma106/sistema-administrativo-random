import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BILL_DETAIL_QUERY_KEY } from './useGetBillById';
import { BILLS_QUERY_KEY } from './useGetBills';
import { TASKS_WITHOUT_BILL_QUERY_KEY } from './useGetTasksWithoutBill';

import { fetchClient } from '@/api/fetch-client';
import {
    EmitBillDocument,
    type EmitBillMutation,
    type EmitBillMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useEmitBill = () => {
    const queryClient = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<EmitBillMutation, Error, EmitBillMutationVariables>({
        mutationFn: (variables) => fetchClient(EmitBillDocument, variables),
        onSuccess: (data, variables) => {
            const serverResponse = data.emitBill;
            triggerAlert({
                type: serverResponse.success ? 'Success' : 'Failure',
                message:
                    serverResponse.message ||
                    (serverResponse.success
                        ? 'Factura emitida correctamente'
                        : 'Error al emitir la factura'),
            });
            if (serverResponse.success) {
                queryClient.invalidateQueries({ queryKey: [BILLS_QUERY_KEY] });
                queryClient.invalidateQueries({
                    queryKey: BILL_DETAIL_QUERY_KEY(variables.id),
                });
                queryClient.invalidateQueries({
                    queryKey: [TASKS_WITHOUT_BILL_QUERY_KEY],
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
