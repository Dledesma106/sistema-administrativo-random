import { GetCitiesQuery } from '@/api/graphql';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetCities } from '@/hooks/api/city/useGetCities';
import CreateOrUpdateUserForm from '@/modules/CreateOrUpdateUserForm';

export default function NewUser(): JSX.Element {
    const { data: citiesData, isLoading } = useGetCities({});

    if (isLoading) {
        return <FormSkeleton />;
    }

    const cities: GetCitiesQuery['cities'] = citiesData?.cities || [];

    return <CreateOrUpdateUserForm cities={cities} />;
}
