import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BUSINESSES_QUERY_KEY } from './useGetBusinesses';

import { fetchClient } from '@/api/fetch-client';
import {
    DeleteBusinessDocument,
    DeleteBusinessMutation,
    DeleteBusinessMutationVariables,
} from '@/api/graphql';

export const useDeleteBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation<DeleteBusinessMutation, Error, DeleteBusinessMutationVariables>({
        mutationFn: (variables) => fetchClient(DeleteBusinessDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BUSINESSES_QUERY_KEY] });
        },
    });
};
