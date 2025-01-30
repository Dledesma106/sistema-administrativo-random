import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetProvincesDocument,
    GetProvincesQuery,
    GetProvincesQueryVariables,
} from '@/api/graphql';

export const PROVINCES_QUERY_KEY = 'provinces';

export const useGetProvinces = (variables: GetProvincesQueryVariables) => {
    return useQuery<GetProvincesQuery>({
        queryKey: [PROVINCES_QUERY_KEY],
        queryFn: () => fetchClient(GetProvincesDocument, variables),
    });
};
