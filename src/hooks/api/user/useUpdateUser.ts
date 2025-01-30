import { useMutation, useQueryClient } from '@tanstack/react-query';

import { USERS_QUERY_KEY } from './useGetUsers';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateUserDocument,
    UpdateUserMutation,
    UpdateUserMutationVariables,
} from '@/api/graphql';

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<UpdateUserMutation, Error, UpdateUserMutationVariables>({
        mutationFn: (variables) => fetchClient(UpdateUserDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
        },
    });
};
