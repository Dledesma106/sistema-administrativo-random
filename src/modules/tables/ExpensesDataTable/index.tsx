import { useRouter } from 'next/router';

import {
    ColumnFiltersState,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { useExpensesTableColumns } from './columns';
import { getExpensesTableToolbarConfig } from './toolbar-config';

import {
    ExpensePaySource,
    ExpenseStatus,
    ExpenseType,
    GetExpensesQuery,
    GetTechniciansQuery,
} from '@/api/graphql';
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

    const router = useRouter();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
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
                user.roles.includes('AdministrativoContable') && (
                    <ExpenseReportButton table={table} />
                )
            }
        />
    );
}
