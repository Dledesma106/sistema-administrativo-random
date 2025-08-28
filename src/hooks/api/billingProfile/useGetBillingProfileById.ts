import { useQuery } from '@tanstack/react-query';

import { BILLING_PROFILES_QUERY_KEY } from './useGetBillingProfiles';

import { fetchClient } from '@/api/fetch-client';
import { GetBillingProfileByIdDocument, GetBillingProfileByIdQuery } from '@/api/graphql';

export const useGetBillingProfileById = (id: string) => {
    return useQuery<GetBillingProfileByIdQuery>({
        queryKey: [BILLING_PROFILES_QUERY_KEY, id],
        queryFn: () => fetchClient(GetBillingProfileByIdDocument, { id }),
        enabled: !!id,
    });
};
