import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    TaskByIdQuery,
    UpdateExpenseStatusDocument,
    UpdateExpenseStatusMutation,
    UpdateExpenseStatusMutationVariables,
} from '@/api/graphql';

import { TASK_DETAIL_QUERY_KEY } from '../tasks/useGetTaskById';

export const useUpdateExpenseStatus = () => {
    const client = useQueryClient();

    return useMutation<
        UpdateExpenseStatusMutation,
        Error,
        UpdateExpenseStatusMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(UpdateExpenseStatusDocument, data);
        },
        onSuccess: (data) => {
            const task = data.updateExpenseStatus.expense?.task;
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
