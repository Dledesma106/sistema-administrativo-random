import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { GetCityDocument, GetCityQuery, GetCityQueryVariables } from '@/api/graphql';

export const CITY_QUERY_KEY = 'city';

export const useGetCity = (variables: GetCityQueryVariables) => {
    return useQuery<GetCityQuery>({
        queryKey: [CITY_QUERY_KEY, variables],
        queryFn: () => fetchClient(GetCityDocument, variables),
    });
};
