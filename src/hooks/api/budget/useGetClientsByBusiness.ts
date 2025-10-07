import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetClientsByBusinessDocument,
    GetClientsByBusinessQuery,
    GetClientsByBusinessQueryVariables,
} from '@/api/graphql';

export const CLIENTS_BY_BUSINESS_QUERY_KEY = 'clientsByBusiness';

export const useGetClientsByBusiness = (
    variables: GetClientsByBusinessQueryVariables,
) => {
    return useQuery<GetClientsByBusinessQuery>({
        queryKey: [CLIENTS_BY_BUSINESS_QUERY_KEY, variables.businessId, variables.search],
        queryFn: () => fetchClient(GetClientsByBusinessDocument, variables),
        enabled: !!variables.businessId,
    });
};
