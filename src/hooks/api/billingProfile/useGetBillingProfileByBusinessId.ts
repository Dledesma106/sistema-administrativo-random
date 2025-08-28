import { useQuery } from '@tanstack/react-query';

import { BILLING_PROFILES_QUERY_KEY } from './useGetBillingProfiles';

import { fetchClient } from '@/api/fetch-client';
import {
    GetBillingProfileByBusinessIdDocument,
    GetBillingProfileByBusinessIdQuery,
} from '@/api/graphql';

export const useGetBillingProfileByBusinessId = (businessId: string) => {
    return useQuery<GetBillingProfileByBusinessIdQuery>({
        queryKey: [BILLING_PROFILES_QUERY_KEY, 'byBusinessId', businessId],
        queryFn: () => fetchClient(GetBillingProfileByBusinessIdDocument, { businessId }),
        enabled: !!businessId,
    });
};
