import { useMutation, useQueryClient } from '@tanstack/react-query';

import { USERS_QUERY_KEY } from './useGetUsers';

import { fetchClient } from '@/api/fetch-client';
import {
    DeleteUserDocument,
    DeleteUserMutation,
    DeleteUserMutationVariables,
} from '@/api/graphql';

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation<DeleteUserMutation, Error, DeleteUserMutationVariables>({
        mutationFn: (variables) => fetchClient(DeleteUserDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
        },
    });
};
