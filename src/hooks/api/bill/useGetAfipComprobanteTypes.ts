import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetAfipComprobanteTypesDocument,
    type GetAfipComprobanteTypesQuery,
} from '@/api/graphql';

export const AFIP_COMPROBANTE_TYPES_QUERY_KEY = 'afipComprobanteTypes';

export const useGetAfipComprobanteTypes = () => {
    return useQuery<GetAfipComprobanteTypesQuery>({
        queryKey: [AFIP_COMPROBANTE_TYPES_QUERY_KEY],
        queryFn: () => fetchClient(GetAfipComprobanteTypesDocument, {}),
        staleTime: 1000 * 60 * 60, // 1 hora - no cambia frecuentemente
    });
};
