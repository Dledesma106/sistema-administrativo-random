import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBillingProfiles } from '@/hooks/api/billingProfile/useGetBillingProfiles';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetClients } from '@/hooks/api/client/useGetClients';
import BillingProfilesDataTable from '@/modules/tables/BillingProfilesTable';

export default function BillingProfilesPage() {
    const { data: billingProfilesData, isLoading: isLoadingBillingProfiles } =
        useGetBillingProfiles({});
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: clientsData, isLoading: isLoadingClients } = useGetClients({});

    if (isLoadingBillingProfiles || isLoadingBusinesses || isLoadingClients) {
        return <TableSkeleton />;
    }

    return (
        <BillingProfilesDataTable
            data={billingProfilesData?.billingProfiles || []}
            businesses={businessesData?.businesses || []}
            clients={clientsData?.clients || []}
        />
    );
}
