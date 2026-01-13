import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BILL_DETAIL_QUERY_KEY } from './useGetBillById';
import { BILLS_BY_TASK_QUERY_KEY } from './useGetBillsByTask';
import { TASKS_WITHOUT_BILL_QUERY_KEY } from './useGetTasksWithoutBill';

import { fetchClient } from '@/api/fetch-client';
import {
    AssociateTaskToBillDocument,
    type AssociateTaskToBillMutation,
    type AssociateTaskToBillMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useAssociateTaskToBill = () => {
    const queryClient = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<
        AssociateTaskToBillMutation,
        Error,
        AssociateTaskToBillMutationVariables
    >({
        mutationFn: (variables) => fetchClient(AssociateTaskToBillDocument, variables),
        onSuccess: (data, variables) => {
            const serverResponse = data.associateTaskToBill;
            triggerAlert({
                type: serverResponse.success ? 'Success' : 'Failure',
                message:
                    serverResponse.message ||
                    (serverResponse.success
                        ? 'Tarea asociada correctamente'
                        : 'Error al asociar la tarea'),
            });
            if (serverResponse.success) {
                queryClient.invalidateQueries({
                    queryKey: BILL_DETAIL_QUERY_KEY(variables.billId),
                });
                queryClient.invalidateQueries({
                    queryKey: [TASKS_WITHOUT_BILL_QUERY_KEY],
                });
                queryClient.invalidateQueries({
                    queryKey: BILLS_BY_TASK_QUERY_KEY(variables.taskId),
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
