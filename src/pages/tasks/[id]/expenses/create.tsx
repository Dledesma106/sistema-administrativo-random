import { useRouter } from 'next/router';

import { Role } from '@prisma/client';

import CreateExpenseForm from '@/components/Forms/Accounting/CreateExpenseForm';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useUserContext } from '@/context/userContext/UserProvider';
import { useGetTask } from '@/hooks/api/task/useGetTask';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';

export default function CreateTaskExpense(): JSX.Element {
    const router = useRouter();
    const { id: taskId } = router.query;

    const { user } = useUserContext();
    const { data: techniciansData, isLoading: isLoadingTechs } = useGetTechnicians({});
    const { data: taskData, isLoading: isLoadingTask } = useGetTask({
        id: taskId as string,
    });

    if (isLoadingTechs || isLoadingTask) {
        return <TableSkeleton />;
    }

    // Verificar que el usuario tenga el rol necesario
    if (
        !user.roles?.includes(Role.AdministrativoContable) &&
        !user.roles?.includes(Role.AdministrativoTecnico)
    ) {
        return (
            <main className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-destructive">
                        Acceso denegado
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        No tienes permisos para acceder a esta página.
                    </p>
                </div>
            </main>
        );
    }

    // Verificar que la tarea existe
    if (!taskData?.taskById) {
        return (
            <main className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-destructive">
                        Tarea no encontrada
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        La tarea que estás buscando no existe o ha sido eliminada.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <CreateExpenseForm
            taskId={taskId as string}
            techs={techniciansData?.technicians || []}
        />
    );
}
