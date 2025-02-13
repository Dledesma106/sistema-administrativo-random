import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetProvinces } from '@/hooks/api/province/useGetProvinces';
import { CitiesDataTable } from '@/modules/tables/CitiesDataTable';

export default function Cities(): JSX.Element {
    const { data: provincesData, isLoading } = useGetProvinces({});

    if (isLoading) {
        return <TableSkeleton />;
    }

    return (
        <main>
            <CitiesDataTable provinces={provincesData?.provinces || []} />
        </main>
    );
}
