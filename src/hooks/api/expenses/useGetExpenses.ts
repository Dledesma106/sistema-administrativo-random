import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { GetExpensesDocument, GetExpensesQueryVariables } from '@/api/graphql';

export const EXPENSES_LIST_QUERY_KEY = ['expenses'];

export const useGetExpenses = (params: GetExpensesQueryVariables) => {
    const { skip = 0, take = 10, ...filters } = params;

    return useQuery({
        queryKey: [...EXPENSES_LIST_QUERY_KEY, skip, take, filters],
        queryFn: () =>
            fetchClient(GetExpensesDocument, {
                skip,
                take,
                ...filters,
            }),
    });
};
