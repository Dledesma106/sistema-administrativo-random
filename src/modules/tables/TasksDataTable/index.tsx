import Link from 'next/link';
import { useRouter } from 'next/router';

import { Role, TaskStatus, TaskType } from '@prisma/client';
import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { useTasksTableColumns } from './columns';
import { TasksDataTableToolbar } from './tasks-table-toolbar';

import {
    GetCitiesQuery,
    GetProvincesQuery,
    GetClientsQuery,
    GetBusinessesQuery,
    GetTechniciansQuery,
    TasksQuery,
} from '@/api/graphql';
import { DataTablePagination } from '@/components/data-table-pagination';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TaskReportButton } from '@/components/ui/TaskReportButton';
import { TypographyH1 } from '@/components/ui/typography';
import { useUserContext } from '@/context/userContext/UserProvider';
import { useGetTasks } from '@/hooks/api/tasks/useGetTasks';
import { routesBuilder } from '@/lib/routes';

type TableItem = TasksQuery['tasks'][number];

type Props = {
    cities: NonNullable<GetCitiesQuery['cities']>;
    provinces: NonNullable<GetProvincesQuery['provinces']>;
    clients: NonNullable<GetClientsQuery['clients']>;
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
    techs: NonNullable<GetTechniciansQuery['technicians']>;
};

export default function TasksDataTable(props: Props): JSX.Element {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
        if (typeof window === 'undefined') {
            return [];
        }
        const saved = localStorage.getItem('tasksTableFilters');
        return saved ? JSON.parse(saved) : [];
    });

    const router = useRouter();
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const { data, error } = useGetTasks({
        skip: page * pageSize,
        take: pageSize,
        assigned:
            (columnFilters.find((f) => f.id === 'assigned')?.value as string[]) || null,
        business:
            (columnFilters.find((f) => f.id === 'business')?.value as string[]) || null,

        city: (columnFilters.find((f) => f.id === 'city')?.value as string[]) || null,
        status:
            (columnFilters.find((f) => f.id === 'status')?.value as TaskStatus[]) || null,
        client: (columnFilters.find((f) => f.id === 'client')?.value as string[]) || null,
        taskType:
            (columnFilters.find((f) => f.id === 'taskType')?.value as TaskType[]) || null,
    });

    const { user } = useUserContext();
    const columns = useTasksTableColumns();

    useEffect(() => {
        localStorage.setItem('tasksTableFilters', JSON.stringify(columnFilters));
    }, [columnFilters]);

    const table = useReactTable<TableItem>({
        data: data?.tasks || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: (filters) => {
            setColumnFilters(filters);
            setPage(0);
        },
        state: {
            columnVisibility: {
                branch: false,
                business: false,
                client: false,
            },
            columnFilters,
        },
    });

    if (error) {
        return <div>Hubo un error al cargar las tareas</div>;
    }

    if (!data) {
        return (
            <div className="space-y-4 pb-8">
                <TasksDataTableToolbar table={table} {...props} />
                <TableSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-8">
            <div className="flex justify-between">
                <TypographyH1>Tareas</TypographyH1>
                <div className="flex gap-2">
                    {(user.roles.includes(Role.AdministrativoContable) ||
                        user.roles.includes(Role.Auditor)) && (
                        <TaskReportButton table={table} />
                    )}
                    {user.roles.includes(Role.AdministrativoTecnico) && (
                        <Button asChild className="flex items-center space-x-2">
                            <Link href={routesBuilder.tasks.create()}>
                                <BsPlus size="20" />
                                <span>Delegar tarea</span>
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
            <TasksDataTableToolbar table={table} {...props} />
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="border-b bg-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    onClick={() =>
                                        router.push(
                                            routesBuilder.tasks.details(row.original.id),
                                        )
                                    }
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

            <DataTablePagination
                table={table}
                totalCount={data?.tasksCount || 0}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
            />
        </div>
    );
}
