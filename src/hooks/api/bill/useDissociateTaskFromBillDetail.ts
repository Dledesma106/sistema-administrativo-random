import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BILL_DETAIL_QUERY_KEY } from './useGetBillById';

import { fetchClient } from '@/api/fetch-client';
import {
    DissociateTaskFromBillDetailDocument,
    type DissociateTaskFromBillDetailMutation,
    type DissociateTaskFromBillDetailMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useDissociateTaskFromBillDetail = () => {
    const queryClient = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<
        DissociateTaskFromBillDetailMutation,
        Error,
        DissociateTaskFromBillDetailMutationVariables
    >({
        mutationFn: (variables) =>
            fetchClient(DissociateTaskFromBillDetailDocument, variables),
        onSuccess: (data, variables) => {
            const serverResponse = data.dissociateTaskFromBillDetail;
            triggerAlert({
                type: serverResponse.success ? 'Success' : 'Failure',
                message:
                    serverResponse.message ||
                    (serverResponse.success
                        ? 'Tarea desasociada del detalle correctamente'
                        : 'Error al desasociar la tarea'),
            });
            if (serverResponse.success) {
                queryClient.invalidateQueries({
                    queryKey: BILL_DETAIL_QUERY_KEY(variables.billId),
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
