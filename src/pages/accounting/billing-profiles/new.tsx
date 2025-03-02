import CreateOrUpdateBillingProfileForm from '@/components/Forms/Accounting/CreateOrUpdateBillingProfileForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';

export default function NewBillingProfile(): JSX.Element {
    const { data: businessesData, isLoading } = useGetBusinesses({});

    if (isLoading) {
        return <FormSkeleton />;
    }

    return (
        <CreateOrUpdateBillingProfileForm businesses={businessesData?.businesses || []} />
    );
}
