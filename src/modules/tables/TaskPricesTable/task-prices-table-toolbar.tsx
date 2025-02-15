import { TaskType } from '@prisma/client';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter';
import { Label } from '@/components/ui/label';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    businesses: {
        id: string;
        name: string;
    }[];
}

export function TaskPricesDataTableToolbar<TData>({
    table,
    businesses,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Label className="block">Filtrar por</Label>

                <DataTableFacetedFilter
                    column={table.getColumn('businessName')}
                    title="Empresa"
                    options={businesses.map((business) => ({
                        label: business.name,
                        value: business.name,
                    }))}
                />

                <DataTableFacetedFilter
                    column={table.getColumn('taskType')}
                    title="Tipo de tarea"
                    options={Object.values(TaskType).map((value) => ({
                        label: capitalizeFirstLetter(pascalCaseToSpaces(value)),
                        value,
                    }))}
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
