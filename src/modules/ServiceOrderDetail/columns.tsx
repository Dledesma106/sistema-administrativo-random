import { format } from 'date-fns';

import { ServiceOrderQuery } from '@/api/graphql';
import { TaskStatusBadge } from '@/components/ui/Badges/TaskStatusBadge';
import { TaskTypeBadge } from '@/components/ui/Badges/TaskTypeBadge';
import { Column } from '@/components/ui/data-list';

type ServiceOrderTask = NonNullable<ServiceOrderQuery['serviceOrder']>['tasks'][number];

export const getTaskColumns = (
    isAccountingAdmin: boolean,
): Column<ServiceOrderTask>[] => [
    {
        header: 'Número',
        accessorKey: 'taskNumber',
    },
    {
        header: 'Descripción',
        accessorKey: 'description',
        cell: (task) => <p className="max-w-[250px] truncate">{task.description}</p>,
    },
    {
        header: 'Participantes',
        accessorKey: 'participants',
        cell: (task) => (
            <div className="max-w-[200px]">
                {task.participants && task.participants.length > 0 ? (
                    <p className="max-w-[200px] text-sm">
                        {task.participants.join(', ')}
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground">-</p>
                )}
            </div>
        ),
    },
    {
        header: 'Tipo',
        accessorKey: 'taskType',
        cell: (task) => <TaskTypeBadge type={task.taskType} />,
    },
    {
        header: 'Estado',
        accessorKey: 'status',
        cell: (task) => <TaskStatusBadge status={task.status} />,
    },
    {
        header: 'Fecha inicio',
        accessorKey: 'createdAt',
        cell: (task) => format(new Date(task.createdAt), 'dd/MM/yyyy'),
    },
    {
        header: 'Fecha cierre',
        accessorKey: 'closedAt',
        cell: (task) =>
            task.closedAt ? format(new Date(task.closedAt), 'dd/MM/yyyy') : 'N/A',
    },
    ...(isAccountingAdmin
        ? [
              {
                  header: 'Gastos',
                  accessorKey: 'expenses' as keyof ServiceOrderTask,
                  cell: (task: ServiceOrderTask) => {
                      const total = task.expenses.reduce(
                          (acc: number, expense: { amount: number }) =>
                              acc + expense.amount,
                          0,
                      );
                      return total.toLocaleString('es-AR', {
                          style: 'currency',
                          currency: 'ARS',
                      });
                  },
              },
          ]
        : []),
];
