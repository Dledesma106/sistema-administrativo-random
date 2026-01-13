import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetAfipNextVoucherNumberDocument,
    type GetAfipNextVoucherNumberQuery,
    type GetAfipNextVoucherNumberQueryVariables,
} from '@/api/graphql';

export const AFIP_NEXT_VOUCHER_NUMBER_QUERY_KEY = 'afipNextVoucherNumber';

export const useGetAfipNextVoucherNumber = (
    variables: GetAfipNextVoucherNumberQueryVariables,
) => {
    return useQuery<GetAfipNextVoucherNumberQuery>({
        queryKey: [
            AFIP_NEXT_VOUCHER_NUMBER_QUERY_KEY,
            variables.pointOfSale,
            variables.comprobanteType,
        ],
        queryFn: () => fetchClient(GetAfipNextVoucherNumberDocument, variables),
        enabled: !!variables.pointOfSale && !!variables.comprobanteType,
        refetchOnMount: true,
    });
};
