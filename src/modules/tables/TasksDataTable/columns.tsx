import Link from 'next/link';

import { TaskStatus, TaskType } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';

import { TasksTableRowActions } from './tasks-table-row-actions';

import { TasksQuery } from '@/api/graphql';
import { Badge } from '@/components/ui/Badges/badge';
import { routesBuilder } from '@/lib/routes';
import { dmyDateString, pascalCaseToSpaces } from '@/lib/utils';

type Task = TasksQuery['tasks'][0];

const columnHelper = createColumnHelper<TasksQuery['tasks'][0]>();

export const useTasksTableColumns = () => [
    columnHelper.accessor((row) => row, {
        id: 'location',
        cell: (info) => {
            const task = info.row.original;

            return (
                <Link
                    className="space-y-2 hover:underline"
                    href={routesBuilder.tasks.details(task.id)}
                >
                    <strong>{task.branch.client.name}</strong> - {task.business.name}
                    <p className="text-xs">
                        #{task.branch.number} - {task.branch.city.name},{' '}
                        {task.branch.city.province.name}
                    </p>
                </Link>
            );
        },
        header: 'Locación',
    }),
    columnHelper.accessor((row) => row.description, {
        id: 'description',
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
    columnHelper.accessor((row) => row.business.id, {
        id: 'business',
        cell: (info) => {
            const task = info.row.original;
            return task.business.name;
        },
        header: 'Empresa',
        filterFn: (row, id, businessesIDs: string[]) => {
            if (!businessesIDs) {
                return true;
            }

            const businessID = row.getValue<Task['business']['id']>(id);
            const businessIsInFilteredList = businessesIDs.some(
                (someId) => someId === businessID,
            );

            return businessIsInFilteredList;
        },
    }),
    columnHelper.accessor((row) => row.branch.client.id, {
        id: 'client',
        header: 'Cliente',
        filterFn: (row, id, clientsIDs: string[]) => {
            if (!clientsIDs) {
                return true;
            }

            const clientId = row.getValue<Task['branch']['client']['id']>(id);
            const clientIsInFilteredList = clientsIDs.some(
                (clientID) => clientID === clientId,
            );

            return clientIsInFilteredList;
        },
    }),
    columnHelper.accessor((row) => row.branch.city.id, {
        id: 'branch',
        header: 'Sucursal',
        filterFn: (row, id, cityIDs: string[]) => {
            if (!cityIDs) {
                return true;
            }

            const currentCityId = row.getValue<Task['branch']['city']['id']>(id);
            const branchIsInFilteredList = cityIDs.some(
                (someId) => someId === currentCityId,
            );

            return branchIsInFilteredList;
        },
    }),
    columnHelper.accessor((row) => row.assigned, {
        id: 'assigned',
        cell: (info) => {
            return (
                <div className="-ml-2 -mt-2 flex max-w-[250px] flex-wrap">
                    {info.getValue().map((tech) => {
                        return (
                            <Badge
                                className="ml-2 mt-2 whitespace-nowrap"
                                key={tech.id}
                                variant="secondary"
                            >
                                {tech.fullName}
                            </Badge>
                        );
                    })}
                </div>
            );
        },
        header: 'Tecnicos',
        filterFn: (row, id, userId: string[]) => {
            if (!userId) {
                return true;
            }

            const assigned = row.getValue<Task['assigned']>(id);
            const assignedIsInFilteredList = assigned.some((user) => {
                return userId.includes(user.id);
            });

            return assignedIsInFilteredList;
        },
    }),
    columnHelper.accessor((row) => row.taskType, {
        id: 'taskType',
        header: 'Tipo',
        filterFn: (row, id, types: TaskType[]) => {
            if (!types) {
                return true;
            }

            const thisType = row.getValue<Task['taskType']>(id);
            const taskIsInFilteredList = types.some((type) => type === thisType);

            return taskIsInFilteredList;
        },
        cell: (info) => {
            const type = info.getValue();
            return pascalCaseToSpaces(type);
        },
    }),
    columnHelper.accessor((row) => row.status, {
        id: 'taskStatus',
        header: 'Estado',
        cell: (info) => {
            const status = info.getValue();

            if (status === TaskStatus.Aprobada) {
                return (
                    <Badge
                        className="inline-flex space-x-2 whitespace-nowrap"
                        variant="outline"
                    >
                        <span className="h-2 w-2 rounded-full bg-success"></span>
                        <span>Aprobada</span>
                    </Badge>
                );
            }

            if (status === TaskStatus.Pendiente) {
                return (
                    <Badge
                        className="inline-flex space-x-2 whitespace-nowrap"
                        variant="outline"
                    >
                        <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                        <span>Pendiente</span>
                    </Badge>
                );
            }

            if (status === TaskStatus.Finalizada) {
                return (
                    <Badge
                        className="inline-flex space-x-2 whitespace-nowrap"
                        variant="outline"
                    >
                        <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                        <span>Finalizada</span>
                    </Badge>
                );
            }

            if (status === TaskStatus.SinAsignar) {
                return (
                    <Badge
                        className="inline-flex space-x-2 whitespace-nowrap"
                        variant="outline"
                    >
                        <span className="h-2 w-2 rounded-full bg-destructive"></span>
                        <span>Sin Asignar</span>
                    </Badge>
                );
            }

            return <Badge variant="outline">{status}</Badge>;
        },
        filterFn: (row, id, statuses: string[]) => {
            if (!statuses) {
                return true;
            }

            const status = row.getValue<Task['status']>(id);
            const statusIsInFilteredList = statuses.includes(status);

            return statusIsInFilteredList;
        },
    }),
    columnHelper.accessor((row) => dmyDateString(new Date(row.createdAt)), {
        id: 'openedAt',
        header: 'Fecha apertura',
    }),
    columnHelper.accessor((row) => row.closedAt, {
        id: 'closedAt',
        cell: (info) => {
            const closedAt = info.getValue();
            return !!closedAt ? dmyDateString(new Date(closedAt)) : closedAt;
        },
        header: 'Fecha cierre',
    }),
    columnHelper.accessor((row) => row.expenses, {
        id: 'expenses',
        header: 'Gastos',
        cell: (info) => {
            const expenses = info.getValue();

            if (info.row.original.status === TaskStatus.SinAsignar) {
                return <span className="text-muted-foreground">-</span>;
            }

            const amount = expenses.reduce((acc, expense) => {
                return acc + expense.amount;
            }, 0);

            return `$${amount}`;
        },
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => {
            const task = props.row.original;

            return <TasksTableRowActions task={task} />;
        },
    }),
];
