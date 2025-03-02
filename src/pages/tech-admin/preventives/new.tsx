import CreateOrUpdatePreventiveForm from '@/components/Forms/TechAdmin/CreateOrUpdatePreventiveForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetClientsWithBranches } from '@/hooks/api/client/useGetClientsWithBranches';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';

export default function NewPreventive(): JSX.Element {
    const { data: clientsData, isLoading: isLoadingClients } = useGetClientsWithBranches(
        {},
    );
    const { data: techniciansData, isLoading: isLoadingTechnicians } = useGetTechnicians(
        {},
    );

    if (isLoadingClients || isLoadingTechnicians) {
        return <FormSkeleton />;
    }

    return (
        <CreateOrUpdatePreventiveForm
            clients={clientsData?.clients || []}
            technicians={techniciansData?.technicians || []}
        />
    );
}
