import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetClients } from '@/hooks/api/client/useGetClients';
import BudgetsDataTable from '@/modules/tables/BudgetsTable';

export default function BudgetsPage() {
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: clientsData, isLoading: isLoadingClients } = useGetClients({});

    if (isLoadingBusinesses || isLoadingClients) {
        return <TableSkeleton />;
    }

    return (
        <main>
            <BudgetsDataTable
                businesses={businessesData?.businesses || []}
                clients={clientsData?.clients || []}
            />
        </main>
    );
}
