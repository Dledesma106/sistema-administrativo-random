import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { TasksDocument, type TasksQuery, type TasksQueryVariables } from '@/api/graphql';

export const TASKS_QUERY_KEY = ['tasks'] as const;

export const useGetTasks = (params: TasksQueryVariables) => {
    const { skip = 0, take = 10, ...filters } = params;

    return useQuery<TasksQuery>({
        queryKey: [...TASKS_QUERY_KEY, skip, take, filters],
        queryFn: () =>
            fetchClient(TasksDocument, {
                skip,
                take,
                ...filters,
            }),
    });
};
