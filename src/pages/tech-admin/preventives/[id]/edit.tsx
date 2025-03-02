import { useRouter } from 'next/router';

import CreateOrUpdatePreventiveForm, {
    Month,
} from '@/components/Forms/TechAdmin/CreateOrUpdatePreventiveForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetClientsWithBranches } from '@/hooks/api/client/useGetClientsWithBranches';
import { useGetPreventive } from '@/hooks/api/preventive/useGetPreventive';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';

export default function EditPreventive(): JSX.Element {
    const router = useRouter();
    const { id } = router.query;

    const { data: preventiveData, isLoading: isLoadingPreventive } = useGetPreventive({
        id: id as string,
    });
    const { data: clientsData, isLoading: isLoadingClients } = useGetClientsWithBranches(
        {},
    );
    const { data: techniciansData, isLoading: isLoadingTechnicians } = useGetTechnicians(
        {},
    );

    if (isLoadingPreventive || isLoadingClients || isLoadingTechnicians) {
        return <FormSkeleton />;
    }

    if (!preventiveData?.preventive) {
        return <div>Preventivo no encontrado</div>;
    }

    const { preventive } = preventiveData;

    return (
        <CreateOrUpdatePreventiveForm
            preventiveIdToUpdate={preventive.id}
            clients={clientsData?.clients || []}
            technicians={techniciansData?.technicians || []}
            defaultValues={{
                client: preventive.branch.client.id,
                business: preventive.business.id,
                branch: preventive.branch.id,
                lastDoneAt: preventive.lastDoneAt,
                batteryChangedAt: preventive.batteryChangedAt,
                assigned: preventive.assigned.map((assigned) => ({
                    label: assigned.fullName,
                    value: assigned.id,
                })),
                frequency: preventive.frequency,
                observations: preventive.observations,
                months: preventive.months.map((month) => ({
                    label: month,
                    value: month as Month,
                })),
                status: preventive.status,
            }}
        />
    );
}
