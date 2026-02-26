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

import { useBillingTableColumns, Bill } from './columns';
import { getBillingTableToolbarConfig } from './toolbar-config';

import { GetBusinessesQuery } from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { routesBuilder } from '@/lib/routes';

type Props = {
    data: Bill[];
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
};

export default function BillingDataTable({ data, businesses }: Props) {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const columns = useBillingTableColumns();

    const table = useReactTable({
        data,
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
            totalCount={data.length}
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
