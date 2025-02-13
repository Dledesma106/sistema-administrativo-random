import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { GetBusinessesQuery, GetCitiesQuery } from '@/api/graphql';
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type DataTableToolbarProps<TData> = {
    table: Table<TData>;
    cities: NonNullable<GetCitiesQuery['cities']>;
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
};

export function ClientBranchesTableToolbar<TData>({
    table,
    cities,
    businesses,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    const filteredCitiesBasedOnProvince = cities.filter((city) => {
        const provinceFilter = table
            .getState()
            .columnFilters.find((filter) => filter.id === 'province') as
            | {
                  id: string;
                  value: string[];
              }
            | undefined;

        return provinceFilter
            ? provinceFilter.value.includes(city.province.id.toString())
            : true;
    });

    return (
        <div className="flex items-center space-x-2">
            <Label className="block">Filtrar por</Label>

            <DataTableFacetedFilter
                column={table.getColumn('businesses')}
                title="Empresa"
                options={businesses.map((business) => ({
                    value: business.id.toString(),
                    label: business.name,
                }))}
            />

            <DataTableFacetedFilter
                column={table.getColumn('city')}
                title="Ciudad"
                options={filteredCitiesBasedOnProvince.map((city) => ({
                    value: city.id.toString(),
                    label: city.name,
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
