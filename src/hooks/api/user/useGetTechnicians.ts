import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetTechniciansDocument,
    GetTechniciansQuery,
    GetTechniciansQueryVariables,
} from '@/api/graphql';

export const TECHNICIANS_QUERY_KEY = 'technicians';

export const useGetTechnicians = (variables: GetTechniciansQueryVariables) => {
    return useQuery<GetTechniciansQuery>({
        queryKey: [TECHNICIANS_QUERY_KEY],
        queryFn: () => fetchClient(GetTechniciansDocument, variables),
    });
};
