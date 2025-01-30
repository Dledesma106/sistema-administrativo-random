import { useRouter } from 'next/router';

import { TaskType } from '@prisma/client';

import CreateOrUpdateTaskPriceForm from '@/components/Forms/Accounting/CreateOrUpdateTaskPriceForm';
import { FormSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';

export default function EditTaskPrice(): JSX.Element {
    const { query } = useRouter();
    const { data: businessesData, isLoading } = useGetBusinesses({});

    const mockPrice = {
        id: query.id as string,
        business: '1', // ID de la empresa existente
        taskType: TaskType.Preventivo,
        price: 150000,
    };

    if (isLoading) {
        return <FormSkeleton />;
    }

    return (
        <CreateOrUpdateTaskPriceForm
            businesses={businessesData?.businesses || []}
            defaultValues={mockPrice}
            priceIdToUpdate={mockPrice.id}
        />
    );
}
