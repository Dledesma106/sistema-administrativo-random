import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASK_DETAIL_QUERY_KEY } from './useGetTask';
import { TASKS_QUERY_KEY } from './useGetTasks';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateTaskDocument,
    UpdateTaskMutation,
    UpdateTaskMutationVariables,
} from '@/api/graphql';
import { SERVICE_ORDER_QUERY_KEY } from '@/hooks/api/serviceOrders/useGetServiceOrder';

export const useUpdateTaskFromServiceOrder = (serviceOrderId: string) => {
    const queryClient = useQueryClient();

    return useMutation<UpdateTaskMutation, Error, UpdateTaskMutationVariables>({
        mutationFn: (variables) => fetchClient(UpdateTaskDocument, variables),
        onSuccess: (data) => {
            // Invalidar la lista de tareas
            queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
            // Invalidar el detalle de la orden de servicio para actualizar sus tareas relacionadas
            queryClient.invalidateQueries({
                queryKey: [...SERVICE_ORDER_QUERY_KEY, serviceOrderId],
            });
            // Invalidar el detalle de la tarea si existe
            if (data.updateTask.task?.id) {
                queryClient.invalidateQueries({
                    queryKey: TASK_DETAIL_QUERY_KEY(data.updateTask.task.id),
                });
            }
        },
    });
};
