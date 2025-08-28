import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetBusinessesWithoutBillingProfileDocument,
    GetBusinessesWithoutBillingProfileQuery,
    GetBusinessesWithoutBillingProfileQueryVariables,
} from '@/api/graphql';

export const BUSINESSES_WITHOUT_BILLING_PROFILE_QUERY_KEY =
    'businessesWithoutBillingProfile';

export const useGetBusinessesWithoutBillingProfile = (
    variables: GetBusinessesWithoutBillingProfileQueryVariables,
) => {
    return useQuery<GetBusinessesWithoutBillingProfileQuery>({
        queryKey: [BUSINESSES_WITHOUT_BILLING_PROFILE_QUERY_KEY, variables],
        queryFn: () => fetchClient(GetBusinessesWithoutBillingProfileDocument, variables),
    });
};
