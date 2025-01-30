import CreateOrUpdateTaskPriceForm from '@/components/Forms/Accounting/CreateOrUpdateTaskPriceForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';

export default function NewTaskPrice(): JSX.Element {
    const { data: businessesData, isLoading } = useGetBusinesses({});

    if (isLoading) {
        return <FormSkeleton />;
    }

    return <CreateOrUpdateTaskPriceForm businesses={businessesData?.businesses || []} />;
}
