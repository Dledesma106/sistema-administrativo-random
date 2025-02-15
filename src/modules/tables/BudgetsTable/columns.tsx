import { createColumnHelper } from '@tanstack/react-table';

import { BudgetsTableRowActions } from './budgets-table-row-actions';

import BudgetStatusBadge, {
    BudgetStatus,
} from '@/components/ui/Badges/BudgetStatusBadge';

type Budget = {
    id: string;
    company: string;
    description: string;
    price: number;
    status: BudgetStatus;
    // Puedes agregar más campos según necesites
};

const columnHelper = createColumnHelper<Budget>();

export const useBudgetsTableColumns = () => [
    columnHelper.accessor('company', {
        header: 'Empresa',
    }),
    columnHelper.accessor('description', {
        header: 'Descripción',
        cell: (info) => {
            let description = info.getValue();
            const maxLength = 67;

            if (description.length > maxLength) {
                description = `${description.slice(0, maxLength)}...`;
            }

            return <p className="max-w-[250px] text-muted-foreground">{description}</p>;
        },
    }),
    columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => <BudgetStatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('price', {
        header: 'Precio',
        cell: (info) => {
            const price = info.getValue();
            return price.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
            });
        },
    }),
    columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
            <div className="flex w-full justify-end">
                <BudgetsTableRowActions budget={row.original} />
            </div>
        ),
    }),
];
