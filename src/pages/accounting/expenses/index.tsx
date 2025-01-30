import { Role } from '@prisma/client';

import { Skeleton } from '@/components/ui/skeleton';
import { useUserContext } from '@/context/userContext/UserProvider';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';
import ExpensesDataTable from '@/modules/tables/ExpensesDataTable';

export default function Expenses(): JSX.Element {
    const { user } = useUserContext();
    const { data: techniciansData, isLoading } = useGetTechnicians({});

    if (isLoading) {
        return <Skeleton className="h-96 w-full" />;
    }

    return (
        <main>
            {user.roles?.includes(Role.AdministrativoContable) ? (
                <ExpensesDataTable techs={techniciansData?.technicians || []} />
            ) : (
                <div>No tienes permisos para ver esta página</div>
            )}
        </main>
    );
}
