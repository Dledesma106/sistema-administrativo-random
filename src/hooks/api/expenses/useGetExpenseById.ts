import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { ExpenseByIdDocument } from '@/api/graphql';

export const useGetExpenseById = (id: string) => {
    return useQuery({
        queryKey: ['expenses', 'detail', id],
        queryFn: () => fetchClient(ExpenseByIdDocument, { id }),
        enabled: !!id,
    });
};
