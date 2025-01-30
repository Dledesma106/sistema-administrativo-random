import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PROVINCES_QUERY_KEY } from './useGetProvinces';

import { fetchClient } from '@/api/fetch-client';
import {
    DeleteProvinceDocument,
    DeleteProvinceMutation,
    DeleteProvinceMutationVariables,
} from '@/api/graphql';

export const useDeleteProvince = () => {
    const queryClient = useQueryClient();

    return useMutation<DeleteProvinceMutation, Error, DeleteProvinceMutationVariables>({
        mutationFn: (variables) => fetchClient(DeleteProvinceDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROVINCES_QUERY_KEY] });
        },
    });
};
