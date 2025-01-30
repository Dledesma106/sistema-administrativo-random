import TitleButton from '@/components/TitleButton';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetProvinces } from '@/hooks/api/province/useGetProvinces';
import { CityTable } from '@/modules/tables/city-table';

export default function Cities(): JSX.Element {
    const { data: provincesData, isLoading } = useGetProvinces({});

    if (isLoading) {
        return <TableSkeleton />;
    }

    return (
        <main>
            <TitleButton
                title="Localidades"
                path="/tech-admin/cities/new"
                nameButton="Agregar localidad"
            />

            <CityTable provinces={provincesData?.provinces || []} />
        </main>
    );
}
