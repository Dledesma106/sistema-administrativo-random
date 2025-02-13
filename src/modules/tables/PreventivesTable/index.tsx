/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/router';

import {
    ColumnFiltersState,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { PREVENTIVES_TABLE_COLUMNS } from './columns';
import { PreventivesTableToolbar } from './preventives-table-toolbar';

import {
    GetBusinessesQuery,
    GetCitiesQuery,
    GetClientsQuery,
    GetTechniciansQuery,
} from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetPreventives } from '@/hooks/api/preventive/useGetPreventives';
import { routesBuilder } from '@/lib/routes';

interface PreventivesTableProps {
    clients: NonNullable<GetClientsQuery['clients']>;
    cities: NonNullable<GetCitiesQuery['cities']>;
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
    technicians: NonNullable<GetTechniciansQuery['technicians']>;
}

export const PreventivesTable = ({
    clients,
    cities,
    businesses,
    technicians,
}: PreventivesTableProps) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const router = useRouter();

    const { data, isFetching, refetch } = useGetPreventives({
        skip: page * pageSize,
        take: pageSize,
        business:
            (columnFilters.find((f) => f.id === 'business.name')?.value as string[]) ||
            undefined,
        city:
            (columnFilters.find((f) => f.id === 'city')?.value as string[]) || undefined,
        assigned:
            (columnFilters.find((f) => f.id === 'assigned')?.value as string[]) ||
            undefined,
        client:
            (columnFilters.find((f) => f.id === 'branch.client.id')?.value as string[]) ||
            undefined,
    });

    useEffect(() => {
        refetch();
    }, [page, pageSize, columnFilters, refetch]);

    const table = useReactTable({
        data: data?.preventives || [],
        columns: PREVENTIVES_TABLE_COLUMNS,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: (filters) => {
            setColumnFilters(filters);
            setPage(0); // Resetear página al filtrar
        },
        state: {
            columnFilters,
            columnVisibility: {
                city: false,
                'branch.client.id': false,
            },
        },
        manualPagination: true,
        pageCount: Math.ceil((data?.preventivesCount || 0) / pageSize),
    });

    if (isFetching) {
        return <TableSkeleton />;
    }

    return (
        <DataTable
            table={table}
            title="Preventivos"
            toolbar={
                <PreventivesTableToolbar
                    table={table}
                    cities={cities}
                    businesses={businesses}
                    clients={clients}
                    technicians={technicians}
                />
            }
            headerActions={
                <Button onClick={() => router.push(routesBuilder.preventives.create())}>
                    <Plus />
                    Nuevo Preventivo
                </Button>
            }
            totalCount={data?.preventivesCount || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={(row) => router.push(routesBuilder.preventives.details(row.id))}
        />
    );
};
