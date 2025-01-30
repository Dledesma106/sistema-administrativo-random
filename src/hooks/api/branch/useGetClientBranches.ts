import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetClientBranchesDocument,
    GetClientBranchesQuery,
    GetClientBranchesQueryVariables,
} from '@/api/graphql';

export const CLIENT_BRANCHES_QUERY_KEY = 'client-branches';

export const useGetClientBranches = (variables: GetClientBranchesQueryVariables) => {
    return useQuery<GetClientBranchesQuery>({
        queryKey: [CLIENT_BRANCHES_QUERY_KEY, variables],
        queryFn: () => fetchClient(GetClientBranchesDocument, variables),
    });
};
