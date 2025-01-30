import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetBranchesDocument,
    GetBranchesQuery,
    GetBranchesQueryVariables,
} from '@/api/graphql';

export const BRANCHES_QUERY_KEY = 'branches';

export const useGetBranches = (variables: GetBranchesQueryVariables) => {
    return useQuery<GetBranchesQuery>({
        queryKey: [BRANCHES_QUERY_KEY],
        queryFn: () => fetchClient(GetBranchesDocument, variables),
    });
};
