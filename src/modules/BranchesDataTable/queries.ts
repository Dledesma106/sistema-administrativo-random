import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { BranchesDocument, BranchesQueryVariables } from '@/api/graphql';

export const BRANCHES_LIST_QUERY_KEY = ['branches'];

export const useBranchesListQuery = (variables: BranchesQueryVariables) => {
    return useQuery({
        queryKey: BRANCHES_LIST_QUERY_KEY,
        queryFn: () => fetchClient(BranchesDocument, variables),
    });
};
