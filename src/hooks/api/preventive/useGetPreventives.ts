import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetPreventivesDocument,
    GetPreventivesQuery,
    GetPreventivesQueryVariables,
} from '@/api/graphql';

export const PREVENTIVES_QUERY_KEY = 'preventives';

export const useGetPreventives = (variables: GetPreventivesQueryVariables) => {
    return useQuery<GetPreventivesQuery>({
        queryKey: [PREVENTIVES_QUERY_KEY],
        queryFn: () => fetchClient(GetPreventivesDocument, variables),
    });
};
