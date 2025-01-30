import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetClientsWithBranchesDocument,
    GetClientsWithBranchesQuery,
    GetClientsWithBranchesQueryVariables,
} from '@/api/graphql';

export const CLIENTS_WITH_BRANCHES_QUERY_KEY = 'clients-with-branches';

export const useGetClientsWithBranches = (
    variables: GetClientsWithBranchesQueryVariables,
) => {
    return useQuery<GetClientsWithBranchesQuery>({
        queryKey: [CLIENTS_WITH_BRANCHES_QUERY_KEY],
        queryFn: () => fetchClient(GetClientsWithBranchesDocument, variables),
    });
};
