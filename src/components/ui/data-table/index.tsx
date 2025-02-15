import {
    ColumnFiltersState,
    Table as TanstackTable,
    flexRender,
} from '@tanstack/react-table';
import { ReactNode, useMemo } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { DataTablePagination } from '@/components/ui/data-table/data-table-pagination';
import { TypographyH1 } from '../typography';
import { CustomScrollArea } from "../custom-scroll-area/index";

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
    const dynamicHeight = useMemo(() => {
        const rows = table.getRowModel().rows;
        const actualRowCount = Math.min(rows.length, totalCount); // Usar el número real de filas
        
        if (actualRowCount === 0) return 'h-[145px]';
        
        const ROW_HEIGHT = 53; // Altura ajustada por fila
        const HEADER_HEIGHT = 45;
        const MIN_HEIGHT = 200;
        const MAX_HEIGHT = 550;
        
        const contentHeight = (actualRowCount * ROW_HEIGHT) + HEADER_HEIGHT;
        const height = `h-[${Math.max(Math.min(contentHeight, MAX_HEIGHT), MIN_HEIGHT)}px] max-h-[550px]`;
        console.log(height);
        return height;
    }, [table.getRowModel().rows.length, totalCount]);

    return (
        <div>
            {/* Header */}
            <div className="mb-4">
                <div className="flex justify-between">
                    <TypographyH1>{title}</TypographyH1>
                    {headerActions && (
                        <div className="flex gap-2">{headerActions}</div>
                    )}
                </div>
            </div>

            {/* Toolbar */}
            {toolbar && <div className="mb-4">{toolbar}</div>}

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

            {/* Table con scroll en el body */}

            <CustomScrollArea height={dynamicHeight}>
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-primary hover:bg-primary border-accent">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-accent hover:bg-primary">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-primary-foreground">
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
                                    className={`${onRowClick ? 'cursor-pointer' : ''} bg-background-primary hover:bg-accent border-b border-accent`}
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
                                    className="h-24 text-center bg-background-primary"
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