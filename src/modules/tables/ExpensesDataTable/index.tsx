import { useRouter } from 'next/router';

import {
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues as globalGetFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { useExpensesTableColumns } from './columns';
import { ExpensesDataTableToolbar } from './expenses-table-toolbar';

import { GetExpensesQuery, GetTechniciansQuery } from '@/api/graphql';
import { DataTablePagination } from '@/components/data-table-pagination';
import { ExpenseReportButton } from '@/components/ui/ExpenseReportButton';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TypographyH1 } from '@/components/ui/typography';
import { useUserContext } from '@/context/userContext/UserProvider';
import { useGetExpenses } from '@/hooks/api/expenses/useGetExpenses';
import { routesBuilder } from '@/lib/routes';

type TableItem = NonNullable<GetExpensesQuery['expenses']>[number];

interface ExpensesDataTableProps {
    techs: NonNullable<GetTechniciansQuery['technicians']>;
}

export default function ExpensesDataTable(props: ExpensesDataTableProps): JSX.Element {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
        if (typeof window === 'undefined') {
            return [];
        }
        const saved = localStorage.getItem('expensesTableFilters');
        return saved ? JSON.parse(saved) : [];
    });

    const router = useRouter();
    const { data, error } = useGetExpenses({
        registeredBy: null,
        status: null,
        expenseType: null,
    });
    const { user } = useUserContext();
    const [expenses, setExpenses] = useState(data?.expenses);
    const columns = useExpensesTableColumns();

    useEffect(() => {
        setExpenses(data?.expenses);
    }, [data?.expenses]);

    useEffect(() => {
        localStorage.setItem('expensesTableFilters', JSON.stringify(columnFilters));
    }, [columnFilters]);

    const table = useReactTable<TableItem>({
        data: expenses || [],
        columns: columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: (table, columnId) => {
            if (columnId === 'registeredBy') {
                return () => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const uniqueValuesMap = new Map<any, number>();
                    const rows = table.getCoreRowModel().rows;

                    rows.forEach((row) => {
                        const registeredBy: TableItem['registeredBy'] =
                            row.getValue(columnId);

                        const valueInMap = uniqueValuesMap.get(registeredBy.id);

                        if (typeof valueInMap !== 'undefined') {
                            uniqueValuesMap.set(registeredBy.id, valueInMap + 1);
                        } else {
                            uniqueValuesMap.set(registeredBy.id, 1);
                        }
                    });

                    return uniqueValuesMap;
                };
            }

            return globalGetFacetedUniqueValues<TableItem>()(table, columnId);
        },
        state: {
            columnVisibility: {
                branch: false,
                business: false,
                client: false,
            },
            sorting,
            columnFilters,
        },
    });

    if (expenses) {
        return (
            <div className="space-y-4 pb-8">
                <div className="flex justify-between">
                    <TypographyH1>Gastos</TypographyH1>
                    <div className="flex gap-2">
                        {user.roles.includes('AdministrativoContable') && (
                            <ExpenseReportButton table={table} />
                        )}
                    </div>
                </div>
                <ExpensesDataTableToolbar table={table} {...props} />

                <div className="rounded-md border">
                    <Table>
                        <TableHeader className="border-b bg-white">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        onClick={() =>
                                            router.push(
                                                routesBuilder.accounting.expenses.details(
                                                    row.original.id,
                                                ),
                                            )
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No se encontraron resultados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DataTablePagination table={table} />
            </div>
        );
    }

    if (error) {
        return <div>Hubo un error al cargar las tareas</div>;
    }

    return (
        <div className="space-y-4 pb-8">
            <ExpensesDataTableToolbar table={table} {...props} />

            <Skeleton className="h-96 w-full" />
        </div>
    );
}
