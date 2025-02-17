import { useRouter } from 'next/router';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { useClientsTableColumns } from './columns';
import { getClientsTableToolbarConfig } from './toolbar-config';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useGetClients } from '@/hooks/api/client/useGetClients';
import { routesBuilder } from '@/lib/routes';

export function ClientsDataTable() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const columns = useClientsTableColumns();

    const { data, error, refetch, isFetching } = useGetClients({
        skip: page * pageSize,
        take: pageSize,
        search: searchTerm || undefined,
    });

    // Reset page when search term changes
    useEffect(() => {
        setPage(0);
        refetch();
    }, [searchTerm, pageSize]);

    useEffect(() => {
        refetch();
    }, [page, pageSize]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const table = useReactTable({
        data: data?.clients || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil((data?.clientsCount || 0) / pageSize),
        state: {
            pagination: {
                pageIndex: page,
                pageSize,
            },
        },
    });

    if (error) {
        return <div>Hubo un error al cargar los clientes</div>;
    }

    if (isFetching) {
        return <TableSkeleton />;
    }

    return (
        <DataTable
            table={table}
            title="Clientes"
            toolbarConfig={getClientsTableToolbarConfig(searchTerm, handleSearch)}
            totalCount={data?.clientsCount || 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={(row) => router.push(routesBuilder.branches.list(row.id))}
            headerActions={
                <Button onClick={() => router.push(routesBuilder.clients.create())}>
                    <BsPlus size={32} />
                    Agregar cliente
                </Button>
            }
        />
    );
}
