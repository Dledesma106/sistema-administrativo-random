import TitleButton from '@/components/TitleButton';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetUsers } from '@/hooks/api/user/useGetUsers';
import UserTable from '@/modules/tables/UserTable';

export default function Users(): JSX.Element {
    const { data: users, isLoading } = useGetUsers({});

    if (isLoading) {
        return <Skeleton className="h-96 w-full" />;
    }

    return (
        <>
            <TitleButton
                title="Usuarios"
                path="/tech-admin/users/new"
                nameButton="Agregar usuario"
            />

            <UserTable users={users?.users || []} />
        </>
    );
}
