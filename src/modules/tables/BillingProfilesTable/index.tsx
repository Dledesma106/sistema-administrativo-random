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

import { useBillingProfilesTableColumns } from './columns';
import type { BillingProfile } from './columns';
import { getBillingProfilesTableToolbarConfig } from './toolbar-config';

import { GetBusinessesQuery, GetClientsQuery } from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { routesBuilder } from '@/lib/routes';

type Props = {
    data: BillingProfile[];
    businesses: GetBusinessesQuery['businesses'];
    clients: GetClientsQuery['clients'];
};

export default function BillingProfilesDataTable({ data, businesses, clients }: Props) {
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

    return (
        <DataTable
            table={table}
            title="Perfiles de Facturación"
            toolbarConfig={getBillingProfilesTableToolbarConfig(businesses, clients)}
            totalCount={data.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            headerActions={
                <Button
                    className="flex items-center gap-1 pr-6"
                    onClick={() =>
                        router.push(routesBuilder.accounting.billingProfiles.create())
                    }
                >
                    <BsPlus size="20" />
                    <span>Crear Perfil</span>
                </Button>
            }
            onRowClick={(row) =>
                router.push(routesBuilder.accounting.billingProfiles.edit(row.id))
            }
        />
    );
}
