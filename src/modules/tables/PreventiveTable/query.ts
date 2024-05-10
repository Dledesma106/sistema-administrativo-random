import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { PreventivesTableDocument, PreventivesTableQueryVariables } from '@/api/graphql';

export const PREVENTIVES_LIST_QUERY_KEY_DOMAIN = 'preventives';

export const PREVENTIVES_LIST_QUERY_KEY = (variables: PreventivesTableQueryVariables) => [
    PREVENTIVES_LIST_QUERY_KEY_DOMAIN,
    variables,
];

export const usePreventivesListQuery = (variables: PreventivesTableQueryVariables) => {
    return useQuery({
        queryKey: PREVENTIVES_LIST_QUERY_KEY(variables),
        queryFn: () => fetchClient(PreventivesTableDocument, variables),
    });
};
