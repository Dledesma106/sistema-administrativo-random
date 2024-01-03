import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASK_DETAIL_QUERY_KEY } from './query';

import { fetchClient } from '@/api/fetch-client';
import {
    TaskByIdQuery,
    UpdateTaskExpenseStatusDocument,
    UpdateTaskExpenseStatusMutation,
    UpdateTaskExpenseStatusMutationVariables,
} from '@/api/graphql';

export const useUpdateTaskExpenseStatusMutation = () => {
    const client = useQueryClient();

    return useMutation<
        UpdateTaskExpenseStatusMutation,
        Error,
        UpdateTaskExpenseStatusMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(UpdateTaskExpenseStatusDocument, data);
        },
        onSuccess: (data) => {
            const task = data.updateTaskExpenseStatus.task;
            if (!task) {
                return;
            }

            const expenses = task.expenses;

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
                            expenses: oldData.taskById.expenses
                                .filter((expense) => {
                                    return expenses.find((e) => e.id === expense.id);
                                })
                                .map((expense) => {
                                    const updatedExpenseData = expenses.find(
                                        (e) => e.id === expense.id,
                                    )!;

                                    return {
                                        ...expense,
                                        status: updatedExpenseData.status,
                                    };
                                }),
                        },
                    };

                    return nextData;
                },
            );
        },
    });
};
