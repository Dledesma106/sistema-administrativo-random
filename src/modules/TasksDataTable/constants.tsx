import { TaskType } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';

import TechAdminTaskItemActions from './ItemActions';
import TasksDataTableStatusDropdown from './StatusDropdown';

import { TasksQuery } from '@/api/graphql';
import { dmyDateString } from '@/lib/utils';

type Task = TasksQuery['tasks'][0];

const columnHelper = createColumnHelper<TasksQuery['tasks'][0]>();

export const useTasksTableColumns = () => [
    columnHelper.accessor((row) => dmyDateString(new Date(row.createdAt)), {
        id: 'openedAt',
        header: 'Fecha apertura',
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
        cell: (info) => {
            const client = info.row.original.branch.client;
            return `${client.name}`;
        },
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
        cell: (info) => {
            const branch = info.row.original.branch;
            return `${branch.number}, ${branch.city.name}, ${branch.city.province.name}`;
        },
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
            return info
                .getValue()
                .map((tech) => tech.fullName)
                .join(', ');
        },
        header: 'Tecnico Asignado',
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
            const task = info.row.original;

            return <TasksDataTableStatusDropdown task={task} status={status} />;
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
    columnHelper.accessor((row) => row.closedAt, {
        id: 'closedAt',
        cell: (info) => {
            const closedAt = info.getValue();
            return closedAt !== undefined ? dmyDateString(new Date(closedAt)) : closedAt;
        },
        header: 'Fecha cierre',
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => {
            const task = props.row.original;

            return <TechAdminTaskItemActions task={task} />;
        },
        header: 'Acciones',
    }),
];
