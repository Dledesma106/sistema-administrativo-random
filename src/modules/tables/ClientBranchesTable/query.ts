import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { BranchesOfClientDocument, BranchesOfClientQueryVariables } from '@/api/graphql';

export const CLIENT_BRANCHES_LIST_QUERY_KEY_DOMAIN = 'branches';

export const CLIENT_BRANCHES_LIST_QUERY_KEY = (
    variables: BranchesOfClientQueryVariables,
) => [CLIENT_BRANCHES_LIST_QUERY_KEY_DOMAIN, variables];

export const useClientBranchesListQuery = (variables: BranchesOfClientQueryVariables) => {
    return useQuery({
        queryKey: CLIENT_BRANCHES_LIST_QUERY_KEY(variables),
        queryFn: () => fetchClient(BranchesOfClientDocument, variables),
    });
};
