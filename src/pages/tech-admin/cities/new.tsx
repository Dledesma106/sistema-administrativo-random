import CityForm, { type CityFormValues } from '@/components/Forms/TechAdmin/CityForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetProvinces } from '@/hooks/api/province/useGetProvinces';

export default function NewCity(): JSX.Element {
    const { data: provincesData, isLoading } = useGetProvinces({});

    if (isLoading) {
        return <FormSkeleton />;
    }

    const cityForm: CityFormValues = {
        name: '',
        provinceId: '',
    };

    return <CityForm cityForm={cityForm} provinces={provincesData?.provinces || []} />;
}
