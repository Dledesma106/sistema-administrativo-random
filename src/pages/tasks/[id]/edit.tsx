import { useRouter } from 'next/router';

import CreateOrUpdateTaskForm from '@/components/Forms/TechAdmin/CreateOrUpdateTaskForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBranches } from '@/hooks/api/branch/useGetBranches';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetClients } from '@/hooks/api/client/useGetClients';
import { useGetTask } from '@/hooks/api/tasks/useGetTask';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';

export default function TaskEdit(): JSX.Element {
    const router = useRouter();
    const id = router.query.id as string;

    const { data: taskData, isLoading: isLoadingTask } = useGetTask(id);
    const { data: clientsData, isLoading: isLoadingClients } = useGetClients({});
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const { data: techniciansData, isLoading: isLoadingTechnicians } = useGetTechnicians(
        {},
    );
    const { data: branchesData, isLoading: isLoadingBranches } = useGetBranches({});

    if (
        isLoadingTask ||
        isLoadingClients ||
        isLoadingBusinesses ||
        isLoadingTechnicians ||
        isLoadingBranches
    ) {
        return <FormSkeleton />;
    }

    if (!taskData?.taskById) {
        return <div>Tarea no encontrada</div>;
    }

    const task = taskData.taskById;

    return (
        <CreateOrUpdateTaskForm
            defaultValues={{
                assignedIDs: task.assigned.map((user) => ({
                    label: user.fullName,
                    value: user.id,
                })),
                branch: task.branch?.id ?? undefined,
                business: task.business?.id ?? undefined,
                client: task.branch?.client?.id ?? undefined,
                businessName: task.businessName ?? undefined,
                clientName: task.clientName ?? undefined,
                description: task.description,
                taskType: task.taskType,
                actNumber: task.actNumber,
                movitecTicket: task.movitecTicket ?? '',
            }}
            taskIdToUpdate={task.id}
            clients={clientsData?.clients || []}
            businesses={businessesData?.businesses || []}
            technicians={techniciansData?.technicians || []}
            branches={branchesData?.branches || []}
        />
    );
}
