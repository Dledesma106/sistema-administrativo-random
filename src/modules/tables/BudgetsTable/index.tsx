import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

import { useBudgetsTableColumns } from './columns';

import { BudgetStatus } from '@/components/ui/Badges/BudgetStatusBadge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';

type Props = {
    data: {
        id: string;
        company: string;
        description: string;
        price: number;
        status: BudgetStatus;
    }[];
};

export default function BudgetsDataTable({ data }: Props) {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const columns = useBudgetsTableColumns();

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
            <Link href="/accounting/budgets/new">
                <BsPlus size="20" />
                <span>Crear Presupuesto</span>
            </Link>
        </Button>
    );

    return (
        <DataTable
            table={table}
            title="Presupuestos"
            totalCount={data.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            headerActions={headerActions}
            onRowClick={(row) => router.push(`/accounting/budgets/${row.id}`)}
        />
    );
}
