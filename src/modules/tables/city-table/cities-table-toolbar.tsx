import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { GetProvincesQuery } from '@/api/graphql';
import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type DataTableToolbarProps<TData> = {
    table: Table<TData>;
    provinces: NonNullable<GetProvincesQuery['provinces']>;
};
export function CitiesTableToolbar<TData>({
    table,
    provinces,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center space-x-2">
            <Label className="block">Filtrar por</Label>

            <DataTableFacetedFilter
                column={table.getColumn('provinceId')}
                title="Provincia"
                options={provinces.map((province) => ({
                    value: province.id.toString(),
                    label: province.name,
                }))}
            />

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
