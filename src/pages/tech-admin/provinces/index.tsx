import TitleButton from '@/components/TitleButton';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProvinces } from '@/hooks/api/province/useGetProvinces';
import ProvinceTable from '@/modules/tables/ProvinceTable';

export default function Provinces(): JSX.Element {
    const { data: provincesData, isLoading } = useGetProvinces({});

    if (isLoading) {
        return <Skeleton className="h-96 w-full" />;
    }

    return (
        <>
            <TitleButton
                title="Provincias"
                path="/tech-admin/provinces/new"
                nameButton="Agregar provincia"
            />
            <ProvinceTable provinces={provincesData?.provinces || []} />
        </>
    );
}
