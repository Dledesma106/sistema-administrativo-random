import TitleButton from '@/components/TitleButton';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import BusinessTable from '@/modules/tables/BusinessTable';

export default function Businesses(): JSX.Element {
    const { data, isLoading, error } = useGetBusinesses({});

    if (isLoading) {
        return <Skeleton className="h-96 w-full" />;
    }

    if (error) {
        return <div>Error al cargar las empresas</div>;
    }

    return (
        <>
            <main>
                <TitleButton
                    title="Empresas"
                    path="/tech-admin/businesses/new"
                    nameButton="Agregar una empresa"
                />
                <BusinessTable businesses={data?.businesses || []} />
            </main>
        </>
    );
}
