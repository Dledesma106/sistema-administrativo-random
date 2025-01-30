import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetPreventiveDocument,
    GetPreventiveQuery,
    GetPreventiveQueryVariables,
} from '@/api/graphql';

export const PREVENTIVE_QUERY_KEY = 'preventive';

export const useGetPreventive = (variables: GetPreventiveQueryVariables) => {
    return useQuery<GetPreventiveQuery>({
        queryKey: [PREVENTIVE_QUERY_KEY, variables],
        queryFn: () => fetchClient(GetPreventiveDocument, variables),
    });
};
