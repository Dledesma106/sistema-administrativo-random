import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CITIES_QUERY_KEY } from './useGetCities';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateCityDocument,
    UpdateCityMutation,
    UpdateCityMutationVariables,
} from '@/api/graphql';

export const useUpdateCity = () => {
    const queryClient = useQueryClient();

    return useMutation<UpdateCityMutation, Error, UpdateCityMutationVariables>({
        mutationFn: (variables) => fetchClient(UpdateCityDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CITIES_QUERY_KEY] });
        },
    });
};
