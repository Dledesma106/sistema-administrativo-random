import { TaskType } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';

import { TaskPricesTableRowActions } from './task-prices-table-row-actions';

import { TaskTypeBadge } from '@/components/ui/Badges/TaskTypeBadge';

export type TaskPrice = {
    id: string;
    businessName: string;
    taskType: TaskType;
    price: number;
};

const columnHelper = createColumnHelper<TaskPrice>();

export const useTaskPricesTableColumns = () => [
    columnHelper.accessor('businessName', {
        header: 'Empresa',
    }),
    columnHelper.accessor('taskType', {
        header: 'Tipo de tarea',
        cell: (info) => <TaskTypeBadge type={info.getValue()} />,
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
        cell: ({ row }) => <TaskPricesTableRowActions taskPrice={row.original} />,
    }),
];
