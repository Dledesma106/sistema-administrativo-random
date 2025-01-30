import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { GetUsersDocument, GetUsersQuery, GetUsersQueryVariables } from '@/api/graphql';

export const USERS_QUERY_KEY = 'users';

export const useGetUsers = (variables: GetUsersQueryVariables) => {
    return useQuery<GetUsersQuery>({
        queryKey: [USERS_QUERY_KEY],
        queryFn: () => fetchClient(GetUsersDocument, variables),
    });
};
