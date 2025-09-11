import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import BudgetsDataTable from '@/modules/tables/BudgetsTable';

export default function BudgetsPage() {
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});

    if (isLoadingBusinesses) {
        return <TableSkeleton />;
    }

    return (
        <main>
            <BudgetsDataTable businesses={businessesData?.businesses || []} />
        </main>
    );
}
