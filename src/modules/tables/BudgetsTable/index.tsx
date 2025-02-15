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

import { BudgetsDataTableToolbar } from './budgets-table-toolbar';
import { useBudgetsTableColumns } from './columns';

import { BudgetStatus } from '@/components/ui/Badges/BudgetStatusBadge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { routesBuilder } from '@/lib/routes';

type Props = {
    data: {
        id: string;
        company: string;
        description: string;
        price: number;
        status: BudgetStatus;
    }[];
    businesses: {
        id: string;
        name: string;
    }[];
};

export default function BudgetsDataTable({ data, businesses }: Props) {
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
            <Link href={routesBuilder.accounting.budgets.create()}>
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
            toolbar={<BudgetsDataTableToolbar table={table} businesses={businesses} />}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            headerActions={headerActions}
            onRowClick={(row) =>
                router.push(routesBuilder.accounting.budgets.details(row.id))
            }
        />
    );
}
