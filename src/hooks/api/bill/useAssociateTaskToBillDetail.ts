import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BILL_DETAIL_QUERY_KEY } from './useGetBillById';
import { TASKS_WITHOUT_BILL_QUERY_KEY } from './useGetTasksWithoutBill';

import { fetchClient } from '@/api/fetch-client';
import {
    AssociateTaskToBillDetailDocument,
    type AssociateTaskToBillDetailMutation,
    type AssociateTaskToBillDetailMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useAssociateTaskToBillDetail = () => {
    const queryClient = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<
        AssociateTaskToBillDetailMutation,
        Error,
        AssociateTaskToBillDetailMutationVariables
    >({
        mutationFn: (variables) =>
            fetchClient(AssociateTaskToBillDetailDocument, variables),
        onSuccess: (data, variables) => {
            const serverResponse = data.associateTaskToBillDetail;
            triggerAlert({
                type: serverResponse.success ? 'Success' : 'Failure',
                message:
                    serverResponse.message ||
                    (serverResponse.success
                        ? 'Tarea asociada al detalle correctamente'
                        : 'Error al asociar la tarea'),
            });
            if (serverResponse.success) {
                queryClient.invalidateQueries({
                    queryKey: BILL_DETAIL_QUERY_KEY(variables.billId),
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
