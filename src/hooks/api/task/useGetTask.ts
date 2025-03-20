import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { GetTaskDocument, GetTaskQuery, GetTaskQueryVariables } from '@/api/graphql';

export const useGetTask = (variables: GetTaskQueryVariables) => {
    return useQuery<GetTaskQuery>({
        queryKey: ['task', variables.id],
        queryFn: () => fetchClient(GetTaskDocument, variables),
        enabled: !!variables.id,
    });
};
