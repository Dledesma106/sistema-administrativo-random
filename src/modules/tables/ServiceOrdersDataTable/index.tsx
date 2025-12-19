import { useRouter } from 'next/router';

import {
    ColumnFiltersState,
    SortingState,
    getCoreRowModel,
    getFacetedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { useServiceOrdersTableColumns } from './columns';
import { getServiceOrdersTableToolbarConfig } from './toolbar-config';

import type { GetClientsQuery, GetBusinessesQuery, ServiceOrder } from '@/api/graphql';
import { DataTable } from '@/components/ui/data-table';
import { useGetServiceOrders } from '@/hooks/api/serviceOrders/useGetServiceOrders';
import { routesBuilder } from '@/lib/routes';

type Props = {
    clients: NonNullable<GetClientsQuery['clients']>;
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
};

export default function ServiceOrdersDataTable({ clients, businesses }: Props) {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Extraer filtros de las columnas
    const businessFilter = columnFilters.find((f) => f.id === 'businessName')?.value as
        | string
        | undefined;
    const clientFilter = columnFilters.find((f) => f.id === 'clientName')?.value as
        | string
        | undefined;
    const statusFilter = columnFilters.find((f) => f.id === 'status')?.value as
        | string
        | undefined;

    // Extraer ordenamiento
    const orderBy = sorting[0]?.id;
    const orderDirection = sorting[0]?.desc ? 'desc' : 'asc';

    // Obtener datos con el hook
    const { data } = useGetServiceOrders({
        skip: page * pageSize,
        take: pageSize,
        ...(businessFilter && { businessId: businessFilter }),
        ...(clientFilter && { clientId: clientFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(orderBy && { orderBy }),
        ...(orderDirection && { orderDirection }),
    });

    // Usar directamente los datos de GraphQL
    const serviceOrders = (data?.serviceOrders || []) as ServiceOrder[];

    const columns = useServiceOrdersTableColumns();

    const table = useReactTable({
        data: serviceOrders,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        pageCount: Math.ceil((data?.serviceOrdersCount || 0) / pageSize),
        state: {
            sorting,
            columnFilters,
            pagination: {
                pageIndex: page,
                pageSize,
            },
        },
    });

    return (
        <DataTable
            table={table}
            title="Órdenes de Servicio"
            toolbarConfig={getServiceOrdersTableToolbarConfig(businesses, clients)}
            totalCount={data?.serviceOrdersCount || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={(row) => router.push(routesBuilder.serviceOrders.details(row.id))}
        />
    );
}
