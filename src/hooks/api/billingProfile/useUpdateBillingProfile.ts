import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BILLING_PROFILES_QUERY_KEY } from './useGetBillingProfiles';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateBillingProfileDocument,
    UpdateBillingProfileMutation,
    UpdateBillingProfileMutationVariables,
} from '@/api/graphql';

export const useUpdateBillingProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<
        UpdateBillingProfileMutation,
        Error,
        UpdateBillingProfileMutationVariables
    >({
        mutationFn: (variables) => fetchClient(UpdateBillingProfileDocument, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BILLING_PROFILES_QUERY_KEY] });
        },
    });
};
