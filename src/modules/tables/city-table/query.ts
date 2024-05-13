import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { CitiesDocument, CitiesQueryVariables } from '@/api/graphql';

export const CITIES_LIST_QUERY_KEY_DOMAIN = 'cities';

export const CITIES_LIST_QUERY_KEY = (variables: CitiesQueryVariables) => [
    CITIES_LIST_QUERY_KEY_DOMAIN,
    variables,
];

export const useCitiesListQuery = (variables: CitiesQueryVariables) => {
    return useQuery({
        queryKey: CITIES_LIST_QUERY_KEY(variables),
        queryFn: () => fetchClient(CitiesDocument, variables),
    });
};
