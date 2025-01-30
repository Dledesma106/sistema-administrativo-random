import { useQuery } from '@tanstack/react-query';

import { BUSINESSES_QUERY_KEY } from './useGetBusinesses';

import { fetchClient } from '@/api/fetch-client';
import { GetBusinessDocument, GetBusinessQuery } from '@/api/graphql';

export const useGetBusinessById = (id: string) => {
    return useQuery<GetBusinessQuery>({
        queryKey: [BUSINESSES_QUERY_KEY, id],
        queryFn: () => fetchClient(GetBusinessDocument, { id }),
        enabled: !!id,
    });
};
