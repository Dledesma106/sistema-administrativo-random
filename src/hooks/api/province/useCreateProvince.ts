import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PROVINCES_QUERY_KEY } from './useGetProvinces';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateProvinceDocument,
    CreateProvinceMutation,
    CreateProvinceMutationVariables,
} from '@/api/graphql';

export const useCreateProvince = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateProvinceMutation, Error, CreateProvinceMutationVariables>({
        mutationFn: (variables) => fetchClient(CreateProvinceDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROVINCES_QUERY_KEY] });
        },
    });
};
