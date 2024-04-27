import { useMutation } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateUserDocument,
    CreateUserMutation,
    CreateUserMutationVariables,
    UpdateUserDocument,
    UpdateUserMutation,
    UpdateUserMutationVariables,
} from '@/api/graphql';

export const useCreateUserMutation = () => {
    return useMutation<CreateUserMutation, Error, CreateUserMutationVariables>({
        mutationFn: (data) => fetchClient(CreateUserDocument, data),
    });
};

export const useUpdateUserMutation = () => {
    return useMutation<UpdateUserMutation, Error, UpdateUserMutationVariables>({
        mutationFn: (data) => fetchClient(UpdateUserDocument, data),
    });
};
