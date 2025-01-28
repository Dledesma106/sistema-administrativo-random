import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function TaskPricesDataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Label>Buscar empresa</Label>
                <Input
                    placeholder="Filtrar por empresa..."
                    value={
                        (table.getColumn('businessName')?.getFilterValue() as string) ??
                        ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('businessName')
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            {isFiltered && (
                <Button
                    variant="ghost"
                    onClick={() => table.resetColumnFilters()}
                    className="h-8 px-2 lg:px-3"
                >
                    Limpiar
                    <Cross2Icon className="ml-2 h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
