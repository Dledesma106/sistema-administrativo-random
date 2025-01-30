import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { GetExpenseDocument } from '@/api/graphql';

export const EXPENSE_DETAIL_QUERY_KEY = (id: string) => ['expenses', 'detail', id];

export const useGetExpense = (id: string) => {
    return useQuery({
        queryKey: EXPENSE_DETAIL_QUERY_KEY(id),
        queryFn: () => fetchClient(GetExpenseDocument, { id }),
        enabled: !!id,
    });
};
