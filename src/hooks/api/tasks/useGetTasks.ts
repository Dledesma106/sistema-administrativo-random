import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { TasksDocument, type TasksQuery, type TasksQueryVariables } from '@/api/graphql';

export const TASKS_QUERY_KEY = ['tasks'] as const;

export const useGetTasks = (params: TasksQueryVariables) => {
    return useQuery<TasksQuery>({
        queryKey: [TASKS_QUERY_KEY, params],
        queryFn: () => fetchClient(TasksDocument, params),
    });
};
