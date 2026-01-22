import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBills } from '@/hooks/api/bill';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import BillingDataTable from '@/modules/tables/BillingDataTable';

export default function BillingPage() {
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: billsData, isLoading: isLoadingBills } = useGetBills({});
    if (isLoadingBusinesses || isLoadingBills) {
        return <TableSkeleton />;
    }

    return (
        <main>
            <BillingDataTable
                data={billsData?.bills || []}
                businesses={businessesData?.businesses || []}
            />
        </main>
    );
}
