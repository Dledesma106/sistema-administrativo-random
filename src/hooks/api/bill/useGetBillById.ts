import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { GetBillByIdDocument, type GetBillByIdQuery } from '@/api/graphql';

export const BILL_DETAIL_QUERY_KEY = (id: string) => ['bill', id] as const;

export const useGetBillById = (id: string) => {
    return useQuery<GetBillByIdQuery>({
        queryKey: BILL_DETAIL_QUERY_KEY(id),
        queryFn: () => fetchClient(GetBillByIdDocument, { id }),
        enabled: !!id,
    });
};
