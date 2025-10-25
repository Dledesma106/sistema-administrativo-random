import { useRouter } from 'next/router';

import CreateOrUpdateBillingProfileForm from '@/components/Forms/Accounting/CreateOrUpdateBillingProfileForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBillingProfileById } from '@/hooks/api/billingProfile';

export default function EditBillingProfile(): JSX.Element {
    const {
        query: { id },
    } = useRouter();

    const { data: billingProfileData, isLoading: isLoadingBillingProfile } =
        useGetBillingProfileById(id as string);

    if (isLoadingBillingProfile) {
        return <FormSkeleton />;
    }

    if (!billingProfileData?.billingProfileById) {
        return <div>Perfil de facturación no encontrado</div>;
    }

    const billingProfile = billingProfileData.billingProfileById;

    return (
        <CreateOrUpdateBillingProfileForm
            profileIdToUpdate={id as string}
            defaultValues={{
                business: billingProfile.business.id,
                businessName: billingProfile.business.name,
                numeroDocumento: billingProfile.numeroDocumento,
                tipoDocumento: billingProfile.tipoDocumento,
                legalName: billingProfile.legalName,
                taxCondition: billingProfile.IVACondition,
                billingAddress: billingProfile.comercialAddress,
                billingEmails: billingProfile.billingEmails,
                contacts: billingProfile.contacts.map((contact) => ({
                    name: contact.fullName,
                    email: contact.email,
                    phone: contact.phone,
                    notes: contact.notes,
                })),
            }}
        />
    );
}
