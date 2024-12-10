import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASK_DETAIL_QUERY_KEY } from './useGetTaskById';

import { fetchClient } from '@/api/fetch-client';
import {
    TaskByIdQuery,
    UpdateTaskStatusDocument,
    UpdateTaskStatusMutation,
    UpdateTaskStatusMutationVariables,
} from '@/api/graphql';

export const useUpdateTaskStatus = () => {
    const client = useQueryClient();
    return useMutation<
        UpdateTaskStatusMutation,
        Error,
        UpdateTaskStatusMutationVariables
    >({
        mutationFn: (data) => fetchClient(UpdateTaskStatusDocument, data),
        onSuccess: (data) => {
            const task = data.updateTaskStatus.task;
            if (!task) {
                return;
            }

            client.setQueryData<TaskByIdQuery>(
                TASK_DETAIL_QUERY_KEY(task.id),
                (oldData) => {
                    if (!oldData || !oldData.taskById) {
                        return oldData;
                    }

                    const nextData: TaskByIdQuery = {
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
    });
};
