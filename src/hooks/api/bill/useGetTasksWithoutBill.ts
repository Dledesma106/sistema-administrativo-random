import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GetTasksWithoutBillDocument,
    type GetTasksWithoutBillQuery,
    type GetTasksWithoutBillQueryVariables,
} from '@/api/graphql';

export const TASKS_WITHOUT_BILL_QUERY_KEY = 'tasksWithoutBill';

type UseGetTasksWithoutBillOptions = GetTasksWithoutBillQueryVariables & {
    enabled?: boolean;
};

export const useGetTasksWithoutBill = (options: UseGetTasksWithoutBillOptions = {}) => {
    const { skip = 0, take = 50, enabled = true, ...filters } = options;

    return useQuery<GetTasksWithoutBillQuery>({
        queryKey: [TASKS_WITHOUT_BILL_QUERY_KEY, skip, take, filters],
        queryFn: () =>
            fetchClient(GetTasksWithoutBillDocument, {
                skip,
                take,
                ...filters,
            }),
        refetchOnMount: true,
        enabled,
    });
};
