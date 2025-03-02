import { useRouter } from 'next/router';

import {
    ColumnFiltersState,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { useUsersTableColumns } from './columns';
import { getUsersTableToolbarConfig } from './toolbar-config';

import { GetCitiesQuery, Role } from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetUsers } from '@/hooks/api/user/useGetUsers';
import { routesBuilder } from '@/lib/routes';

interface Props {
    cities: GetCitiesQuery['cities'];
}

export function UsersDataTable({ cities }: Props) {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const columns = useUsersTableColumns();

    const { data, error, refetch, isFetching } = useGetUsers({
        skip: page * pageSize,
        take: pageSize,
        search: searchTerm || undefined,
        cityId: (columnFilters.find((f) => f.id === 'cityId')?.value as string[])?.map(
            (city) => city as string,
        ),
        roles: (columnFilters.find((f) => f.id === 'roleFilter')?.value as string[])?.map(
            (role) => role as Role,
        ),
    });

    const table = useReactTable({
        data: data?.users || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil((data?.usersCount || 0) / pageSize),
        onColumnFiltersChange: (filters) => {
            setColumnFilters(filters);
            setPage(0);
        },
        state: {
            pagination: {
                pageIndex: page,
                pageSize: pageSize,
            },
            columnFilters,
            columnVisibility: {
                cityId: false,
                roleFilter: false,
            },
        },
    });

    useEffect(() => {
        refetch();
    }, [page, pageSize, refetch]);

    useEffect(() => {
        setPage(0);
        refetch();
    }, [searchTerm, columnFilters, refetch]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    if (error) {
        return <div>Hubo un error al cargar los usuarios</div>;
    }

    if (!data || isFetching) {
        return <TableSkeleton />;
    }

    return (
        <DataTable
            table={table}
            title="Usuarios"
            toolbarConfig={getUsersTableToolbarConfig(cities, searchTerm, handleSearch)}
            totalCount={data?.usersCount || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={(row) => router.push(routesBuilder.users.edit(row.id))}
            headerActions={
                <Button
                    className="flex items-center gap-1 pr-6"
                    onClick={() => router.push(routesBuilder.users.create())}
                >
                    <BsPlus size="20" />
                    <span>Agregar usuario</span>
                </Button>
            }
        />
    );
}
