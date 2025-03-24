import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ExpenseInput } from '@/api/graphql';

// Definimos manualmente los tipos para la mutación ya que no están generados automáticamente
type CreateExpenseMutation = {
    createExpense: {
        success: boolean;
        message?: string;
        expense?: {
            id: string;
            amount: number;
            expenseType: string;
            paySource: string;
            paySourceBank?: string | null;
            installments?: number | null;
            expenseDate: string;
            doneBy: string;
            cityName: string;
            observations?: string | null;
            expenseNumber: string;
            status: string;
        };
    };
};

type CreateExpenseMutationVariables = {
    taskId?: string;
    expenseData: ExpenseInput;
};

export const useCreateExpense = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateExpenseMutation, Error, CreateExpenseMutationVariables>({
        mutationFn: async (variables) => {
            const url =
                typeof window !== 'undefined'
                    ? `${window.location.origin}/api/graphql`
                    : '/api/graphql';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    query: `
                      mutation CreateExpense($taskId: String, $expenseData: ExpenseInput!) {
                        createExpense(taskId: $taskId, expenseData: $expenseData) {
                          success
                          message
                          expense {
                            id
                            amount
                            expenseType
                            paySource
                            paySourceBank
                            installments
                            expenseDate
                            doneBy
                            cityName
                            observations
                            expenseNumber
                            status
                          }
                        }
                      }
                    `,
                    variables,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error de red: ${response.status}`);
            }

            const json = await response.json();

            if (json.errors && json.errors.length > 0) {
                const firstError = json.errors[0];
                let message = firstError.message;

                const firstErrorSplitted = firstError.message.split('Error: ');
                if (firstErrorSplitted.length > 1) {
                    message = firstErrorSplitted.slice(1).join('');
                }

                throw new Error(message);
            }

            return json.data as CreateExpenseMutation;
        },
        onSuccess: () => {
            // Invalidar consultas relacionadas con gastos
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['expense'] });
            // También invalidar consultas de tareas si se está relacionando un gasto
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task'] });
        },
    });
};
