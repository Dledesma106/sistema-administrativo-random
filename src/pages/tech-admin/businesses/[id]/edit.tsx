import { useRouter } from 'next/router';

import BusinessForm, {
    type IBusinessForm,
} from '@/components/Forms/TechAdmin/BusinessForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBusinessById } from '@/hooks/api/business/useGetBusiness';

export default function EditBusiness(): JSX.Element {
    const router = useRouter();
    const { id } = router.query;

    const { data: business, isLoading } = useGetBusinessById(id as string);

    if (isLoading) {
        return <FormSkeleton />;
    }
    if (!business?.business) {
        return <div>No se encontró la empresa</div>;
    }

    const businessForm: IBusinessForm = {
        id: business.business.id,
        name: business.business.name,
    };

    return <BusinessForm newBusiness={false} businessForm={businessForm} />;
}
