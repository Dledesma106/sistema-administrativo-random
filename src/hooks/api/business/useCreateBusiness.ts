import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BUSINESSES_QUERY_KEY } from './useGetBusinesses';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateBusinessDocument,
    CreateBusinessMutation,
    CreateBusinessMutationVariables,
} from '@/api/graphql';

export const useCreateBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateBusinessMutation, Error, CreateBusinessMutationVariables>({
        mutationFn: (variables) => fetchClient(CreateBusinessDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BUSINESSES_QUERY_KEY] });
        },
    });
};
