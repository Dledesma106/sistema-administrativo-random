import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetCities } from '@/hooks/api/city/useGetCities';
import { useGetClients } from '@/hooks/api/client/useGetClients';
import { useGetProvinces } from '@/hooks/api/province/useGetProvinces';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';
import TasksDataTable from '@/modules/tables/TasksDataTable';

export default function TechAdminTasks(): JSX.Element {
    const { data: citiesData, isLoading: isLoadingCities } = useGetCities({});
    const { data: provincesData, isLoading: isLoadingProvinces } = useGetProvinces({});
    const { data: clientsData, isLoading: isLoadingClients } = useGetClients({});
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: techniciansData, isLoading: isLoadingTechnicians } = useGetTechnicians(
        {},
    );

    if (
        isLoadingCities ||
        isLoadingProvinces ||
        isLoadingClients ||
        isLoadingBusinesses ||
        isLoadingTechnicians
    ) {
        return <TableSkeleton />;
    }

    return (
        <main>
            <TasksDataTable
                cities={citiesData?.cities || []}
                provinces={provincesData?.provinces || []}
                clients={clientsData?.clients || []}
                businesses={businessesData?.businesses || []}
                techs={techniciansData?.technicians || []}
            />
        </main>
    );
}
