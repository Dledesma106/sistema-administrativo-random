import { Role } from '@prisma/client';

import CreateExpenseForm from '@/components/Forms/Accounting/CreateExpenseForm';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useUserContext } from '@/context/userContext/UserProvider';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';

export default function CreateExpense(): JSX.Element {
    const { user } = useUserContext();
    const { data: techniciansData, isLoading } = useGetTechnicians({});

    if (isLoading) {
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

    return <CreateExpenseForm techs={techniciansData?.technicians || []} />;
}
