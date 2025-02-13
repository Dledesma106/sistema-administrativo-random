import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetCities } from '@/hooks/api/city/useGetCities';
import { useGetClients } from '@/hooks/api/client/useGetClients';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';
import { PreventivesTable } from '@/modules/tables/PreventivesTable';

export default function Preventives(): JSX.Element {
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: clientsData, isLoading: isLoadingClients } = useGetClients({});
    const { data: citiesData, isLoading: isLoadingCities } = useGetCities({});
    const { data: techniciansData, isLoading: isLoadingTechnicians } = useGetTechnicians(
        {},
    );

    if (
        isLoadingBusinesses ||
        isLoadingClients ||
        isLoadingCities ||
        isLoadingTechnicians
    ) {
        return <TableSkeleton />;
    }

    return (
        <PreventivesTable
            businesses={businessesData?.businesses || []}
            clients={clientsData?.clients || []}
            cities={citiesData?.cities || []}
            technicians={techniciansData?.technicians || []}
        />
    );
}
