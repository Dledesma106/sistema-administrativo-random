import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    SearchGmailThreadsDocument,
    SearchGmailThreadsQuery,
    SearchGmailThreadsQueryVariables,
} from '@/api/graphql';

export const GMAIL_THREADS_QUERY_KEY = 'gmailThreads';

export const useSearchGmailThreads = (variables: SearchGmailThreadsQueryVariables) => {
    return useQuery<SearchGmailThreadsQuery>({
        queryKey: [GMAIL_THREADS_QUERY_KEY, variables.query],
        queryFn: () => fetchClient(SearchGmailThreadsDocument, variables),
        enabled: !!variables.query || variables.query === '', // Permitir query vacío para búsqueda por defecto
    });
};
