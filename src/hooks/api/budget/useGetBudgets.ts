import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetBudgetsDocument,
    GetBudgetsQuery,
    GetBudgetsQueryVariables,
} from '@/api/graphql';

export const BUDGETS_QUERY_KEY = 'budgets';

export const useGetBudgets = (variables: GetBudgetsQueryVariables) => {
    return useQuery<GetBudgetsQuery>({
        queryKey: [BUDGETS_QUERY_KEY, variables],
        queryFn: () => fetchClient(GetBudgetsDocument, variables),
    });
};
