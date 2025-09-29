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
import { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { useBudgetsTableColumns } from './columns';
import { getBudgetsTableToolbarConfig } from './toolbar-config';

import { GetBusinessesQuery, GetClientsQuery } from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBudgets } from '@/hooks/api/budget/useGetBudgets';
import { routesBuilder } from '@/lib/routes';

type Props = {
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
    clients: NonNullable<GetClientsQuery['clients']>;
};

export default function BudgetsDataTable({ businesses, clients }: Props) {
    const router = useRouter();

    // Estados con persistencia en localStorage
    const [searchTerm, setSearchTerm] = useState<string>(() => {
        if (typeof window === 'undefined') {
            return '';
        }
        return localStorage.getItem('budgetsTableSearch') || '';
    });
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
        if (typeof window === 'undefined') {
            return [];
        }
        const saved = localStorage.getItem('budgetsTableFilters');
        return saved ? JSON.parse(saved) : [];
    });

    const [sorting, setSorting] = useState<SortingState>(() => {
        if (typeof window === 'undefined') {
            return [];
        }
        const saved = localStorage.getItem('budgetsTableSorting');
        return saved
            ? JSON.parse(saved)
            : [
                  {
                      id: 'createdAt',
                      desc: true,
                  },
              ];
    });

    const [page, setPage] = useState(() => {
        if (typeof window === 'undefined') {
            return 0;
        }
        const saved = localStorage.getItem('budgetsTablePage');
        return saved ? parseInt(saved) : 0;
    });

    const [pageSize, setPageSize] = useState(() => {
        if (typeof window === 'undefined') {
            return 10;
        }
        const saved = localStorage.getItem('budgetsTablePageSize');
        return saved ? parseInt(saved) : 10;
    });

    // Persistir estados en localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('budgetsTableFilters', JSON.stringify(columnFilters));
        }
    }, [columnFilters]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('budgetsTableSorting', JSON.stringify(sorting));
        }
    }, [sorting]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('budgetsTablePage', page.toString());
        }
    }, [page]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('budgetsTablePageSize', pageSize.toString());
        }
    }, [pageSize]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('budgetsTableSearch', searchTerm);
        }
    }, [searchTerm]);

    const columns = useBudgetsTableColumns();

    const budgetsVariables = {
        skip: page * pageSize,
        take: pageSize,
        search: searchTerm || null,
        businessId:
            (columnFilters.find((f) => f.id === 'business')?.value as string[]) || null,
        clientId:
            (columnFilters.find((f) => f.id === 'client')?.value as string[]) || null,
        orderBy: sorting.length > 0 ? sorting[0].id : null,
        orderDirection: sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : null,
    } as unknown as Parameters<typeof useGetBudgets>[0];

    const { data, error, isLoading } = useGetBudgets(budgetsVariables);

    const table = useReactTable({
        data: data?.budgets || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: (filters) => {
            setColumnFilters(filters);
            setPage(0);
        },
        onSortingChange: setSorting,
        state: {
            columnVisibility: {
                // Ocultar columnas que no se muestran por defecto
            },
            columnFilters,
            sorting,
            pagination: {
                pageIndex: page,
                pageSize,
            },
        },
    });

    if (error) {
        return <div>Hubo un error al cargar los presupuestos</div>;
    }

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (!data) {
        return <TableSkeleton />;
    }

    return (
        <DataTable
            table={table}
            title="Presupuestos"
            toolbarConfig={getBudgetsTableToolbarConfig(businesses, clients, {
                searchTerm,
                onSearch: (term: string) => {
                    setSearchTerm(term);
                    setPage(0);
                },
            })}
            totalCount={data?.budgetsCount || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={(row) =>
                router.push(routesBuilder.accounting.budgets.details(row.id))
            }
            headerActions={
                <Button
                    className="flex items-center gap-1 pr-6"
                    onClick={() => router.push(routesBuilder.accounting.budgets.create())}
                >
                    <BsPlus size="20" />
                    <span>Crear Presupuesto</span>
                </Button>
            }
        />
    );
}
