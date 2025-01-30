import { useMutation } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    DeleteBranchDocument,
    DeleteBranchMutation,
    DeleteBranchMutationVariables,
} from '@/api/graphql';

export const useDeleteBranch = () => {
    return useMutation<DeleteBranchMutation, Error, DeleteBranchMutationVariables>({
        mutationFn: (variables) => fetchClient(DeleteBranchDocument, variables),
    });
};
