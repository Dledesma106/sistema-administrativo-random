import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetBusinessesDocument,
    GetBusinessesQuery,
    GetBusinessesQueryVariables,
} from '@/api/graphql';

export const BUSINESSES_QUERY_KEY = 'businesses';

export const useGetBusinesses = (variables: GetBusinessesQueryVariables) => {
    return useQuery<GetBusinessesQuery>({
        queryKey: [BUSINESSES_QUERY_KEY],
        queryFn: () => fetchClient(GetBusinessesDocument, variables),
    });
};
