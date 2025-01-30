import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EXPENSE_DETAIL_QUERY_KEY } from './useGetExpense';

import { fetchClient } from '@/api/fetch-client';
import {
    GetTaskQuery,
    UpdateExpenseStatusDocument,
    UpdateExpenseStatusMutation,
    UpdateExpenseStatusMutationVariables,
} from '@/api/graphql';
import useAlert from '@/context/alertContext/useAlert';

import { TASK_DETAIL_QUERY_KEY } from '../tasks/useGetTask';

export const useUpdateExpenseStatus = () => {
    const client = useQueryClient();
    const { triggerAlert } = useAlert();
    return useMutation<
        UpdateExpenseStatusMutation,
        Error,
        UpdateExpenseStatusMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(UpdateExpenseStatusDocument, data);
        },
        onSuccess: (data) => {
            client.invalidateQueries({
                queryKey: EXPENSE_DETAIL_QUERY_KEY(
                    data.updateExpenseStatus.expense?.id ?? '',
                ),
            });
            triggerAlert({
                type: 'Success',
                message: 'Gasto actualizado correctamente',
            });
            const task = data.updateExpenseStatus.expense?.task;
            if (!task) {
                return;
            }

            const expenses = task.expenses;

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
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: `Error: ${error}`,
            });
        },
    });
};
