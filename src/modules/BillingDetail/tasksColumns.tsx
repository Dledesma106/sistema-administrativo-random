import { GetBillByIdQuery } from '@/api/graphql';
import { TaskStatusBadge } from '@/components/ui/Badges/TaskStatusBadge';
import { Column } from '@/components/ui/data-list';

type Task = NonNullable<GetBillByIdQuery['bill']>['tasks'][number];

export const tasksColumns: Column<Task>[] = [
    {
        header: 'Número',
        cell: (t) => `#${t.taskNumber}`,
        accessorKey: 'taskNumber' as const,
    },
    {
        header: 'Descripción',
        cell: (t) => t.description || '-',
        accessorKey: 'description' as const,
    },
    {
        header: 'Cliente',
        cell: (t) => t.clientName || t.branch?.client?.name || '-',
        accessorKey: 'clientName' as const,
    },
    {
        header: 'Sucursal',
        cell: (t) => {
            const parts = [];
            if (t.branch?.name) {
                parts.push(`${t.branch.name} `);
            }
            if (t.branch?.number) {
                parts.push(`#${t.branch.number}`);
            }
            if (t.customBranch?.name) {
                parts.push(`${t.customBranch.name} `);
            }
            if (t.customBranch?.number) {
                parts.push(`#${t.customBranch.number}`);
            }
            return parts.join(', ');
        },
        accessorKey: 'branch' as const,
    },
    {
        header: 'Estado',
        cell: (t) => <TaskStatusBadge status={t.status} />,
        accessorKey: 'status' as const,
    },
];
