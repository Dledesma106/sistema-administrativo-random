import { useRouter } from 'next/router';

import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { useExpensesTableColumns } from './columns';
import { ExpensesDataTableToolbar } from './expenses-table-toolbar';

import {
    ExpenseStatus,
    ExpenseType,
    GetExpensesQuery,
    GetTechniciansQuery,
} from '@/api/graphql';
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
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
        if (typeof window === 'undefined') {
            return [];
        }
        const saved = localStorage.getItem('expensesTableFilters');
        return saved ? JSON.parse(saved) : [];
    });

    const router = useRouter();
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const { data, error } = useGetExpenses({
        skip: page * pageSize,
        take: pageSize,
        registeredBy:
            (columnFilters.find((f) => f.id === 'registeredBy')?.value as string[]) ||
            null,
        status:
            (columnFilters.find((f) => f.id === 'status')?.value as ExpenseStatus[]) ||
            null,
        expenseType:
            (columnFilters.find((f) => f.id === 'expenseType')?.value as ExpenseType[]) ||
            null,
    });
    const { user } = useUserContext();
    const columns = useExpensesTableColumns();

    // Guardar filtros en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem('expensesTableFilters', JSON.stringify(columnFilters));
    }, [columnFilters]);

    const table = useReactTable<TableItem>({
        data: data?.expenses || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: (filters) => {
            setColumnFilters(filters);
            setPage(0);
        },
        state: {
            columnVisibility: {
                branch: false,
                business: false,
                client: false,
            },
            columnFilters,
        },
    });

    if (error) {
        return <div>Hubo un error al cargar los gastos</div>;
    }

    if (!data) {
        return (
            <div className="space-y-4 pb-8">
                <ExpensesDataTableToolbar table={table} {...props} />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

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

            <DataTablePagination
                table={table}
                totalCount={data?.expensesCount || 0}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
            />
        </div>
    );
}
