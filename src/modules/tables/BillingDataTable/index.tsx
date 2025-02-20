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
import { BsPlus } from 'react-icons/bs';

import { useBillingTableColumns } from './columns';
import type { Bill } from './columns';
import { getBillingTableToolbarConfig } from './toolbar-config';

import { GetBusinessesQuery } from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { routesBuilder } from '@/lib/routes';

const mockData: Bill[] = [
    {
        id: '1',
        businessName: 'Empresa A',
        contactName: 'Juan Pérez',
        contactEmail: 'juan.perez@empresaa.com',
        billingEmail: 'facturacion@empresaa.com',
        description: 'Servicios de mantenimiento preventivo - Marzo 2024',
        status: 'Pendiente',
        amount: 150000,
    },
    {
        id: '2',
        businessName: 'Empresa B',
        contactName: 'María González',
        contactEmail: 'maria.gonzalez@empresab.com',
        billingEmail: 'administracion@empresab.com',
        description: 'Instalación de equipos nuevos y configuración',
        status: 'Borrador',
        amount: 280000,
    },
    {
        id: '3',
        businessName: 'Empresa C',
        contactName: 'Carlos Rodríguez',
        contactEmail: 'carlos.rodriguez@empresac.com',
        billingEmail: 'pagos@empresac.com',
        description: 'Reparaciones emergencia - Febrero 2024',
        status: 'Pagado',
        amount: 95000,
    },
];

type Props = {
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
};

export default function BillingDataTable({ businesses }: Props) {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const columns = useBillingTableColumns();

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
            title="Facturación"
            toolbarConfig={getBillingTableToolbarConfig(businesses)}
            totalCount={mockData.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            headerActions={
                <Button
                    className="flex items-center gap-1 pr-6"
                    onClick={() => router.push(routesBuilder.accounting.billing.create())}
                >
                    <BsPlus size="20" />
                    <span>Crear factura</span>
                </Button>
            }
            onRowClick={(row) =>
                router.push(routesBuilder.accounting.billing.details(row.id))
            }
        />
    );
}
