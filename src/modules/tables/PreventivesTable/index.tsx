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
import { getPreventivesTableToolbarConfig } from './toolbar-config';

import {
    GetBusinessesQuery,
    GetCitiesQuery,
    GetClientsQuery,
    GetTechniciansQuery,
    PreventiveFrequency,
    PreventiveStatus,
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
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
        if (typeof window === 'undefined') {
            return [];
        }
        const saved = localStorage.getItem('preventivesTableFilters');
        return saved ? JSON.parse(saved) : [];
    });

    const [page, setPage] = useState(() => {
        if (typeof window === 'undefined') {
            return 0;
        }
        const saved = localStorage.getItem('preventivesTablePage');
        return saved ? parseInt(saved) : 0;
    });

    const [pageSize, setPageSize] = useState(() => {
        if (typeof window === 'undefined') {
            return 10;
        }
        const saved = localStorage.getItem('preventivesTablePageSize');
        return saved ? parseInt(saved) : 10;
    });

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
        frequency:
            (columnFilters.find((f) => f.id === 'frequency')
                ?.value as PreventiveFrequency[]) || undefined,
        months:
            (columnFilters.find((f) => f.id === 'months')?.value as string[]) ||
            undefined,
        status:
            (columnFilters.find((f) => f.id === 'status')?.value as PreventiveStatus[]) ||
            undefined,
    });

    useEffect(() => {
        refetch();
    }, [page, pageSize, columnFilters, refetch]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(
                'preventivesTableFilters',
                JSON.stringify(columnFilters),
            );
        }
    }, [columnFilters]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('preventivesTablePage', page.toString());
        }
    }, [page]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('preventivesTablePageSize', pageSize.toString());
        }
    }, [pageSize]);

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
            toolbarConfig={getPreventivesTableToolbarConfig(
                businesses,
                cities,
                technicians,
                clients,
            )}
            totalCount={data?.preventivesCount || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={(row) => router.push(routesBuilder.preventives.details(row.id))}
            headerActions={
                <Button
                    className="flex items-center gap-1 pr-6"
                    onClick={() => router.push(routesBuilder.preventives.create())}
                >
                    <Plus size="20" />
                    <span>Crear Preventivo</span>
                </Button>
            }
        />
    );
};
