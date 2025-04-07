import { useRouter } from 'next/router';

import {
    ColumnFiltersState,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { useExpensesTableColumns } from './columns';
import { getExpensesTableToolbarConfig } from './toolbar-config';

import {
    ExpensePaySource,
    ExpenseStatus,
    ExpenseType,
    GetExpensesQuery,
    GetTechniciansQuery,
} from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ExpenseReportButton } from '@/components/ui/ExpenseReportButton';
import { TableSkeleton } from '@/components/ui/skeleton';
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

    const [sorting, setSorting] = useState<SortingState>(() => {
        if (typeof window === 'undefined') {
            return [];
        }
        const saved = localStorage.getItem('expensesTableSorting');
        return saved
            ? JSON.parse(saved)
            : [
                  {
                      id: 'expenseDate',
                      desc: true,
                  },
              ];
    });

    const [page, setPage] = useState(() => {
        if (typeof window === 'undefined') {
            return 0;
        }
        const saved = localStorage.getItem('expensesTablePage');
        return saved ? parseInt(saved) : 0;
    });

    const [pageSize, setPageSize] = useState(() => {
        if (typeof window === 'undefined') {
            return 10;
        }
        const saved = localStorage.getItem('expensesTablePageSize');
        return saved ? parseInt(saved) : 10;
    });

    const router = useRouter();
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
        paySource:
            (columnFilters.find((f) => f.id === 'paySource')
                ?.value as ExpensePaySource[]) || null,
        expenseDateFrom:
            (columnFilters.find((f) => f.id === 'expenseDate')?.value as { from?: Date })
                ?.from || null,
        expenseDateTo:
            (columnFilters.find((f) => f.id === 'expenseDate')?.value as { to?: Date })
                ?.to || null,
        orderBy: sorting.length > 0 ? sorting[0].id : null,
        orderDirection: sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : null,
    });
    const { user } = useUserContext();
    const columns = useExpensesTableColumns();

    useEffect(() => {
        localStorage.setItem('expensesTableFilters', JSON.stringify(columnFilters));
    }, [columnFilters]);

    useEffect(() => {
        localStorage.setItem('expensesTableSorting', JSON.stringify(sorting));
    }, [sorting]);

    useEffect(() => {
        localStorage.setItem('expensesTablePage', page.toString());
    }, [page]);

    useEffect(() => {
        localStorage.setItem('expensesTablePageSize', pageSize.toString());
    }, [pageSize]);

    const table = useReactTable<TableItem>({
        data: data?.expenses || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: (filters) => {
            setColumnFilters(filters);
            setPage(0);
        },
        onSortingChange: setSorting,
        state: {
            columnVisibility: {
                branch: false,
                business: false,
                client: false,
            },
            columnFilters,
            sorting,
        },
    });

    if (error) {
        return <div>Hubo un error al cargar los gastos</div>;
    }

    if (!data) {
        return (
            <div className="space-y-4 pb-8">
                <TableSkeleton />
            </div>
        );
    }

    return (
        <DataTable
            table={table}
            title="Gastos"
            toolbarConfig={getExpensesTableToolbarConfig(props.techs)}
            totalCount={data?.expensesCount || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={(row) =>
                router.push(routesBuilder.accounting.expenses.details(row.id))
            }
            headerActions={
                <>
                    {user.roles.includes('AdministrativoContable') && (
                        <ExpenseReportButton table={table} />
                    )}
                    {user.roles.includes('AdministrativoContable') && (
                        <Button
                            className="flex items-center gap-1 pr-6"
                            onClick={() => router.push('/accounting/expenses/create')}
                        >
                            <BsPlus size="20" />
                            <span>Crear gasto</span>
                        </Button>
                    )}
                </>
            }
        />
    );
}
