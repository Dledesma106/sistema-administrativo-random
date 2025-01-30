import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CITIES_QUERY_KEY } from './useGetCities';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateCityDocument,
    CreateCityMutation,
    CreateCityMutationVariables,
} from '@/api/graphql';

export const useCreateCity = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateCityMutation, Error, CreateCityMutationVariables>({
        mutationFn: (variables) => fetchClient(CreateCityDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CITIES_QUERY_KEY] });
        },
    });
};
