import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BUSINESSES_QUERY_KEY } from './useGetBusinesses';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateBusinessDocument,
    UpdateBusinessMutation,
    UpdateBusinessMutationVariables,
} from '@/api/graphql';

export const useUpdateBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation<UpdateBusinessMutation, Error, UpdateBusinessMutationVariables>({
        mutationFn: (variables) => fetchClient(UpdateBusinessDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BUSINESSES_QUERY_KEY] });
        },
    });
};
