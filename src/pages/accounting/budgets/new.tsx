import CreateOrUpdateBudgetForm from '@/components/Forms/Accounting/CreateOrUpdateBudgetForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';

export default function NewBudget(): JSX.Element {
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});

    if (isLoadingBusinesses) {
        return <FormSkeleton />;
    }

    return <CreateOrUpdateBudgetForm businesses={businessesData?.businesses || []} />;
}
