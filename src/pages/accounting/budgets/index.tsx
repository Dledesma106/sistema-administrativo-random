import { BudgetStatus } from '@/components/ui/Badges/BudgetStatusBadge';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import BudgetsDataTable from '@/modules/tables/BudgetsTable';

// Mock data para la tabla
const mockBudgets = [
    {
        id: '1',
        company: 'Empresa A',
        subject: 'Asunto del presupuesto A',
        description: 'Descripción del presupuesto A',
        price: 150000,
        status: BudgetStatus.Enviado,
    },
    {
        id: '2',
        company: 'Empresa B',
        subject: 'Asunto del presupuesto B',
        description: 'Descripción del presupuesto B',
        price: 250000,
        status: BudgetStatus.Recibido,
    },
    {
        id: '3',
        company: 'Empresa C',
        subject: 'Asunto del presupuesto C',
        description: 'Descripción del presupuesto C',
        price: 350000,
        status: BudgetStatus.Aprobado,
    },
    {
        id: '4',
        company: 'Empresa D',
        subject: 'Asunto del presupuesto D',
        description: 'Descripción del presupuesto D',
        price: 450000,
        status: BudgetStatus.Rechazado,
    },
];

export default function BudgetsPage() {
    const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinesses({});

    if (isLoadingBusinesses) {
        return <TableSkeleton />;
    }

    return (
        <div className="p-4">
            <BudgetsDataTable
                data={mockBudgets}
                businesses={businessesData?.businesses || []}
            />
        </div>
    );
}
