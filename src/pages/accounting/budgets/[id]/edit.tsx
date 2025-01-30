import { useRouter } from 'next/router';

import CreateOrUpdateBudgetForm from '@/components/Forms/Accounting/CreateOrUpdateBudgetForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBranches } from '@/hooks/api/branch/useGetBranches';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetClients } from '@/hooks/api/client/useGetClients';

export default function EditBudget(): JSX.Element {
    const {
        query: { id },
    } = useRouter();
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: clientsData, isLoading: isLoadingClients } = useGetClients({});
    const { data: branchesData, isLoading: isLoadingBranches } = useGetBranches({});

    const mockBudget = {
        id,
        business: '1', // ID de la empresa existente
        client: '1', // ID del cliente existente
        branch: '1', // ID de la sucursal existente
        description: 'Descripción del presupuesto de ejemplo',
        price: 150000,
    };

    if (isLoadingBusinesses || isLoadingClients || isLoadingBranches) {
        return <FormSkeleton />;
    }

    return (
        <CreateOrUpdateBudgetForm
            budgetIdToUpdate={mockBudget.id as string}
            businesses={businessesData?.businesses || []}
            clients={clientsData?.clients || []}
            branches={branchesData?.branches || []}
            defaultValues={mockBudget}
        />
    );
}
