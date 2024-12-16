import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { ExpenseByIdDocument } from '@/api/graphql';

export const EXPENSE_DETAIL_QUERY_KEY = (id: string) => ['expenses', 'detail', id];

export const useGetExpenseById = (id: string) => {
    return useQuery({
        queryKey: EXPENSE_DETAIL_QUERY_KEY(id),
        queryFn: () => fetchClient(ExpenseByIdDocument, { id }),
        enabled: !!id,
    });
};
