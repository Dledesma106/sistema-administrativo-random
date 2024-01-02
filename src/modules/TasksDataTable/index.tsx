import {
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues as globalGetFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { useTasksTableColumns } from './columns';
import { DataTablePagination } from './Pagination';
import { useTasksListQuery } from './queries';
import { TasksDataTableToolbar } from './TableToolbar';

import { TasksQuery } from '@/api/graphql';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TasksPageProps } from '@/pages/tech-admin/tasks';

type TableItem = TasksQuery['tasks'][0];

export default function TasksDataTable(props: TasksPageProps): JSX.Element {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const tasksQuery = useTasksListQuery({
        assigneed: null,
        business: null,
        city: null,
        client: null,
        status: null,
        taskType: null,
    });

    const [tasks, setTasks] = useState(tasksQuery.data?.tasks);

    const columns = useTasksTableColumns();

    useEffect(() => {
        setTasks(tasksQuery.data?.tasks);
    }, [tasksQuery.data?.tasks]);

    const table = useReactTable<TableItem>({
        data: tasks || [],
        columns: columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: (table, columnId) => {
            if (columnId === 'assigned') {
                return () => {
                    const uniqueValuesMap = new Map<any, number>();
                    const rows = table.getCoreRowModel().rows;

                    rows.forEach((row) => {
                        const assigned: TableItem['assigned'] = row.getValue(columnId);

                        for (const user of assigned) {
                            const valueInMap = uniqueValuesMap.get(user.id);

                            if (typeof valueInMap !== 'undefined') {
                                uniqueValuesMap.set(user.id, valueInMap + 1);
                            } else {
                                uniqueValuesMap.set(user.id, 1);
                            }
                        }
                    });

                    return uniqueValuesMap;
                };
            }

            return globalGetFacetedUniqueValues<TableItem>()(table, columnId);
        },
        state: {
            columnVisibility: {
                branch: false,
                business: false,
                client: false,
            },
            sorting,
            columnFilters,
        },
    });

    if (tasks) {
        return (
            <div className="space-y-4 pb-8">
                <TasksDataTableToolbar table={table} {...props} />

                <div className="rounded-md border">
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
                                        No se encontraron resultados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DataTablePagination table={table} />
            </div>
        );
    }

    if (tasksQuery.error) {
        return <div>Hubo un error al cargar las tareas</div>;
    }

    return (
        <div>
            <TasksDataTableToolbar table={table} {...props} />

            <Skeleton className="h-96 w-full" />
        </div>
    );
}
