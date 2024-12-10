import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { ExpensesDocument, ExpensesQueryVariables } from '@/api/graphql';

export const EXPENSES_LIST_QUERY_KEY = ['expenses'];

export const useGetExpenses = (variables: ExpensesQueryVariables) => {
    return useQuery({
        queryKey: EXPENSES_LIST_QUERY_KEY,
        queryFn: () => fetchClient(ExpensesDocument, variables),
    });
};
