import {
    ColumnFiltersState,
    SortingState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import TechAdminTaskActions from './TechAdminTaskActions';

import TaskStatusDropdown from '@/components/Common/TaskStatusDropdown';
import DataTableComboboxFilter from '@/components/DataTableComboboxFilter';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import useAlert from '@/hooks/useAlert';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { dmyDateString } from '@/lib/utils';
import {
    type IBusiness,
    type ICity,
    type IClient,
    type IProvince,
    type ITask,
    type IUser,
} from 'backend/models/interfaces';
import { TaskStatus, TaskType } from 'backend/models/types';

interface Props {
    tasks: ITask[];
    cities: ICity[];
    provinces: IProvince[];
    clients: IClient[];
    businesses: IBusiness[];
    techs: IUser[];
}

const columnHelper = createColumnHelper<ITask>();

export default function TechAdminTaskTable({
    tasks,
    cities,
    // provinces,
    clients,
    businesses,
    techs,
}: Props): JSX.Element {
    const [tableTasks, setTableTasks] = useState<ITask[]>(tasks);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const { triggerAlert } = useAlert();

    const columns = useMemo(
        () => [
            columnHelper.accessor((row) => dmyDateString(new Date(row.openedAt)), {
                id: 'openedAt',
                header: 'Fecha apertura',
            }),
            columnHelper.accessor((row) => row.business, {
                id: 'business',
                cell: (info) => {
                    return info.getValue().name;
                },
                header: 'Empresa',
                filterFn: (row, id, businessID) => {
                    if (!businessID) {
                        return true;
                    }

                    const business = row.getValue<ITask['business']>(id);
                    return business._id === businessID;
                },
            }),
            columnHelper.accessor((row) => row.branch.client.name, {
                id: 'client',
                header: 'Cliente',
            }),
            columnHelper.accessor((row) => row.branch, {
                id: 'branch',
                cell: (info) => {
                    const branch = info.getValue();
                    return `${branch.number}, ${branch.city.name}, ${
                        (branch.city.province as IProvince).name
                    }`;
                },
                header: 'Sucursal',
                filterFn: (row, id, cityID) => {
                    if (!cityID) {
                        return true;
                    }

                    const branch = row.getValue<ITask['branch']>(id);
                    return branch.city._id === cityID;
                },
            }),
            columnHelper.accessor((row) => row.assigned, {
                id: 'assigned',
                cell: (info) => {
                    return info
                        .getValue()
                        .map((tech: IUser) => tech.fullName)
                        .join(', ');
                },
                header: 'Tecnico Asignado',
                filterFn: (row, id, userId) => {
                    if (!userId) {
                        return true;
                    }

                    const assignedList = row.getValue<ITask['assigned']>(id);
                    const idIsInAssignedList = assignedList.some(
                        (assigned) => assigned._id === userId,
                    );

                    return idIsInAssignedList;
                },
            }),
            columnHelper.accessor((row) => row.taskType, {
                id: 'taskType',
                header: 'Tipo',
            }),
            columnHelper.accessor((row) => row.status, {
                id: 'taskStatus',
                header: 'Estado',
                cell: (info) => {
                    const status = info.getValue();
                    const task = info.row.original;

                    const changeTaskStatus = async (
                        status: TaskStatus,
                    ): Promise<void> => {
                        try {
                            await fetcher.put(
                                {
                                    ...task,
                                    status,
                                },
                                api.techAdmin.tasks,
                            );

                            setTableTasks(
                                tableTasks.map((someTask) =>
                                    someTask._id === task._id
                                        ? {
                                              ...someTask,
                                              status,
                                          }
                                        : someTask,
                                ),
                            );

                            triggerAlert({
                                type: 'Success',
                                message:
                                    'El estado de la tarea fue actualizado correctamente',
                            });
                        } catch (error) {
                            triggerAlert({
                                type: 'Failure',
                                message: 'No se pudo actualizar el estado de la tarea',
                            });
                        }
                    };

                    return (
                        <TaskStatusDropdown
                            setStatus={changeTaskStatus}
                            status={status}
                        />
                    );
                },
            }),
            columnHelper.accessor((row) => row.closedAt, {
                id: 'closedAt',
                cell: (info) => {
                    const closedAt = info.getValue();
                    return closedAt !== undefined
                        ? dmyDateString(new Date(closedAt))
                        : closedAt;
                },
                header: 'Fecha cierre',
            }),
            columnHelper.display({
                id: 'actions',
                cell: (props) => {
                    const task = props.row.original;
                    return (
                        <TechAdminTaskActions
                            task={task}
                            deleteTask={(id: string) => {
                                setTableTasks(
                                    tableTasks.filter((task) => task._id !== id),
                                );
                            }}
                        />
                    );
                },
                header: 'Acciones',
            }),
        ],
        [tableTasks, triggerAlert],
    );

    const table = useReactTable({
        data: tableTasks,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div className="bg-white shadow-gray-100 sm:rounded-none">
            <div className="-ml-2 -mt-2 flex flex-wrap py-4">
                <Label className="mx-2 mt-5 block">Filtrar por</Label>

                <DataTableComboboxFilter
                    selectPlaceholder="Seleccionar localidad"
                    searchPlaceholder="Buscar localidad"
                    value={(table.getColumn('branch')?.getFilterValue() as string) || ''}
                    onChange={table.getColumn('branch')?.setFilterValue}
                    items={cities.map((city) => ({
                        value: city._id.toString(),
                        label: city.name,
                    }))}
                />

                <DataTableComboboxFilter
                    selectPlaceholder="Seleccionar tecnico"
                    searchPlaceholder="Buscar tecnico"
                    value={
                        (table.getColumn('assigned')?.getFilterValue() as string) || ''
                    }
                    onChange={table.getColumn('assigned')?.setFilterValue}
                    items={techs.map((tech) => ({
                        value: tech._id.toString(),
                        label: tech.fullName || '',
                    }))}
                />

                <DataTableComboboxFilter
                    selectPlaceholder="Seleccionar empresa"
                    searchPlaceholder="Buscar empresa"
                    value={
                        (table.getColumn('business')?.getFilterValue() as string) || ''
                    }
                    onChange={table.getColumn('business')?.setFilterValue}
                    items={businesses.map((business) => ({
                        value: business._id.toString(),
                        label: business.name,
                    }))}
                />

                <DataTableComboboxFilter
                    selectPlaceholder="Seleccionar cliente"
                    searchPlaceholder="Buscar cliente"
                    value={(table.getColumn('client')?.getFilterValue() as string) || ''}
                    onChange={table.getColumn('client')?.setFilterValue}
                    items={clients.map((client) => ({
                        value: client._id.toString(),
                        label: client.name,
                    }))}
                />

                <DataTableComboboxFilter
                    selectPlaceholder="Seleccionar estado"
                    searchPlaceholder="Buscar estado"
                    value={
                        (table.getColumn('taskStatus')?.getFilterValue() as string) || ''
                    }
                    onChange={table.getColumn('taskStatus')?.setFilterValue}
                    items={[
                        {
                            value: TaskStatus.SinAsignar.toLowerCase(),
                            label: 'Sin asignar',
                        },
                        {
                            value: TaskStatus.Pendiente.toLowerCase(),
                            label: 'Pendiente',
                        },
                        {
                            value: TaskStatus.Finalizada.toLowerCase(),
                            label: 'Finalizada',
                        },
                        {
                            value: TaskStatus.Aprobada.toLowerCase(),
                            label: 'Aprobada',
                        },
                    ]}
                />

                <DataTableComboboxFilter
                    selectPlaceholder="Seleccionar tipo"
                    searchPlaceholder="Buscar tipo"
                    value={
                        (table.getColumn('taskType')?.getFilterValue() as string) || ''
                    }
                    onChange={table.getColumn('taskType')?.setFilterValue}
                    items={[
                        {
                            value: TaskType.Preventivo.toLowerCase(),
                            label: 'Preventivo',
                        },
                        {
                            value: TaskType.Correctivo.toLowerCase(),
                            label: 'Correctivo',
                        },
                        {
                            value: TaskType.Instalacion.toLowerCase(),
                            label: 'Instalacion',
                        },
                        {
                            value: TaskType.Desmonte.toLowerCase(),
                            label: 'Desmonte',
                        },
                        {
                            value: TaskType.Actualizacion.toLowerCase(),
                            label: 'Actualizacion',
                        },
                    ]}
                />
            </div>

            <div className="relative overflow-visible">
                <Table>
                    <TableHeader className="border-b bg-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}

                        {/* {tableTasks.map((task, index) => (
                            <Item
                                key={index}
                                task={task}
                                deleteTask={deleteTask}
                                changeStatus={changeTaskStatus}
                            />
                        ))} */}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
