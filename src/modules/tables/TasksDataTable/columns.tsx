import { TaskStatus, TaskType } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp } from 'lucide-react';

import { TasksTableRowActions } from './tasks-table-row-actions';

import { TasksQuery } from '@/api/graphql';
import { Badge } from '@/components/ui/Badges/badge';
import { TaskStatusBadge } from '@/components/ui/Badges/TaskStatusBadge';
import { TaskTypeBadge } from '@/components/ui/Badges/TaskTypeBadge';
import { routesBuilder } from '@/lib/routes';

type Task = TasksQuery['tasks'][number];

const columnHelper = createColumnHelper<TasksQuery['tasks'][number]>();

export const useTasksTableColumns = () => [
    columnHelper.accessor((row) => row.taskNumber, {
        id: 'taskNumber',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Número</span>
                    {column.getIsSorted() && (
                        <span>
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 size-4" />
                            ) : (
                                <ArrowDown className="ml-1 size-4" />
                            )}
                        </span>
                    )}
                </button>
            );
        },
        cell: (info) => {
            const taskNumber = info.getValue();
            return <span className="font-medium">#{taskNumber}</span>;
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row, {
        id: 'city',
        cell: (info) => {
            const task = info.row.original;

            return (
                <>
                    <strong>{task.branch?.client.name ?? task.clientName}</strong> -{' '}
                    {task.business?.name ?? task.businessName}
                    {task.branch && (
                        <p className="text-xs">
                            {task.branch.number && `#${task.branch.number}`}
                            {task.branch.name && task.branch.number && ' - '}
                            {task.branch.name && task.branch.name} -{' '}
                            {task.branch.city.name}, {task.branch.city.province.name}
                        </p>
                    )}
                </>
            );
        },
        header: () => {
            return <span>Locación</span>;
        },
        filterFn: (row, id, cityIds: string[]) => {
            if (!cityIds?.length) {
                return true;
            }

            const task = row.original;
            return cityIds.includes(task.branch?.city?.id ?? '');
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row.description, {
        id: 'description',
        header: () => {
            return <span>Descripción</span>;
        },
        cell: (info) => {
            let description = info.getValue();
            const maxLength = 67;

            if (description.length > maxLength) {
                description = `${description.slice(0, maxLength)}...`;
            }

            return <p className="max-w-[250px] text-muted-foreground">{description}</p>;
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row.business?.id ?? row.businessName, {
        id: 'business',
        cell: (info) => {
            const task = info.row.original;
            return task.business?.name ?? task.businessName;
        },
        header: () => {
            return <span>Empresa</span>;
        },
        filterFn: (row, id, businessesIDs: string[]) => {
            if (!businessesIDs?.length) {
                return true;
            }

            const task = row.original;
            return businessesIDs.includes(task.business?.id ?? '');
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row.branch?.client?.id ?? row.clientName, {
        id: 'client',
        header: () => {
            return <span>Cliente</span>;
        },
        cell: (info) => {
            const task = info.row.original;
            return task.clientName ?? task.branch?.client.name;
        },
        filterFn: (row, id, clientsIDs: string[]) => {
            if (!clientsIDs?.length) {
                return true;
            }

            const task = row.original;
            return clientsIDs.includes(task.branch?.client?.id ?? '');
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row.participants, {
        id: 'participants',
        cell: (info) => {
            const participants = info.getValue();

            if (!participants || participants.length === 0) {
                return <span className="text-muted-foreground">-</span>;
            }

            return (
                <div className="flex max-w-[250px] flex-wrap">
                    {participants.map((participant, index) => {
                        return (
                            <Badge
                                className="ml-2 mt-2 whitespace-nowrap"
                                key={`${participant}-${index}`}
                                variant="default"
                            >
                                {participant}
                            </Badge>
                        );
                    })}
                </div>
            );
        },
        header: () => {
            return <span>Participantes</span>;
        },
        filterFn: (row, id, userId: string[]) => {
            if (!userId) {
                return true;
            }
            return true;
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row, {
        id: 'taskType',
        header: () => {
            return <span>Tipo</span>;
        },
        filterFn: (row, id, types: TaskType[]) => {
            if (!types) {
                return true;
            }

            const thisType = row.getValue<Task['taskType']>(id);
            const taskIsInFilteredList = types.some((type) => type === thisType);

            return taskIsInFilteredList;
        },
        cell: (info) => {
            const type = info.row.original.taskType;
            const frequency = info.row.original.preventive?.frequency ?? undefined;
            const link = routesBuilder.preventives.details(
                info.row.original.preventive?.id ?? '',
            );
            return <TaskTypeBadge type={type} link={link} frequency={frequency} />;
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row.status, {
        id: 'status',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Estado</span>
                    {column.getIsSorted() && (
                        <span>
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 size-4" />
                            ) : (
                                <ArrowDown className="ml-1 size-4" />
                            )}
                        </span>
                    )}
                </button>
            );
        },
        cell: (info) => {
            const status = info.getValue();
            return <TaskStatusBadge status={status} />;
        },
        filterFn: (row, id, statuses: string[]) => {
            if (!statuses) {
                return true;
            }

            const status = row.getValue<Task['status']>(id);
            const statusIsInFilteredList = statuses.includes(status);

            return statusIsInFilteredList;
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => format(new Date(row.createdAt), 'dd/MM/yyyy'), {
        id: 'openedAt',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Fecha apertura</span>
                    {column.getIsSorted() && (
                        <span>
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 size-4" />
                            ) : (
                                <ArrowDown className="ml-1 size-4" />
                            )}
                        </span>
                    )}
                </button>
            );
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row.closedAt, {
        id: 'closedAt',
        cell: (info) => {
            const closedAt = info.getValue();
            return !!closedAt ? format(new Date(closedAt), 'dd/MM/yyyy') : closedAt;
        },
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Fecha cierre</span>
                    {column.getIsSorted() && (
                        <span>
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 size-4" />
                            ) : (
                                <ArrowDown className="ml-1 size-4" />
                            )}
                        </span>
                    )}
                </button>
            );
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row.expenses, {
        id: 'expenses',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Gastos</span>
                    {column.getIsSorted() && (
                        <span>
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 size-4" />
                            ) : (
                                <ArrowDown className="ml-1 size-4" />
                            )}
                        </span>
                    )}
                </button>
            );
        },
        cell: (info) => {
            const expenses = info.getValue();

            if (info.row.original.status === TaskStatus.SinAsignar) {
                return <span className="text-muted-foreground">-</span>;
            }

            const amount = expenses.reduce((acc, expense) => {
                return acc + expense.amount;
            }, 0);

            return `$${amount.toLocaleString('es-AR')}`;
        },
        enableSorting: false,
    }),
    columnHelper.accessor((row) => row.assigned, {
        id: 'assigned',
        header: () => {
            return <span>Técnicos Asignados</span>;
        },
        enableHiding: true,
        filterFn: (row, id, assignedIds: string[]) => {
            if (!assignedIds?.length) {
                return true;
            }

            const task = row.original;
            return task.assigned.some((user) => assignedIds.includes(user.id));
        },
        enableSorting: true,
    }),
    columnHelper.accessor((row) => row.useMaterials, {
        id: 'useMaterials',
        header: ({ column }) => {
            return (
                <button
                    className="flex w-full justify-between gap-1 text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <span>Materiales</span>
                    {column.getIsSorted() && (
                        <span>
                            {column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="ml-1 size-4" />
                            ) : (
                                <ArrowDown className="ml-1 size-4" />
                            )}
                        </span>
                    )}
                </button>
            );
        },
        cell: (info) => {
            const materials = info.getValue();

            return (
                <Badge className="ml-2 mt-2 whitespace-nowrap" variant="default">
                    {materials ? (
                        <span className="text-foreground">Si</span>
                    ) : (
                        <span className="text-foreground">No</span>
                    )}
                </Badge>
            );
        },
        enableSorting: true,
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => {
            const task = props.row.original;
            return <TasksTableRowActions task={task} />;
        },
    }),
];
