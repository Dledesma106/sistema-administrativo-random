import {
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useState, useEffect } from 'react';

import { CITIES_TABLE_COLUMNS } from './cities-table-columns';
import { CitiesTableToolbar } from './cities-table-toolbar';

import { GetProvincesQuery } from '@/api/graphql';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useGetCities } from '@/hooks/api/city/useGetCities';

type CityTableProps = {
    provinces: NonNullable<GetProvincesQuery['provinces']>;
};

export const CityTable = ({ provinces }: CityTableProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const citiesQuery = useGetCities({});

    const [cities, setCities] = useState(citiesQuery.data?.cities);

    useEffect(() => {
        setCities(citiesQuery.data?.cities);
    }, [citiesQuery.data?.cities]);

    const table = useReactTable({
        data: cities || [],
        columns: CITIES_TABLE_COLUMNS,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnVisibility: {
                branch: false,
                business: false,
                client: false,
            },
            sorting,
            columnFilters,
        },
    });

    if (cities) {
        return (
            <div className="space-y-4 pb-8">
                <CitiesTableToolbar table={table} provinces={provinces} />

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
                                        colSpan={CITIES_TABLE_COLUMNS.length}
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

    if (citiesQuery.error) {
        return <div>Hubo un error al cargar las localidades</div>;
    }

    return (
        <div className="space-y-4 pb-8">
            <CitiesTableToolbar table={table} provinces={provinces} />

            <Skeleton className="h-96 w-full" />
        </div>
    );
};
