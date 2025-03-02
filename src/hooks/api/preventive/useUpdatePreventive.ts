import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PREVENTIVE_QUERY_KEY } from './useGetPreventive';
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
        onSuccess: (_, variables) => {
            // Invalidar la lista de preventivos
            queryClient.invalidateQueries({ queryKey: [PREVENTIVES_QUERY_KEY] });
            // Invalidar el preventivo específico
            queryClient.invalidateQueries({
                queryKey: [PREVENTIVE_QUERY_KEY, variables.id],
            });
        },
    });
};
