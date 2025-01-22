import BudgetsDataTable from '@/modules/tables/BudgetsTable';

// Mock data para la tabla
const mockBudgets = [
    {
        id: '1',
        company: 'Empresa A',
        description: 'Mantenimiento preventivo mensual',
        price: 150000,
    },
    {
        id: '2',
        company: 'Empresa B',
        description: 'Instalación de equipos nuevos',
        price: 280000,
    },
    {
        id: '3',
        company: 'Empresa C',
        description: 'Reparación de sistema eléctrico',
        price: 95000,
    },
];

export default function BudgetsPage() {
    return (
        <div className="p-4">
            <BudgetsDataTable data={mockBudgets} />
        </div>
    );
}
