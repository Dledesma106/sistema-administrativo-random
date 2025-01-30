import TitleButton from '@/components/TitleButton';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetClients } from '@/hooks/api/client/useGetClients';
import { useGetProvinces } from '@/hooks/api/province/useGetProvinces';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';
import { PreventivesTable } from '@/modules/tables/PreventivesTable';

export default function Preventives(): JSX.Element {
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: clientsData, isLoading: isLoadingClients } = useGetClients({});
    const { data: provincesData, isLoading: isLoadingProvinces } = useGetProvinces({});
    const { data: techniciansData, isLoading: isLoadingTechnicians } = useGetTechnicians(
        {},
    );

    if (
        isLoadingBusinesses ||
        isLoadingClients ||
        isLoadingProvinces ||
        isLoadingTechnicians
    ) {
        return <Skeleton className="h-96 w-full" />;
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
                provinces={provincesData?.provinces || []}
                technicians={techniciansData?.technicians || []}
            />
        </>
    );
}
