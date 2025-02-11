import { useRouter } from 'next/router';

import CreateOrUpdateBillingProfileForm from '@/components/Forms/Accounting/CreateOrUpdateBillingProfileForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';

export default function EditBillingProfile(): JSX.Element {
    const {
        query: { id },
    } = useRouter();

    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});
    const mockProfile = {
        id: id as string,
        business: '1', // ID de la empresa existente
        cuit: '30123456789',
        contactName: 'Juan Pérez',
        contactEmail: 'juan.perez@empresaa.com',
        billingEmail: 'facturacion@empresaa.com',
        billingAddress: 'Av. Siempre Viva 123',
        legalName: 'Empresa A S.R.L.',
        taxCondition: 'RESPONSABLE_INSCRIPTO' as const,
    };
    if (isLoadingBusinesses) {
        return <FormSkeleton />;
    }
    return (
        <CreateOrUpdateBillingProfileForm
            profileIdToUpdate={mockProfile.id}
            businesses={businessesData?.businesses || []}
            defaultValues={mockProfile}
        />
    );
}
