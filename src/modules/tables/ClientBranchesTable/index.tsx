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
import { useEffect, useState } from 'react';

import { getClientBranchesTableColumns } from './client-branches-columns';
import { ClientBranchesTableToolbar } from './client-branches-table-toolbar';
import { useClientBranchesListQuery } from './query';

import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ValidClientBranchesViewProps } from '@/pages/tech-admin/clients/[clientId]/branches';

type Props = ValidClientBranchesViewProps;

export const ClientBranchesTable = ({ client, cities, provinces, businesses }: Props) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const branchesQuery = useClientBranchesListQuery({
        clientId: client.id,
        cityId: '',
        businessId: '',
        provinceId: '',
    });

    const [branches, setBranches] = useState(branchesQuery.data?.branchesOfClient);

    const columns = getClientBranchesTableColumns();

    useEffect(() => {
        setBranches(branchesQuery.data?.branchesOfClient);
    }, [branchesQuery.data?.branchesOfClient]);

    const table = useReactTable({
        data: branches || [],
        columns: columns,
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

    if (branches) {
        return (
            <div className="space-y-4 pb-8">
                <ClientBranchesTableToolbar
                    table={table}
                    cities={cities}
                    businesses={businesses}
                    provinces={provinces}
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
                                        colSpan={columns.length}
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

    if (branchesQuery.error) {
        return <div>Hubo un error al cargar las sucursales</div>;
    }

    return (
        <div className="space-y-4 pb-8">
            <ClientBranchesTableToolbar
                table={table}
                cities={cities}
                businesses={businesses}
                provinces={provinces}
            />

            <Skeleton className="h-96 w-full" />
        </div>
    );
};
