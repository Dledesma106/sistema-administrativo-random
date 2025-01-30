import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PREVENTIVES_QUERY_KEY } from './useGetPreventives';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdatePreventiveDocument,
    UpdatePreventiveMutation,
    UpdatePreventiveMutationVariables,
} from '@/api/graphql';

export const useUpdatePreventive = () => {
    const queryClient = useQueryClient();

    return useMutation<
        UpdatePreventiveMutation,
        Error,
        UpdatePreventiveMutationVariables
    >({
        mutationFn: (variables) => fetchClient(UpdatePreventiveDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PREVENTIVES_QUERY_KEY] });
        },
    });
};
