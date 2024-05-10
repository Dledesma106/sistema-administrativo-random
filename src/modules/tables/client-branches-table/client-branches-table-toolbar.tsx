import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ValidClientBranchesViewProps } from '@/pages/tech-admin/clients/[clientId]/branches';

type DataTableToolbarProps<TData> = {
    table: Table<TData>;
} & Omit<ValidClientBranchesViewProps, 'client'>;

export function ClientBranchesTableToolbar<TData>({
    table,
    cities,
    provinces,
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
                column={table.getColumn('province')}
                title="Provincia"
                options={provinces.map((province) => ({
                    value: province.id.toString(),
                    label: province.name,
                }))}
                onSelect={(nextProvincesIDs) => {
                    if (!nextProvincesIDs) {
                        return;
                    }

                    table.setColumnFilters((old) => {
                        const citiesFilter = old.find((filter) => filter.id === 'city');
                        const citiesFilterValue = citiesFilter?.value;

                        if (
                            citiesFilterValue &&
                            Array.isArray(citiesFilterValue) &&
                            citiesFilterValue.length > 0
                        ) {
                            const nextFilteredCitiesBasedOnProvince = cities
                                .filter((city) => {
                                    return (
                                        nextProvincesIDs.includes(
                                            city.province.id.toString(),
                                        ) &&
                                        citiesFilterValue.includes(city.id.toString())
                                    );
                                })
                                .map((city) => city.id.toString());

                            const next = [
                                ...old.filter(
                                    (filter) =>
                                        filter.id !== 'city' && filter.id !== 'province',
                                ),
                                {
                                    id: 'province',
                                    value: nextProvincesIDs,
                                },
                                ...(nextFilteredCitiesBasedOnProvince.length
                                    ? [
                                          {
                                              id: 'city',
                                              value: nextFilteredCitiesBasedOnProvince,
                                          },
                                      ]
                                    : []),
                            ];

                            return next;
                        }

                        return [
                            ...old.filter(
                                (filter) =>
                                    filter.id !== 'city' && filter.id !== 'province',
                            ),
                            {
                                id: 'province',
                                value: nextProvincesIDs,
                            },
                        ];
                    });
                }}
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
