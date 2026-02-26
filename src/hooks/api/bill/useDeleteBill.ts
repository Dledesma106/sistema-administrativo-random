import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BILLS_QUERY_KEY } from './useGetBills';
import { TASKS_WITHOUT_BILL_QUERY_KEY } from './useGetTasksWithoutBill';

import { fetchClient } from '@/api/fetch-client';
import {
    DeleteBillDocument,
    type DeleteBillMutation,
    type DeleteBillMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useDeleteBill = () => {
    const queryClient = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<DeleteBillMutation, Error, DeleteBillMutationVariables>({
        mutationFn: (variables) => fetchClient(DeleteBillDocument, variables),
        onSuccess: (data) => {
            const serverResponse = data.deleteBill;
            triggerAlert({
                type: serverResponse.success ? 'Success' : 'Failure',
                message:
                    serverResponse.message ||
                    (serverResponse.success
                        ? 'Factura eliminada correctamente'
                        : 'Error al eliminar la factura'),
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
