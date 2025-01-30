import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetClientDocument,
    GetClientQuery,
    GetClientQueryVariables,
} from '@/api/graphql';

export const CLIENT_QUERY_KEY = 'client';

export const useGetClient = (variables: GetClientQueryVariables) => {
    return useQuery<GetClientQuery>({
        queryKey: [CLIENT_QUERY_KEY, variables],
        queryFn: () => fetchClient(GetClientDocument, variables),
    });
};
