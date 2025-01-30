/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useState, useEffect } from 'react';

import { PREVENTIVES_TABLE_COLUMNS } from './columns';
import { PreventivesTableToolbar } from './preventives-table-toolbar';

import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetClients } from '@/hooks/api/client/useGetClients';
import { useGetPreventives } from '@/hooks/api/preventive/useGetPreventives';
import { useGetProvinces } from '@/hooks/api/province/useGetProvinces';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';

interface PreventivesTableProps {
    clients: NonNullable<ReturnType<typeof useGetClients>['data']>['clients'];
    provinces: NonNullable<ReturnType<typeof useGetProvinces>['data']>['provinces'];
    businesses: NonNullable<ReturnType<typeof useGetBusinesses>['data']>['businesses'];
    technicians: NonNullable<ReturnType<typeof useGetTechnicians>['data']>['technicians'];
}

export const PreventivesTable = ({
    clients,
    provinces,
    businesses,
    technicians,
}: PreventivesTableProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const preventivesQuery = useGetPreventives({});

    const [preventives, setPreventives] = useState(preventivesQuery.data?.preventives);

    useEffect(() => {
        setPreventives(preventivesQuery.data?.preventives);
    }, [preventivesQuery.data?.preventives]);

    const table = useReactTable({
        data: preventives || [],
        columns: PREVENTIVES_TABLE_COLUMNS,
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
            columnVisibility: {
                provinceId: false,
                'branch.client.id': false,
            },
        },
    });

    if (preventives) {
        return (
            <div className="space-y-4 pb-8">
                <PreventivesTableToolbar
                    table={table}
                    provinces={provinces}
                    businesses={businesses}
                    clients={clients}
                    technicians={technicians}
                />

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
                                        colSpan={PREVENTIVES_TABLE_COLUMNS.length}
                                        className="h-24 text-center"
                                    >
                                        No se encontraron resultados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    if (preventivesQuery.error) {
        return <div>Hubo un error al cargar las preventivas</div>;
    }

    return (
        <div className="space-y-4 pb-8">
            <PreventivesTableToolbar
                table={table}
                provinces={provinces}
                businesses={businesses}
                clients={clients}
                technicians={technicians}
            />

            <Skeleton className="h-96 w-full" />
        </div>
    );
};
