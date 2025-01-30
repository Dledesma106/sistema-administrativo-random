import CreateOrUpdateBudgetForm from '@/components/Forms/Accounting/CreateOrUpdateBudgetForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBranches } from '@/hooks/api/branch/useGetBranches';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetClients } from '@/hooks/api/client/useGetClients';

export default function NewBudget(): JSX.Element {
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: clientsData, isLoading: isLoadingClients } = useGetClients({});
    const { data: branchesData, isLoading: isLoadingBranches } = useGetBranches({});

    if (isLoadingBusinesses || isLoadingClients || isLoadingBranches) {
        return <FormSkeleton />;
    }

    return (
        <CreateOrUpdateBudgetForm
            businesses={businessesData?.businesses || []}
            clients={clientsData?.clients || []}
            branches={branchesData?.branches || []}
        />
    );
}
