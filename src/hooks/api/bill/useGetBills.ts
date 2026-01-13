import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetBillsDocument,
    type GetBillsQuery,
    type GetBillsQueryVariables,
} from '@/api/graphql';

export const BILLS_QUERY_KEY = 'bills';

export const useGetBills = (variables: GetBillsQueryVariables = {}) => {
    const { skip = 0, take = 10, orderBy, orderDirection, ...filters } = variables;

    return useQuery<GetBillsQuery>({
        queryKey: [BILLS_QUERY_KEY, skip, take, orderBy, orderDirection, filters],
        queryFn: () =>
            fetchClient(GetBillsDocument, {
                skip,
                take,
                orderBy,
                orderDirection,
                ...filters,
            }),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
};
