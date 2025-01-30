import TitleButton from '@/components/TitleButton';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetClients } from '@/hooks/api/client/useGetClients';
import ClientTable from '@/modules/tables/ClientTable';

export default function Clients(): JSX.Element {
    const { data: clientsData, isLoading } = useGetClients({});

    if (isLoading) {
        return <TableSkeleton />;
    }

    return (
        <>
            <main>
                <TitleButton
                    title="Clientes"
                    path="/tech-admin/clients/new"
                    nameButton="Agregar cliente"
                />
                <ClientTable clients={clientsData?.clients || []} />
            </main>
        </>
    );
}
