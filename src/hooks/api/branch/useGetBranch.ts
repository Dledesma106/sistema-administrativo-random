import { useQuery } from '@tanstack/react-query';

import { BRANCHES_QUERY_KEY } from './useGetBranches';

import { fetchClient } from '@/api/fetch-client';
import { GetBranchDocument, GetBranchQuery } from '@/api/graphql';

export const useGetBranch = (id?: string) => {
    return useQuery<GetBranchQuery>({
        queryKey: [BRANCHES_QUERY_KEY, id],
        queryFn: () => {
            if (!id) {
                throw new Error('ID de sucursal requerido');
            }
            return fetchClient(GetBranchDocument, { id });
        },
        enabled: !!id,
    });
};
