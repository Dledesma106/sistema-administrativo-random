import Link from 'next/link';

import {
    ColumnFiltersState,
    SortingState,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { getClientBranchesTableColumns } from './client-branches-columns';
import { getClientBranchesTableToolbarConfig } from './toolbar-config';

import { GetBusinessesQuery, GetCitiesQuery, GetClientQuery } from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetClientBranches } from '@/hooks/api/branch/useGetClientBranches';
import { routesBuilder } from '@/lib/routes';

type Props = {
    client: NonNullable<GetClientQuery['client']>;
    cities: NonNullable<GetCitiesQuery['cities']>;
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
};

export const ClientBranchesTable = ({ client, cities, businesses }: Props) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Extraer los filtros actuales como arrays
    const cityFilter =
        (columnFilters.find((filter) => filter.id === 'city')?.value as string[]) || null;
    const businessFilter =
        (columnFilters.find((filter) => filter.id === 'businesses')?.value as string[]) ||
        null;

    const { data: branchesData, error: branchesError } = useGetClientBranches({
        clientId: client.id,
        cityId: cityFilter,
        businessId: businessFilter,
        skip: page * pageSize,
        take: pageSize,
    });

    const columns = getClientBranchesTableColumns(client);

    const table = useReactTable({
        data: branchesData?.clientBranches || [],
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
            pagination: {
                pageIndex: page - 1,
                pageSize,
            },
        },
    });

    if (branchesData) {
        return (
            <DataTable
                table={table}
                title={`Sucursales de ${client.name}`}
                toolbarConfig={getClientBranchesTableToolbarConfig(
                    cities,
                    businesses,
                    table,
                )}
                totalCount={branchesData.clientBranchesCount || 0}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                headerActions={
                    <Button asChild className="flex items-center space-x-2">
                        <Link href={routesBuilder.branches.create(client.id)}>
                            <BsPlus size="20" />
                            <span>Agregar sucursal</span>
                        </Link>
                    </Button>
                }
            />
        );
    }

    if (branchesError) {
        return <div>Hubo un error al cargar las sucursales</div>;
    }

    return (
        <div className="space-y-4 pb-8">
            <TableSkeleton />
        </div>
    );
};
