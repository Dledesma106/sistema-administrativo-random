import {
    BsChevronLeft,
    BsChevronRight,
    BsChevronDoubleLeft,
    BsChevronDoubleRight,
} from 'react-icons/bs';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps {
    totalCount?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
}

export function DataTablePagination({
    totalCount = 0,
    page = 0,
    pageSize = 10,
    onPageChange = () => {},
    onPageSizeChange = () => {},
}: DataTablePaginationProps) {
    const totalPages =
        Math.ceil(totalCount / pageSize) === 0 ? 1 : Math.ceil(totalCount / pageSize);

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                {totalCount} resultados totales
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Filas por página</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            const newPageSize = Number(value);
                            onPageSizeChange(newPageSize);
                            onPageChange(0);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px] border-accent">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top" className="bg-background text-foreground">
                            {[10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Página {page + 1} de {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => onPageChange(0)}
                        disabled={page === 0}
                    >
                        <span className="sr-only">Ir a primera página</span>
                        <BsChevronDoubleLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 0}
                    >
                        <span className="sr-only">Ir a página anterior</span>
                        <BsChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages - 1}
                    >
                        <span className="sr-only">Ir a página siguiente</span>
                        <BsChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => onPageChange(totalPages - 1)}
                        disabled={page === totalPages - 1}
                    >
                        <span className="sr-only">Ir a última página</span>
                        <BsChevronDoubleRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
