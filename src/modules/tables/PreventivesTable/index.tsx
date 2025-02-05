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
import { useState } from 'react';

import { PREVENTIVES_TABLE_COLUMNS } from './columns';
import { PreventivesTableToolbar } from './preventives-table-toolbar';

import {
    GetBusinessesQuery,
    GetCitiesQuery,
    GetClientsQuery,
    GetPreventivesQuery,
    GetTechniciansQuery,
} from '@/api/graphql';
import { TableSkeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface PreventivesTableProps {
    clients: NonNullable<GetClientsQuery['clients']>;
    cities: NonNullable<GetCitiesQuery['cities']>;
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
    technicians: NonNullable<GetTechniciansQuery['technicians']>;
    preventives: NonNullable<GetPreventivesQuery['preventives']>;
}

export const PreventivesTable = ({
    clients,
    cities,
    businesses,
    technicians,
    preventives,
}: PreventivesTableProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
                city: false,
                'branch.client.id': false,
            },
        },
    });

    if (preventives) {
        return (
            <div className="space-y-4 pb-8">
                <PreventivesTableToolbar
                    table={table}
                    cities={cities}
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

    return (
        <div className="space-y-4 pb-8">
            <TableSkeleton />
        </div>
    );
};
