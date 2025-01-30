import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CITIES_QUERY_KEY } from './useGetCities';

import { fetchClient } from '@/api/fetch-client';
import {
    DeleteCityDocument,
    DeleteCityMutation,
    DeleteCityMutationVariables,
} from '@/api/graphql';

export const useDeleteCity = () => {
    const queryClient = useQueryClient();

    return useMutation<DeleteCityMutation, Error, DeleteCityMutationVariables>({
        mutationFn: (variables) => fetchClient(DeleteCityDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CITIES_QUERY_KEY] });
        },
    });
};
