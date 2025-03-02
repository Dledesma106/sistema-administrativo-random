import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PREVENTIVES_QUERY_KEY } from './useGetPreventives';

import { fetchClient } from '@/api/fetch-client';
import {
    DeletePreventiveDocument,
    DeletePreventiveMutation,
    DeletePreventiveMutationVariables,
} from '@/api/graphql';

export const useDeletePreventive = () => {
    const queryClient = useQueryClient();

    return useMutation<
        DeletePreventiveMutation,
        Error,
        DeletePreventiveMutationVariables
    >({
        mutationFn: (variables) => fetchClient(DeletePreventiveDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PREVENTIVES_QUERY_KEY] });
        },
    });
};
