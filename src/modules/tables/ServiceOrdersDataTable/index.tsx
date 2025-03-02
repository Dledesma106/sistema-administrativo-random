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
import type { ServiceOrder } from './columns';
import { getServiceOrdersTableToolbarConfig } from './toolbar-config';

import { GetClientsQuery, GetBusinessesQuery } from '@/api/graphql';
import { DataTable } from '@/components/ui/data-table';
import { routesBuilder } from '@/lib/routes';

const mockData: ServiceOrder[] = [
    {
        id: '1',
        orderNumber: 'OS-001',
        businessName: 'Empresa A',
        clientName: 'Cliente X',
        branch: {
            number: '001',
            city: {
                name: 'Buenos Aires',
                province: {
                    name: 'Buenos Aires',
                },
            },
        },
        description: 'Instalación de equipos de aire acondicionado',
        status: 'Pendiente',
    },
    {
        id: '2',
        orderNumber: 'OS-002',
        businessName: 'Empresa B',
        clientName: 'Cliente Y',
        description: 'Mantenimiento preventivo de sistemas de refrigeración',
        status: 'EnProgreso',
    },
    {
        id: '3',
        orderNumber: 'OS-003',
        businessName: 'Empresa C',
        clientName: 'Cliente Z',
        branch: {
            number: '002',
            city: {
                name: 'Córdoba',
                province: {
                    name: 'Córdoba',
                },
            },
        },
        description: 'Reparación de sistema de ventilación',
        status: 'Finalizado',
    },
];

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

    const columns = useServiceOrdersTableColumns();

    const table = useReactTable({
        data: mockData,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
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
            totalCount={mockData.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={(row) => router.push(routesBuilder.serviceOrders.details(row.id))}
        />
    );
}
