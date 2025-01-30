import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PROVINCES_QUERY_KEY } from './useGetProvinces';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateProvinceDocument,
    UpdateProvinceMutation,
    UpdateProvinceMutationVariables,
} from '@/api/graphql';

export const useUpdateProvince = () => {
    const queryClient = useQueryClient();

    return useMutation<UpdateProvinceMutation, Error, UpdateProvinceMutationVariables>({
        mutationFn: (variables) => fetchClient(UpdateProvinceDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROVINCES_QUERY_KEY] });
        },
    });
};
