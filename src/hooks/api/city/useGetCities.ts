import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetCitiesDocument,
    GetCitiesQuery,
    GetCitiesQueryVariables,
} from '@/api/graphql';

export const CITIES_QUERY_KEY = 'cities';

export const useGetCities = (variables: GetCitiesQueryVariables) => {
    return useQuery<GetCitiesQuery>({
        queryKey: [CITIES_QUERY_KEY, variables],
        queryFn: () => fetchClient(GetCitiesDocument, variables),
    });
};
