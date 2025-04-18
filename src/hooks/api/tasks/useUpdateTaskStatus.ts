import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASK_DETAIL_QUERY_KEY } from './useGetTask';

import { fetchClient } from '@/api/fetch-client';
import {
    GetTaskQuery,
    UpdateTaskStatusDocument,
    UpdateTaskStatusMutation,
    UpdateTaskStatusMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

export const useUpdateTaskStatus = () => {
    const client = useQueryClient();
    const { triggerAlert } = useAlert();
    return useMutation<
        UpdateTaskStatusMutation,
        Error,
        UpdateTaskStatusMutationVariables
    >({
        mutationFn: (data) => fetchClient(UpdateTaskStatusDocument, data),
        onSuccess: (data) => {
            const serverResponse = data.updateTaskStatus;
            triggerAlert({
                type: serverResponse.success ? 'Success' : 'Failure',
                message: serverResponse.message || '',
            });
            const task = serverResponse.task;
            if (!task) {
                return;
            }

            client.setQueryData<GetTaskQuery>(
                TASK_DETAIL_QUERY_KEY(task.id),
                (oldData) => {
                    if (!oldData || !oldData.taskById) {
                        return oldData;
                    }

                    const nextData: GetTaskQuery = {
                        ...oldData,
                        taskById: {
                            ...oldData.taskById,
                            status: task.status,
                        },
                    };
                    return nextData;
                },
            );
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `Error: ${error}`,
            });
        },
    });
};
