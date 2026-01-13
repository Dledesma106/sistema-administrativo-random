import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BILL_DETAIL_QUERY_KEY } from './useGetBillById';
import { TASKS_WITHOUT_BILL_QUERY_KEY } from './useGetTasksWithoutBill';

import { fetchClient } from '@/api/fetch-client';
import {
    AssociateTasksToBillDocument,
    type AssociateTasksToBillMutation,
    type AssociateTasksToBillMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useAssociateTasksToBill = () => {
    const queryClient = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<
        AssociateTasksToBillMutation,
        Error,
        AssociateTasksToBillMutationVariables
    >({
        mutationFn: (variables) => fetchClient(AssociateTasksToBillDocument, variables),
        onSuccess: (data, variables) => {
            const serverResponse = data.associateTasksToBill;
            triggerAlert({
                type: serverResponse.success ? 'Success' : 'Failure',
                message:
                    serverResponse.message ||
                    (serverResponse.success
                        ? 'Tareas asociadas correctamente'
                        : 'Error al asociar las tareas'),
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
