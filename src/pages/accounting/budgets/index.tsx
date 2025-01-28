import { BudgetStatus } from '@/components/ui/Badges/BudgetStatusBadge';
import BudgetsDataTable from '@/modules/tables/BudgetsTable';

// Mock data para la tabla
const mockBudgets = [
    {
        id: '1',
        company: 'Empresa A',
        description: 'Descripción del presupuesto A',
        price: 150000,
        status: BudgetStatus.Enviado,
    },
    {
        id: '2',
        company: 'Empresa B',
        description: 'Descripción del presupuesto B',
        price: 250000,
        status: BudgetStatus.Recibido,
    },
    {
        id: '3',
        company: 'Empresa C',
        description: 'Descripción del presupuesto C',
        price: 350000,
        status: BudgetStatus.Aprobado,
    },
    {
        id: '4',
        company: 'Empresa D',
        description: 'Descripción del presupuesto D',
        price: 450000,
        status: BudgetStatus.Rechazado,
    },
];

export default function BudgetsPage() {
    return (
        <div className="p-4">
            <BudgetsDataTable data={mockBudgets} />
        </div>
    );
}
