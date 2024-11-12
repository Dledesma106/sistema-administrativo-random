import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { ClientBranchesDocument, ClientBranchesQueryVariables } from '@/api/graphql';

export const CLIENT_BRANCHES_LIST_QUERY_KEY_DOMAIN = 'branches';

export const CLIENT_BRANCHES_LIST_QUERY_KEY = (
    variables: ClientBranchesQueryVariables,
) => [CLIENT_BRANCHES_LIST_QUERY_KEY_DOMAIN, variables];

export const useClientBranchesListQuery = (variables: ClientBranchesQueryVariables) => {
    return useQuery({
        queryKey: CLIENT_BRANCHES_LIST_QUERY_KEY(variables),
        queryFn: () => fetchClient(ClientBranchesDocument, variables),
    });
};
