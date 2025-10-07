import { useMutation } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    GeneratePresignedUrlsDocument,
    GeneratePresignedUrlsMutation,
    GeneratePresignedUrlsMutationVariables,
} from '@/api/graphql';

export const useGeneratePresignedUrls = () => {
    return useMutation<
        GeneratePresignedUrlsMutation,
        Error,
        GeneratePresignedUrlsMutationVariables
    >({
        mutationFn: (variables) => fetchClient(GeneratePresignedUrlsDocument, variables),
    });
};
