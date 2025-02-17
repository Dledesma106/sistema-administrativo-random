import { useRouter } from 'next/router';

import {
    ColumnFiltersState,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { useCitiesTableColumns } from './columns';
import { getCitiesTableToolbarConfig } from './toolbar-config';

import { GetProvincesQuery } from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetCities } from '@/hooks/api/city/useGetCities';
import { routesBuilder } from '@/lib/routes';

type CitiesDataTableProps = {
    provinces: GetProvincesQuery['provinces'];
};

export function CitiesDataTable({ provinces }: CitiesDataTableProps) {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const columns = useCitiesTableColumns();

    const { data, error, refetch, isFetching } = useGetCities({
        skip: page * pageSize,
        take: pageSize,
        search: searchTerm || undefined,
        provinceId: (
            columnFilters.find((f) => f.id === 'provinceId')?.value as string[]
        )?.[0],
    });

    const table = useReactTable({
        data: data?.cities || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil((data?.citiesCount || 0) / pageSize),
        onColumnFiltersChange: (filters) => {
            setColumnFilters(filters);
            setPage(0);
        },
        state: {
            pagination: {
                pageIndex: page,
                pageSize: pageSize,
            },
            columnFilters,
            columnVisibility: {
                provinceId: false,
            },
        },
    });

    useEffect(() => {
        refetch();
    }, [page, pageSize, refetch]);

    useEffect(() => {
        setPage(0);
        refetch();
    }, [searchTerm, columnFilters, refetch]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    if (error) {
        return <div>Hubo un error al cargar las localidades</div>;
    }

    if (isFetching) {
        return <TableSkeleton />;
    }

    return (
        <DataTable
            table={table}
            title="Localidades"
            toolbarConfig={getCitiesTableToolbarConfig(
                searchTerm,
                handleSearch,
                provinces,
            )}
            totalCount={data?.citiesCount || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={(row) => router.push(routesBuilder.cities.edit(row.id))}
            headerActions={
                <Button
                    className="flex items-center gap-1 pr-6"
                    onClick={() => router.push(routesBuilder.cities.create())}
                >
                    <BsPlus size="20" />
                    <span>Agregar localidad</span>
                </Button>
            }
        />
    );
}
