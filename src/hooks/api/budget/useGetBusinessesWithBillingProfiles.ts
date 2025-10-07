import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetBusinessesWithBillingProfilesDocument,
    GetBusinessesWithBillingProfilesQuery,
    GetBusinessesWithBillingProfilesQueryVariables,
} from '@/api/graphql';

export const BUSINESSES_WITH_BILLING_PROFILES_QUERY_KEY = 'businessesWithBillingProfiles';

export const useGetBusinessesWithBillingProfiles = (
    variables: GetBusinessesWithBillingProfilesQueryVariables,
) => {
    return useQuery<GetBusinessesWithBillingProfilesQuery>({
        queryKey: [BUSINESSES_WITH_BILLING_PROFILES_QUERY_KEY, variables],
        queryFn: () => fetchClient(GetBusinessesWithBillingProfilesDocument, variables),
    });
};
