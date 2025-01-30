import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import { GetUserDocument, GetUserQuery, GetUserQueryVariables } from '@/api/graphql';

export const USER_QUERY_KEY = 'user';

export const useGetUser = (variables: GetUserQueryVariables) => {
    return useQuery<GetUserQuery>({
        queryKey: [USER_QUERY_KEY, variables],
        queryFn: () => fetchClient(GetUserDocument, variables),
    });
};
