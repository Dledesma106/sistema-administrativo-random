import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CLIENTS_QUERY_KEY } from './useGetClients';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateClientDocument,
    CreateClientMutation,
    CreateClientMutationVariables,
} from '@/api/graphql';

export const useCreateClient = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateClientMutation, Error, CreateClientMutationVariables>({
        mutationFn: (variables) => fetchClient(CreateClientDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
        },
    });
};
