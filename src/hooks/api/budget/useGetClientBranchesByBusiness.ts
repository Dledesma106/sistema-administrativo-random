import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetClientBranchesByBusinessDocument,
    GetClientBranchesByBusinessQuery,
    GetClientBranchesByBusinessQueryVariables,
} from '@/api/graphql';

export const CLIENT_BRANCHES_BY_BUSINESS_QUERY_KEY = 'clientBranchesByBusiness';

export const useGetClientBranchesByBusiness = (
    variables: GetClientBranchesByBusinessQueryVariables,
) => {
    return useQuery<GetClientBranchesByBusinessQuery>({
        queryKey: [
            CLIENT_BRANCHES_BY_BUSINESS_QUERY_KEY,
            variables.clientId,
            variables.businessId,
        ],
        queryFn: () => fetchClient(GetClientBranchesByBusinessDocument, variables),
        enabled: !!variables.clientId && !!variables.businessId,
    });
};
