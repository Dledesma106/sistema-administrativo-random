import Link from 'next/link';
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

import { BillingProfilesDataTableToolbar } from './billing-profiles-table-toolbar';
import { useBillingProfilesTableColumns } from './columns';
import type { BillingProfile } from './columns';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { routesBuilder } from '@/lib/routes';

type Props = {
    data: BillingProfile[];
};

export default function BillingProfilesDataTable({ data }: Props) {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const columns = useBillingProfilesTableColumns();

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

    const headerActions = (
        <Button asChild className="flex items-center space-x-2">
            <Link href="/accounting/billing-profiles/new">
                <BsPlus size="20" />
                <span>Crear Perfil</span>
            </Link>
        </Button>
    );

    return (
        <DataTable
            table={table}
            title="Perfiles de Facturación"
            toolbar={<BillingProfilesDataTableToolbar table={table} />}
            totalCount={data.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            headerActions={headerActions}
            onRowClick={(row) =>
                router.push(routesBuilder.accounting.billingProfiles.edit(row.id))
            }
        />
    );
}
