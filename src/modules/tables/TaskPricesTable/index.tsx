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

import { TaskPrice, useTaskPricesTableColumns } from './columns';
import { getTaskPricesTableToolbarConfig } from './toolbar-config';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { routesBuilder } from '@/lib/routes';

type Props = {
    data: {
        id: string;
        businessName: string;
        taskType: string;
        price: number;
    }[];
    businesses: {
        id: string;
        name: string;
    }[];
};

export default function TaskPricesDataTable({ data, businesses }: Props) {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const columns = useTaskPricesTableColumns();
    const table = useReactTable<TaskPrice>({
        data: data as TaskPrice[],
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
            <Link href={routesBuilder.accounting.taskPrices.create()}>
                <BsPlus size="20" />
                <span>Crear precio</span>
            </Link>
        </Button>
    );

    return (
        <DataTable
            table={table}
            title="Precios por tarea"
            toolbarConfig={getTaskPricesTableToolbarConfig(businesses)}
            totalCount={data.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            headerActions={headerActions}
            onRowClick={(row) =>
                router.push(routesBuilder.accounting.taskPrices.edit(row.id))
            }
        />
    );
}
