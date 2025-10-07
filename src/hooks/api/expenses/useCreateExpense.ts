import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateExpenseDocument,
    CreateExpenseMutation,
    CreateExpenseMutationVariables,
} from '@/api/graphql';

export const useCreateExpense = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateExpenseMutation, Error, CreateExpenseMutationVariables>({
        mutationFn: (variables) => fetchClient(CreateExpenseDocument, variables),
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
