import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    ServiceOrdersDocument,
    type ServiceOrdersQuery,
    type ServiceOrdersQueryVariables,
} from '@/api/graphql';

export const SERVICE_ORDERS_QUERY_KEY = ['serviceOrders'] as const;

export const useGetServiceOrders = (params: Partial<ServiceOrdersQueryVariables>) => {
    const { skip = 0, take = 10, orderBy, orderDirection, ...filters } = params;

    // Construir las variables filtrando undefined
    const variables: ServiceOrdersQueryVariables = {
        skip,
        take,
    } as ServiceOrdersQueryVariables;

    if (orderBy) {
        variables.orderBy = orderBy;
    }
    if (orderDirection) {
        variables.orderDirection = orderDirection;
    }
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
            (variables as any)[key] = value;
        }
    });

    return useQuery<ServiceOrdersQuery>({
        queryKey: [
            ...SERVICE_ORDERS_QUERY_KEY,
            skip,
            take,
            orderBy,
            orderDirection,
            filters,
        ],
        queryFn: () => fetchClient(ServiceOrdersDocument, variables),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
};
