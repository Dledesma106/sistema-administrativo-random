import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-root-toast';

import { fetchClient } from '@/api/fetch-client';
import {
    DeleteExpenseDocument,
    DeleteExpenseMutation,
    DeleteExpenseMutationVariables,
    GetExpensesQuery,
    GetTaskQuery,
} from '@/api/graphql';

import { TASK_DETAIL_QUERY_KEY } from '../tasks/useGetTask';

export const useDeleteExpense = (id: string) => {
    const client = useQueryClient();
    return useMutation<DeleteExpenseMutation, Error, DeleteExpenseMutationVariables>({
        mutationFn: () =>
            fetchClient(DeleteExpenseDocument, {
                id,
                taskId: '',
            }),
        onSuccess: (data, { taskId }) => {
            if (!data) {
                return;
            }

            const {
                deleteExpense: { expense: newExpense },
            } = data;

            if (taskId) {
                client.setQueryData<GetTaskQuery>(
                    TASK_DETAIL_QUERY_KEY(taskId),
                    (oldData) => {
                        if (!oldData || !oldData.taskById) {
                            return oldData;
                        }
                        if (!newExpense) {
                            return oldData;
                        }
                        const newData: GetTaskQuery = {
                            ...oldData,
                            taskById: {
                                ...oldData.taskById,
                                expenses: oldData.taskById.expenses.filter(
                                    (expense) => expense.id !== newExpense.id,
                                ),
                            },
                        };
                        return newData;
                    },
                );
            } else {
                client.setQueryData<GetExpensesQuery>(['expenses'], (oldData) => {
                    if (!oldData || !oldData.expenses) {
                        return oldData;
                    }
                    if (!newExpense) {
                        return oldData;
                    }
                    const newData: GetExpensesQuery = {
                        ...oldData,
                        expenses: [
                            ...oldData.expenses.filter(
                                (expense) => expense.id !== newExpense.id,
                            ),
                        ],
                    };
                    return newData;
                });
            }
            Toast.show('Gasto Eliminado', {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
            });
        },
        onError: (error) => {
            Toast.show(`Ocurrió un error: ${error}`, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
            });
        },
    });
};
