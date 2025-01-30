import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { GetExpensesDocument, GetExpensesQueryVariables } from '@/api/graphql';

export const EXPENSES_LIST_QUERY_KEY = ['expenses'];

export const useGetExpenses = (variables: GetExpensesQueryVariables) => {
    return useQuery({
        queryKey: EXPENSES_LIST_QUERY_KEY,
        queryFn: () => fetchClient(GetExpensesDocument, variables),
    });
};
