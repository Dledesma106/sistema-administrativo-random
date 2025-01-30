import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PREVENTIVES_QUERY_KEY } from './useGetPreventives';

import { fetchClient } from '@/api/fetch-client';
import {
    CreatePreventiveDocument,
    CreatePreventiveMutation,
    CreatePreventiveMutationVariables,
} from '@/api/graphql';

export const useCreatePreventive = () => {
    const queryClient = useQueryClient();

    return useMutation<
        CreatePreventiveMutation,
        Error,
        CreatePreventiveMutationVariables
    >({
        mutationFn: (variables) => fetchClient(CreatePreventiveDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PREVENTIVES_QUERY_KEY] });
        },
    });
};
