import { useRouter } from 'next/router';

import CityForm, { type CityFormValues } from '@/components/Forms/TechAdmin/CityForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetCity } from '@/hooks/api/city/useGetCity';
import { useGetProvinces } from '@/hooks/api/province/useGetProvinces';

export default function CityView(): JSX.Element {
    const router = useRouter();
    const { id } = router.query;

    const { data: cityData, isLoading: isLoadingCity } = useGetCity({
        id: id as string,
    });
    const { data: provincesData, isLoading: isLoadingProvinces } = useGetProvinces({});

    if (isLoadingCity || isLoadingProvinces) {
        return <FormSkeleton />;
    }
    if (!cityData?.city) {
        return <div>No se encontró la ciudad</div>;
    }

    const cityForm: CityFormValues = {
        name: cityData.city.name,
        provinceId: cityData.city.province.id,
    };

    return (
        <CityForm
            idToUpdate={id as string}
            cityForm={cityForm}
            provinces={provincesData?.provinces || []}
        />
    );
}
