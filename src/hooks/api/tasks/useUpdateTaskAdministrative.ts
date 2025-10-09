import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASK_DETAIL_QUERY_KEY } from './useGetTask';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateTaskAdministrativeDocument,
    UpdateTaskAdministrativeMutation,
    UpdateTaskAdministrativeMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useUpdateTaskAdministrative = () => {
    const client = useQueryClient();
    const { triggerAlert } = useAlert();
    return useMutation<
        UpdateTaskAdministrativeMutation,
        Error,
        UpdateTaskAdministrativeMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(UpdateTaskAdministrativeDocument, data);
        },
        onSuccess: (data) => {
            client.invalidateQueries({
                queryKey: TASK_DETAIL_QUERY_KEY(
                    data.updateTaskAdministrative.task?.id ?? '',
                ),
            });
            triggerAlert({
                type: 'Success',
                message: 'Anotaciones administrativas actualizadas correctamente',
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
