import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetBudgetByIdDocument,
    GetBudgetByIdQuery,
    GetBudgetByIdQueryVariables,
} from '@/api/graphql';

export const BUDGET_BY_ID_QUERY_KEY = 'budgetById';

export const useGetBudgetById = (variables: GetBudgetByIdQueryVariables) => {
    return useQuery<GetBudgetByIdQuery>({
        queryKey: [BUDGET_BY_ID_QUERY_KEY, variables.id],
        queryFn: () => fetchClient(GetBudgetByIdDocument, variables),
        enabled: !!variables.id,
    });
};
