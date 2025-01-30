import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetProvinceDocument,
    GetProvinceQuery,
    GetProvinceQueryVariables,
} from '@/api/graphql';

export const PROVINCE_QUERY_KEY = 'province';

export const useGetProvince = (variables: GetProvinceQueryVariables) => {
    return useQuery<GetProvinceQuery>({
        queryKey: [PROVINCE_QUERY_KEY, variables],
        queryFn: () => fetchClient(GetProvinceDocument, variables),
    });
};
