import { useRouter } from 'next/router';

import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetCities } from '@/hooks/api/city/useGetCities';
import { useGetClient } from '@/hooks/api/client/useGetClient';
import { ClientBranchesTable } from '@/modules/tables/ClientBranchesTable';

export default function ClientBranchesView(): JSX.Element {
    const router = useRouter();
    const clientId = router.query.id as string;
    const { data: clientData, isLoading: isLoadingClient } = useGetClient({
        id: clientId,
    });
    const { data: citiesData, isLoading: isLoadingCities } = useGetCities({});
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});

    if (isLoadingClient || isLoadingCities || isLoadingBusinesses) {
        return <TableSkeleton />;
    }

    if (!clientData?.client) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-2xl">No se encontró al cliente</p>
            </div>
        );
    }
    return (
        <main>
            <ClientBranchesTable
                client={clientData.client}
                cities={citiesData?.cities || []}
                businesses={businessesData?.businesses || []}
            />
        </main>
    );
}
