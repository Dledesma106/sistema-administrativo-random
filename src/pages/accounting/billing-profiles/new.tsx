import CreateOrUpdateBillingProfileForm from '@/components/Forms/Accounting/CreateOrUpdateBillingProfileForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBusinessesWithoutBillingProfile } from '@/hooks/api/billingProfile';

export default function NewBillingProfile(): JSX.Element {
    const { data: businessesData, isLoading } = useGetBusinessesWithoutBillingProfile({});

    if (isLoading) {
        return <FormSkeleton />;
    }

    return (
        <CreateOrUpdateBillingProfileForm
            businessesWithoutProfile={businessesData?.businesses || []}
        />
    );
}
