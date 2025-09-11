import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BUDGET_BY_ID_QUERY_KEY } from './useGetBudgetById';
import { BUDGETS_QUERY_KEY } from './useGetBudgets';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateBudgetDocument,
    UpdateBudgetMutation,
    UpdateBudgetMutationVariables,
} from '@/api/graphql';

export const useUpdateBudget = () => {
    const queryClient = useQueryClient();

    return useMutation<UpdateBudgetMutation, Error, UpdateBudgetMutationVariables>({
        mutationFn: (variables) => fetchClient(UpdateBudgetDocument, variables),
        onSuccess: (data, variables) => {
            // Invalidar la lista de presupuestos
            queryClient.invalidateQueries({ queryKey: [BUDGETS_QUERY_KEY] });

            // Invalidar el presupuesto específico
            queryClient.invalidateQueries({
                queryKey: [BUDGET_BY_ID_QUERY_KEY, variables.id],
            });
        },
    });
};
