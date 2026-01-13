import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BILL_DETAIL_QUERY_KEY } from './useGetBillById';
import { BILLS_BY_TASK_QUERY_KEY } from './useGetBillsByTask';
import { TASKS_WITHOUT_BILL_QUERY_KEY } from './useGetTasksWithoutBill';

import { fetchClient } from '@/api/fetch-client';
import {
    DissociateTaskFromBillDocument,
    type DissociateTaskFromBillMutation,
    type DissociateTaskFromBillMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useDissociateTaskFromBill = () => {
    const queryClient = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<
        DissociateTaskFromBillMutation,
        Error,
        DissociateTaskFromBillMutationVariables
    >({
        mutationFn: (variables) => fetchClient(DissociateTaskFromBillDocument, variables),
        onSuccess: (data, variables) => {
            const serverResponse = data.dissociateTaskFromBill;
            triggerAlert({
                type: serverResponse.success ? 'Success' : 'Failure',
                message:
                    serverResponse.message ||
                    (serverResponse.success
                        ? 'Tarea desasociada correctamente'
                        : 'Error al desasociar la tarea'),
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
