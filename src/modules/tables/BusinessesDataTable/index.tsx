import { useRouter } from 'next/router';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { useBusinessesTableColumns } from './columns';
import { getBusinessesTableToolbarConfig } from './toolbar-config';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { routesBuilder } from '@/lib/routes';

export function BusinessesDataTable() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const columns = useBusinessesTableColumns();

    const { data, error, refetch, isFetching } = useGetBusinesses({
        skip: page * pageSize,
        take: pageSize,
        search: searchTerm || '',
    });

    // Refetch cuando cambian los parámetros de paginación
    useEffect(() => {
        refetch();
    }, [page, pageSize, refetch]);

    // Reset page cuando cambia la búsqueda
    useEffect(() => {
        setPage(0);
        refetch();
    }, [searchTerm, refetch]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const table = useReactTable({
        data: data?.businesses || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil((data?.businessesCount || 0) / pageSize),
        state: {
            pagination: {
                pageIndex: page,
                pageSize: pageSize,
            },
        },
    });

    if (error) {
        return <div>Hubo un error al cargar las empresas</div>;
    }

    if (isFetching) {
        return <TableSkeleton />;
    }

    return (
        <DataTable
            table={table}
            title="Empresas"
            toolbarConfig={getBusinessesTableToolbarConfig(searchTerm, handleSearch)}
            totalCount={data?.businessesCount || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={(row) => router.push(routesBuilder.businesses.edit(row.id))}
            headerActions={
                <Button
                    className="flex items-center gap-1 pr-6"
                    onClick={() => router.push(routesBuilder.businesses.create())}
                >
                    <BsPlus size="20" />
                    <span>Agregar empresa</span>
                </Button>
            }
        />
    );
}
