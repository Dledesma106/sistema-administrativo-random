import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetBilledServiceOrdersDocument,
    type GetBilledServiceOrdersQuery,
    type GetBilledServiceOrdersQueryVariables,
} from '@/api/graphql';

export const BILLED_SERVICE_ORDERS_QUERY_KEY = 'billedServiceOrders';

export const useGetBilledServiceOrders = (
    variables: GetBilledServiceOrdersQueryVariables = {},
) => {
    const { skip = 0, take = 20, orderBy, orderDirection, ...filters } = variables;

    return useQuery<GetBilledServiceOrdersQuery>({
        queryKey: [
            BILLED_SERVICE_ORDERS_QUERY_KEY,
            skip,
            take,
            orderBy,
            orderDirection,
            filters,
        ],
        queryFn: () =>
            fetchClient(GetBilledServiceOrdersDocument, {
                skip,
                take,
                orderBy,
                orderDirection,
                ...filters,
            }),
        refetchOnMount: true,
    });
};
