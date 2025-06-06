import {
    ColumnFiltersState,
    Table as TanstackTable,
    flexRender,
} from '@tanstack/react-table';
import { ReactNode, useMemo } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar, ToolbarConfig } from './data-table-toolbar';
import { TypographyH1 } from '../typography';
import { CustomScrollArea } from '../custom-scroll-area/index';

interface DataTableProps<TData> {
    table: TanstackTable<TData>;
    title: string;
    toolbarConfig?: ToolbarConfig<TData>;
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
    toolbarConfig,
    totalCount,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    headerActions,
    onRowClick,
}: DataTableProps<TData>) {
    const dynamicHeight = useMemo(() => {
        const rows = table.getRowModel().rows;
        const actualRowCount = Math.min(rows.length, totalCount); // Usar el número real de filas

        if (actualRowCount === 0) return 'h-[145px]';

        const ROW_HEIGHT = 53; // Altura ajustada por fila
        const HEADER_HEIGHT = 45;
        const MIN_HEIGHT = 200;
        const MAX_HEIGHT = 470;

        const contentHeight = actualRowCount * ROW_HEIGHT + HEADER_HEIGHT;
        const height = `h-[${Math.max(Math.min(contentHeight, MAX_HEIGHT), MIN_HEIGHT)}px] max-h-[470px]`;
        return height;
    }, [table.getRowModel().rows.length, totalCount]);

    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1 rounded-lg border border-accent bg-background-primary px-4 pb-2 pt-4">
                {/* Header */}
                <div className="flex justify-between">
                    <TypographyH1>{title}</TypographyH1>
                    {headerActions && <div className="flex gap-2">{headerActions}</div>}
                </div>

                {/* Toolbar */}
                {toolbarConfig && (
                    <DataTableToolbar table={table} config={toolbarConfig} />
                )}

                {/* Pagination */}

                <DataTablePagination
                    totalCount={totalCount}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                />
            </div>
            {/* Table con scroll en el body */}

            <CustomScrollArea height={dynamicHeight}>
                <Table>
                    <TableHeader className="sticky top-0 z-10 border-accent bg-primary text-start hover:bg-primary">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="border-accent hover:bg-primary"
                            >
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="text-primary-foreground"
                                    >
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
                                    className={`${onRowClick ? 'cursor-pointer' : ''} border-b border-accent bg-background-primary hover:bg-accent`}
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
                                    className="h-24 bg-background-primary text-center"
                                >
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CustomScrollArea>
        </div>
    );
}
