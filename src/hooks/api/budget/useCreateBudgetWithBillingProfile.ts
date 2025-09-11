import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BUDGETS_QUERY_KEY } from './useGetBudgets';

import { fetchClient } from '@/api/fetch-client';
import type {
    CreateBudgetWithBillingProfileMutation,
    CreateBudgetWithBillingProfileMutationVariables,
} from '@/api/graphql';
import { CreateBudgetWithBillingProfileDocument } from '@/api/graphql';

export const useCreateBudgetWithBillingProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<
        CreateBudgetWithBillingProfileMutation,
        Error,
        CreateBudgetWithBillingProfileMutationVariables
    >({
        mutationFn: (variables) =>
            fetchClient(CreateBudgetWithBillingProfileDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BUDGETS_QUERY_KEY] });
        },
    });
};
