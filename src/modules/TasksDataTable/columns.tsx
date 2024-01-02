import Link from 'next/link';

import { TaskStatus, TaskType } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';

import TechAdminTaskItemActions from './ItemActions';

import { TasksQuery } from '@/api/graphql';
import { Badge } from '@/components/ui/badge';
import { dmyDateString } from '@/lib/utils';

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
                    href={`/tech-admin/tasks/${task.id}`}
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
            const maxLength = 50;

            if (description.length > maxLength) {
                description = `${description.slice(0, maxLength)}...`;
            }

            return <p className="text-muted-foreground">{description}</p>;
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
                <div className="flex space-x-2">
                    {info.getValue().map((tech) => {
                        return (
                            <Badge key={tech.id} variant="secondary">
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
    }),
    columnHelper.accessor((row) => row.status, {
        id: 'taskStatus',
        header: 'Estado',
        cell: (info) => {
            const status = info.getValue();

            if (status === TaskStatus.Aprobada) {
                return (
                    <Badge className="inline-flex space-x-2" variant="outline">
                        <span className="h-2 w-2 rounded-full bg-success"></span>
                        <span>Aprobada</span>
                    </Badge>
                );
            }

            if (status === TaskStatus.Pendiente) {
                return (
                    <Badge className="inline-flex space-x-2" variant="outline">
                        <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                        <span>Pendiente</span>
                    </Badge>
                );
            }

            if (status === TaskStatus.Finalizada) {
                return (
                    <Badge className="inline-flex space-x-2" variant="outline">
                        <span className="h-2 w-2 rounded-full bg-black"></span>
                        <span>Finalizada</span>
                    </Badge>
                );
            }

            if (status === TaskStatus.SinAsignar) {
                return (
                    <Badge className="inline-flex space-x-2" variant="outline">
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
    columnHelper.display({
        id: 'actions',
        cell: (props) => {
            const task = props.row.original;

            return <TechAdminTaskItemActions task={task} />;
        },
    }),
];