import { useMutation, useQueryClient } from '@tanstack/react-query';

import { USERS_QUERY_KEY } from './useGetUsers';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateUserDocument,
    CreateUserMutation,
    CreateUserMutationVariables,
} from '@/api/graphql';

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateUserMutation, Error, CreateUserMutationVariables>({
        mutationFn: (variables) => fetchClient(CreateUserDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
        },
    });
};
