import { useMutation } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    UpdateBranchDocument,
    UpdateBranchMutation,
    UpdateBranchMutationVariables,
} from '@/api/graphql';

export const useUpdateBranch = () => {
    return useMutation<UpdateBranchMutation, Error, UpdateBranchMutationVariables>({
        mutationFn: (variables) => fetchClient(UpdateBranchDocument, variables),
    });
};
