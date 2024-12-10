import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { TaskByIdDocument } from '@/api/graphql';

export const TASK_DETAIL_QUERY_KEY = (id: string) => ['task', 'detail', id];

export const useGetTaskById = (id: string) => {
    return useQuery({
        queryKey: TASK_DETAIL_QUERY_KEY(id),
        queryFn: async () => {
            return fetchClient(TaskByIdDocument, { id });
        },
        enabled: !!id,
    });
};
