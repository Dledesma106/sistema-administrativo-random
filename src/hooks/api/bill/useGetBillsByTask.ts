import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { GetBillsByTaskDocument, type GetBillsByTaskQuery } from '@/api/graphql';

export const BILLS_BY_TASK_QUERY_KEY = (taskId: string) =>
    ['billsByTask', taskId] as const;

export const useGetBillsByTask = (taskId: string) => {
    return useQuery<GetBillsByTaskQuery>({
        queryKey: BILLS_BY_TASK_QUERY_KEY(taskId),
        queryFn: () => fetchClient(GetBillsByTaskDocument, { taskId }),
        enabled: !!taskId,
    });
};
