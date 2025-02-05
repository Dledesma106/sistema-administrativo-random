import TitleButton from '@/components/TitleButton';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetCities } from '@/hooks/api/city/useGetCities';
import { useGetClients } from '@/hooks/api/client/useGetClients';
import { useGetPreventives } from '@/hooks/api/preventive/useGetPreventives';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';
import { PreventivesTable } from '@/modules/tables/PreventivesTable';

export default function Preventives(): JSX.Element {
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: clientsData, isLoading: isLoadingClients } = useGetClients({});
    const { data: citiesData, isLoading: isLoadingCities } = useGetCities({});
    const { data: techniciansData, isLoading: isLoadingTechnicians } = useGetTechnicians(
        {},
    );

    const { data: preventivesData, isLoading: isLoadingPreventives } = useGetPreventives(
        {},
    );

    if (
        isLoadingBusinesses ||
        isLoadingClients ||
        isLoadingCities ||
        isLoadingTechnicians ||
        isLoadingPreventives
    ) {
        return <TableSkeleton />;
    }

    return (
        <>
            <TitleButton
                title="Preventivos"
                path="/tech-admin/preventives/new"
                nameButton="Agregar preventivo"
            />
            <PreventivesTable
                businesses={businessesData?.businesses || []}
                clients={clientsData?.clients || []}
                cities={citiesData?.cities || []}
                technicians={techniciansData?.technicians || []}
                preventives={preventivesData?.preventives || []}
            />
        </>
    );
}
