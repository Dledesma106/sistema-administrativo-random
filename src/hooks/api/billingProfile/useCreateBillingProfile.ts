import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BILLING_PROFILES_QUERY_KEY } from './useGetBillingProfiles';
import { BUSINESSES_WITHOUT_BILLING_PROFILE_QUERY_KEY } from './useGetBusinessesWithoutBillingProfile';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateBillingProfileDocument,
    CreateBillingProfileMutation,
    CreateBillingProfileMutationVariables,
} from '@/api/graphql';

export const useCreateBillingProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<
        CreateBillingProfileMutation,
        Error,
        CreateBillingProfileMutationVariables
    >({
        mutationFn: (variables) => fetchClient(CreateBillingProfileDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BILLING_PROFILES_QUERY_KEY] });
            queryClient.invalidateQueries({
                queryKey: [BUSINESSES_WITHOUT_BILLING_PROFILE_QUERY_KEY],
            });
        },
    });
};
