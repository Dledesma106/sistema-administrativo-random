import { Skeleton } from '@/components/ui/skeleton';
import { useGetCities } from '@/hooks/api/city/useGetCities';
import { UsersDataTable } from '@/modules/tables/UsersDataTable';

export default function Users(): JSX.Element {
    const { data: citiesData, isLoading } = useGetCities({});

    if (isLoading) {
        return <Skeleton className="h-96 w-full" />;
    }

    return (
        <>
            <UsersDataTable cities={citiesData?.cities || []} />
        </>
    );
}
