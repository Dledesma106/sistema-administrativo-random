import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetClientsDocument,
    GetClientsQuery,
    GetClientsQueryVariables,
} from '@/api/graphql';

export const CLIENTS_QUERY_KEY = 'clients';

export const useGetClients = (variables: GetClientsQueryVariables) => {
    return useQuery<GetClientsQuery>({
        queryKey: [CLIENTS_QUERY_KEY],
        queryFn: () => fetchClient(GetClientsDocument, variables),
    });
};
