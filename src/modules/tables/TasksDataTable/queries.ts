import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { TasksDocument, TasksQueryVariables } from '@/api/graphql';

export const TASKS_LIST_QUERY_KEY = ['tasks'];

export const useTasksListQuery = (variables: TasksQueryVariables) => {
    return useQuery({
        queryKey: TASKS_LIST_QUERY_KEY,
        queryFn: () => fetchClient(TasksDocument, variables),
    });
};
