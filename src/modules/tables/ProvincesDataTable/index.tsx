import { useRouter } from 'next/router';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { useProvincesTableColumns } from './columns';
import { getProvincesTableToolbarConfig } from './toolbar-config';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetProvinces } from '@/hooks/api/province/useGetProvinces';
import { routesBuilder } from '@/lib/routes';

export function ProvincesDataTable() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const columns = useProvincesTableColumns();

    const { data, error, refetch, isFetching } = useGetProvinces({
        skip: page * pageSize,
        take: pageSize,
        search: searchTerm || '',
    });

    useEffect(() => {
        refetch();
    }, [page, pageSize, refetch]);

    useEffect(() => {
        setPage(0);
        refetch();
    }, [searchTerm, refetch]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const table = useReactTable({
        data: data?.provinces || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil((data?.provincesCount || 0) / pageSize),
        state: {
            pagination: {
                pageIndex: page,
                pageSize: pageSize,
            },
        },
    });

    if (error) {
        return <div>Hubo un error al cargar las provincias</div>;
    }

    if (isFetching) {
        return <TableSkeleton />;
    }

    return (
        <DataTable
            table={table}
            title="Provincias"
            toolbarConfig={getProvincesTableToolbarConfig(searchTerm, handleSearch)}
            totalCount={data?.provincesCount || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={(row) => router.push(routesBuilder.provinces.edit(row.id))}
            headerActions={
                <Button onClick={() => router.push(routesBuilder.provinces.create())}>
                    <BsPlus size={32} />
                    Agregar provincia
                </Button>
            }
        />
    );
}
