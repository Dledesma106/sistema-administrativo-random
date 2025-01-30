import { useMutation } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    ChangePasswordDocument,
    ChangePasswordMutation,
    ChangePasswordMutationVariables,
} from '@/api/graphql';

export const useChangePassword = () => {
    return useMutation<ChangePasswordMutation, Error, ChangePasswordMutationVariables>({
        mutationFn: (variables) => fetchClient(ChangePasswordDocument, variables),
    });
};
