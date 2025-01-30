import { useRouter } from 'next/router';

import { GetCitiesQuery } from '@/api/graphql';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetCities } from '@/hooks/api/city/useGetCities';
import { useGetUser } from '@/hooks/api/user/useGetUser';
import CreateOrUpdateUserForm from '@/modules/CreateOrUpdateUserForm';

export default function EditUser(): JSX.Element {
    const router = useRouter();
    const { id } = router.query;

    const { data: user, isLoading } = useGetUser({
        id: id as string,
    });
    const { data: citiesData } = useGetCities({});

    if (isLoading) {
        return <FormSkeleton />;
    }
    if (!user?.user) {
        return <div>No se encontró el usuario</div>;
    }

    const cities: GetCitiesQuery['cities'] = citiesData?.cities || [];

    const defaultValues = {
        ...user.user,
        city: user.user.city?.id || '',
        roles: user.user.roles.map((role) => ({
            value: role,
            label: role,
        })),
    };

    return (
        <CreateOrUpdateUserForm
            defaultValues={defaultValues}
            userIdToUpdate={id as string}
            cities={cities}
        />
    );
}
