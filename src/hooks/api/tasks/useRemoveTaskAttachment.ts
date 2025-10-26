import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASK_DETAIL_QUERY_KEY } from './useGetTask';

import { fetchClient } from '@/api/fetch-client';
import {
    RemoveTaskAttachmentDocument,
    RemoveTaskAttachmentMutation,
    RemoveTaskAttachmentMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useRemoveTaskAttachment = () => {
    const client = useQueryClient();
    const { triggerAlert } = useAlert();

    return useMutation<
        RemoveTaskAttachmentMutation,
        Error,
        RemoveTaskAttachmentMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(RemoveTaskAttachmentDocument, data);
        },
        onSuccess: (data) => {
            const taskId = data.removeTaskAttachment.task?.id ?? '';

            // Invalidar la query específica de la tarea
            client.invalidateQueries({
                queryKey: TASK_DETAIL_QUERY_KEY(taskId),
            });

            // También invalidar todas las queries relacionadas con tareas
            client.invalidateQueries({
                queryKey: ['tasks'],
            });

            // Forzar un refetch inmediato
            client.refetchQueries({
                queryKey: TASK_DETAIL_QUERY_KEY(taskId),
            });

            triggerAlert({
                type: 'Success',
                message: 'Archivo adjunto eliminado correctamente',
            });
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `Error: ${error}`,
            });
        },
    });
};
