import {
    ColumnFiltersState,
    Table as TanstackTable,
    flexRender,
} from '@tanstack/react-table';
import { ReactNode } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { DataTablePagination } from '@/components/data-table-pagination';
import { TypographyH1 } from '../typography';

interface DataTableProps<TData> {
    table: TanstackTable<TData>;
    title: string;
    toolbar?: ReactNode;
    totalCount: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    headerActions?: ReactNode;
    onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({
    table,
    title,
    toolbar,
    totalCount,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    headerActions,
    onRowClick,
}: DataTableProps<TData>) {
    return (
        <div>
            {/* Header */}
            <div className="mb-4">
                <div className="flex justify-between">
                    <TypographyH1>
                        {title}
                    </TypographyH1>
                    {headerActions && (
                        <div className="flex gap-2">
                            {headerActions}
                        </div>
                    )}
                </div>
            </div>

            {/* Toolbar */}
            {toolbar && (
                <div className="mb-4">
                    {toolbar}
                </div>
            )}

            {/* Pagination */}
            <div className="mb-4">
                <DataTablePagination
                    totalCount={totalCount}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                />
            </div>

            {/* Table with scroll */}
            <div className="rounded-md border">
                <div className="max-h-[500px] overflow-auto">
                    <Table>
                        <TableHeader className="sticky top-0 z-10 bg-white">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        onClick={() => onRowClick?.(row.original)}
                                        className={onRowClick ? 'cursor-pointer hover:bg-muted' : ''}
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
                                        colSpan={table.getAllColumns().length}
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
        </div>
    );
} 