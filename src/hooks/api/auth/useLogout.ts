import { useMutation } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { LogoutDocument, LogoutMutation, LogoutMutationVariables } from '@/api/graphql';

export const useLogout = (variables: LogoutMutationVariables) => {
    return useMutation<LogoutMutation, Error>({
        mutationFn: () => fetchClient(LogoutDocument, variables),
    });
};
