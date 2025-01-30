import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CLIENTS_QUERY_KEY } from './useGetClients';

import { fetchClient } from '@/api/fetch-client';
import {
    DeleteClientDocument,
    DeleteClientMutation,
    DeleteClientMutationVariables,
} from '@/api/graphql';

export const useDeleteClient = () => {
    const queryClient = useQueryClient();

    return useMutation<DeleteClientMutation, Error, DeleteClientMutationVariables>({
        mutationFn: (variables) => fetchClient(DeleteClientDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
        },
    });
};
