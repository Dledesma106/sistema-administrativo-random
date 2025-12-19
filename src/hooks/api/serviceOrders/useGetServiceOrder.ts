import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { ServiceOrderDocument, type ServiceOrderQuery } from '@/api/graphql';

export const SERVICE_ORDER_QUERY_KEY = ['serviceOrder'] as const;

export const useGetServiceOrder = (id: string) => {
    return useQuery<ServiceOrderQuery>({
        queryKey: [...SERVICE_ORDER_QUERY_KEY, id],
        queryFn: () =>
            fetchClient(ServiceOrderDocument, {
                id,
            }),
        enabled: !!id,
    });
};
