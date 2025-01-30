import { useMutation } from '@tanstack/react-query';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateBranchDocument,
    CreateBranchMutation,
    CreateBranchMutationVariables,
} from '@/api/graphql';

export const useCreateBranch = () => {
    return useMutation<CreateBranchMutation, Error, CreateBranchMutationVariables>({
        mutationFn: (variables) => fetchClient(CreateBranchDocument, variables),
    });
};
