import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CLIENTS_QUERY_KEY } from './useGetClients';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateClientDocument,
    UpdateClientMutation,
    UpdateClientMutationVariables,
} from '@/api/graphql';

export const useUpdateClient = () => {
    const queryClient = useQueryClient();

    return useMutation<UpdateClientMutation, Error, UpdateClientMutationVariables>({
        mutationFn: (variables) => fetchClient(UpdateClientDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
        },
    });
};
