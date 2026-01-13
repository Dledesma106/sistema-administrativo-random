import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BILLS_QUERY_KEY } from './useGetBills';
import { TASKS_WITHOUT_BILL_QUERY_KEY } from './useGetTasksWithoutBill';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateBillDocument,
    type CreateBillMutation,
    type CreateBillMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useCreateBill = () => {
    const queryClient = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<CreateBillMutation, Error, CreateBillMutationVariables>({
        mutationFn: (variables) => fetchClient(CreateBillDocument, variables),
        onSuccess: (data) => {
            const serverResponse = data.createBill;
            triggerAlert({
                type: serverResponse.success ? 'Success' : 'Failure',
                message:
                    serverResponse.message ||
                    (serverResponse.success
                        ? 'Factura creada correctamente'
                        : 'Error al crear la factura'),
            });
            if (serverResponse.success) {
                queryClient.invalidateQueries({ queryKey: [BILLS_QUERY_KEY] });
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
