import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBillingProfiles } from '@/hooks/api/billingProfile';
import { CreateBillingForm } from '@/modules/Forms/Accounting/CreateBillingForm';

export default function CreateBillingPage() {
    const { data: billingProfilesData, isLoading } = useGetBillingProfiles({});

    if (isLoading) {
        return <FormSkeleton />;
    }

    return (
        <CreateBillingForm billingProfiles={billingProfilesData?.billingProfiles || []} />
    );
}
