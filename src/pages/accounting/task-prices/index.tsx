import { TaskType } from '@prisma/client';

import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import TaskPricesDataTable from '@/modules/tables/TaskPricesTable';

// Mock data para la tabla
const mockTaskPrices = [
    {
        id: '1',
        businessName: 'Empresa A',
        taskType: TaskType.InspeccionPolicial,
        price: 150000,
    },
    {
        id: '2',
        businessName: 'Empresa B',
        taskType: TaskType.Preventivo,
        price: 250000,
    },
    {
        id: '3',
        businessName: 'Empresa A',
        taskType: TaskType.Correctivo,
        price: 350000,
    },
    {
        id: '4',
        businessName: 'Empresa C',
        taskType: TaskType.Instalacion,
        price: 180000,
    },
];

export default function TaskPricesPage() {
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});

    if (isLoadingBusinesses) {
        return <TableSkeleton />;
    }

    return (
        <div className="p-4">
            <TaskPricesDataTable
                data={mockTaskPrices}
                businesses={businessesData?.businesses || []}
            />
        </div>
    );
}
