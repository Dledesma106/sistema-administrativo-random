import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetClients } from '@/hooks/api/client/useGetClients';
import ServiceOrdersDataTable from '@/modules/tables/ServiceOrdersDataTable';

export default function ServiceOrdersPage(): JSX.Element {
    const { data: clientsData, isLoading: isLoadingClients } = useGetClients({});
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});

    if (isLoadingClients || isLoadingBusinesses) {
        return <TableSkeleton />;
    }

    return (
        <main>
            <ServiceOrdersDataTable
                clients={clientsData?.clients || []}
                businesses={businessesData?.businesses || []}
            />
        </main>
    );
}
