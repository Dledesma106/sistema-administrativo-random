import { useMutation } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    SendNewUserRandomPasswordDocument,
    SendNewUserRandomPasswordMutation,
    SendNewUserRandomPasswordMutationVariables,
} from '@/api/graphql';

export const useSendNewUserRandomPasswordMutation = () => {
    return useMutation<
        SendNewUserRandomPasswordMutation,
        Error,
        SendNewUserRandomPasswordMutationVariables
    >({
        mutationFn: (data) => fetchClient(SendNewUserRandomPasswordDocument, data),
    });
};