import { format } from 'date-fns';
import { useRouter } from 'next/router';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export interface Column<T> {
    header: string;
    accessorKey: keyof T | ((item: T) => React.ReactNode);
    cell?: (item: T) => React.ReactNode;
}

interface DataListProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
}

export function DataList<T>({
    data,
    columns,
    onRowClick,
    emptyMessage = "No hay datos"
}: DataListProps<T>) {
    return (
        <div className="overflow-hidden rounded-md border border-border">
            <Table>
                <TableHeader className="bg-primary ">
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableHead key={index} className="font-medium text-primary-foreground">
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center bg-background-primary text-primary-foreground"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, index) => (
                            <TableRow
                                key={index}
                                className={`border-b bg-background-primary ${onRowClick ? 'cursor-pointer hover:bg-accent' : ''}`}
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((column, colIndex) => (
                                    <TableCell key={colIndex}>
                                        {column.cell 
                                            ? column.cell(item)
                                            : typeof column.accessorKey === 'function'
                                                ? column.accessorKey(item)
                                                : String(item[column.accessorKey])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
} 