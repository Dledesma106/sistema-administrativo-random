import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetBillingProfilesDocument,
    GetBillingProfilesQuery,
    GetBillingProfilesQueryVariables,
} from '@/api/graphql';

export const BILLING_PROFILES_QUERY_KEY = 'billingProfiles';

export const useGetBillingProfiles = (variables: GetBillingProfilesQueryVariables) => {
    return useQuery<GetBillingProfilesQuery>({
        queryKey: [BILLING_PROFILES_QUERY_KEY, variables],
        queryFn: () => fetchClient(GetBillingProfilesDocument, variables),
    });
};
