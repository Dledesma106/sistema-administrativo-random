import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { GetTaskDocument } from '@/api/graphql';

export const TASK_DETAIL_QUERY_KEY = (id: string) => ['task', 'detail', id];

export const useGetTask = (id: string) => {
    return useQuery({
        queryKey: TASK_DETAIL_QUERY_KEY(id),
        queryFn: async () => {
            return fetchClient(GetTaskDocument, { id });
        },
        enabled: !!id,
    });
};
