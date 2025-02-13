import { useRouter } from 'next/router';

import ProvinceForm from '@/components/Forms/TechAdmin/ProvinceForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetProvince } from '@/hooks/api/province/useGetProvince';

export default function ProvinceView(): JSX.Element {
    const router = useRouter();
    const { id } = router.query;
    const { data: provinceData, isLoading } = useGetProvince({ id: id as string });

    if (isLoading) {
        return <FormSkeleton />;
    }

    if (!provinceData?.province) {
        return <div>Provincia no encontrada</div>;
    }

    const provinceForm = {
        id: provinceData.province.id,
        name: provinceData.province.name,
    };

    return (
        <>
            <ProvinceForm newProvince={false} provinceForm={provinceForm} />
        </>
    );
}
