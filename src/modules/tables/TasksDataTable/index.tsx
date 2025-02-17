import { useRouter } from 'next/router';

import { Role, TaskStatus, TaskType } from '@prisma/client';
import {
    ColumnFiltersState,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { useTasksTableColumns } from './columns';
import { getTasksTableToolbarConfig } from './toolbar-config';

import {
    GetCitiesQuery,
    GetProvincesQuery,
    GetClientsQuery,
    GetBusinessesQuery,
    GetTechniciansQuery,
} from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { TableSkeleton } from '@/components/ui/skeleton';
import { TaskReportButton } from '@/components/ui/TaskReportButton';
import { useUserContext } from '@/context/userContext/UserProvider';
import { useGetTasks } from '@/hooks/api/tasks/useGetTasks';
import { routesBuilder } from '@/lib/routes';

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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('tasksTableFilters', JSON.stringify(columnFilters));
        }
    }, [columnFilters]);

    const router = useRouter();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { user } = useUserContext();
    const columns = useTasksTableColumns();

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

    const table = useReactTable({
        data: data?.tasks || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
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
        return <TableSkeleton />;
    }

    return (
        <DataTable
            table={table}
            title="Tareas"
            toolbarConfig={getTasksTableToolbarConfig(
                props.cities,
                props.clients,
                props.businesses,
                props.techs,
            )}
            totalCount={data?.tasksCount || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={(row) => router.push(routesBuilder.tasks.details(row.id))}
            headerActions={
                <>
                    {(user.roles.includes(Role.AdministrativoContable) ||
                        user.roles.includes(Role.Auditor)) && (
                        <TaskReportButton table={table} />
                    )}
                    {user.roles.includes(Role.AdministrativoTecnico) && (
                        <Button onClick={() => router.push(routesBuilder.tasks.create())}>
                            <BsPlus size={32} />
                            Delegar tarea
                        </Button>
                    )}
                </>
            }
        />
    );
}
