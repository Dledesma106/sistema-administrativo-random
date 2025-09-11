import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BUDGETS_QUERY_KEY } from './useGetBudgets';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateBudgetDocument,
    CreateBudgetMutation,
    CreateBudgetMutationVariables,
} from '@/api/graphql';

export const useCreateBudget = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateBudgetMutation, Error, CreateBudgetMutationVariables>({
        mutationFn: (variables) => fetchClient(CreateBudgetDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BUDGETS_QUERY_KEY] });
        },
    });
};
