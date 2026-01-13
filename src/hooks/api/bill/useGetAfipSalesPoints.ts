import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { GetAfipSalesPointsDocument, type GetAfipSalesPointsQuery } from '@/api/graphql';

export const AFIP_SALES_POINTS_QUERY_KEY = 'afipSalesPoints';

export const useGetAfipSalesPoints = () => {
    return useQuery<GetAfipSalesPointsQuery>({
        queryKey: [AFIP_SALES_POINTS_QUERY_KEY],
        queryFn: () => fetchClient(GetAfipSalesPointsDocument, {}),
        staleTime: 1000 * 60 * 60, // 1 hora - no cambia frecuentemente
    });
};
