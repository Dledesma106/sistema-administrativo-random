import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import BillingDataTable from '@/modules/tables/BillingDataTable';

export default function BillingPage() {
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});

    if (isLoadingBusinesses) {
        return <TableSkeleton />;
    }

    return (
        <main>
            <BillingDataTable businesses={businessesData?.businesses || []} />
        </main>
    );
}
