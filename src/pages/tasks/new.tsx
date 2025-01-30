import CreateOrUpdateTaskForm from '@/components/Forms/TechAdmin/CreateOrUpdateTaskForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBranches } from '@/hooks/api/branch/useGetBranches';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetClients } from '@/hooks/api/client/useGetClients';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';

export default function NewTask(): JSX.Element {
    const { data: branchesData, isLoading: isLoadingBranches } = useGetBranches({});
    const { data: clientsData, isLoading: isLoadingClients } = useGetClients({});
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: techniciansData, isLoading: isLoadingTechnicians } = useGetTechnicians(
        {},
    );

    if (
        isLoadingBranches ||
        isLoadingClients ||
        isLoadingBusinesses ||
        isLoadingTechnicians
    ) {
        return <FormSkeleton />;
    }

    return (
        <CreateOrUpdateTaskForm
            branches={branchesData?.branches || []}
            clients={clientsData?.clients || []}
            businesses={businessesData?.businesses || []}
            technicians={techniciansData?.technicians || []}
        />
    );
}
