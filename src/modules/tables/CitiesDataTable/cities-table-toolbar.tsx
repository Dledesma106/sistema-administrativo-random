import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { GetProvincesQuery } from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter';
import { DataTableSearch } from '@/components/ui/data-table/data-table-search';
import { Label } from '@/components/ui/label';

interface Props<TData> {
    table: Table<TData>;
    searchTerm: string;
    onSearch: (term: string) => void;
    provinces: NonNullable<GetProvincesQuery['provinces']>;
}

export function CitiesTableToolbar<TData>({
    table,
    searchTerm,
    onSearch,
    provinces,
}: Props<TData>) {
    const provinceOptions = provinces.map((province) => ({
        label: province.name,
        value: province.id,
    }));

    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col gap-2">
                <DataTableSearch
                    searchTerm={searchTerm}
                    onSearch={onSearch}
                    placeholder="Buscar por nombre..."
                />
                <div className="flex flex-row items-center gap-2">
                    <Label>Filtrar por</Label>
                    <DataTableFacetedFilter
                        column={table.getColumn('provinceId')}
                        title="Provincias"
                        options={provinceOptions}
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
            </div>
        </div>
    );
}
