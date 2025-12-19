import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASKS_QUERY_KEY } from './useGetTasks';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateTaskDocument,
    CreateTaskMutation,
    CreateTaskMutationVariables,
} from '@/api/graphql';
import { SERVICE_ORDER_QUERY_KEY } from '@/hooks/api/serviceOrders/useGetServiceOrder';

export const useCreateTaskFromServiceOrder = (serviceOrderId: string) => {
    const queryClient = useQueryClient();

    return useMutation<CreateTaskMutation, Error, CreateTaskMutationVariables>({
        mutationFn: (variables) => fetchClient(CreateTaskDocument, variables),
        onSuccess: () => {
            // Invalidar la lista de tareas
            queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
            // Invalidar el detalle de la orden de servicio para actualizar sus tareas relacionadas
            queryClient.invalidateQueries({
                queryKey: [...SERVICE_ORDER_QUERY_KEY, serviceOrderId],
            });
        },
    });
};
