import { ColumnFiltersState } from '@tanstack/react-table';

import { GetBusinessesQuery, GetCitiesQuery } from '@/api/graphql';
import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';

export const getClientBranchesTableToolbarConfig = (
    cities: NonNullable<GetCitiesQuery['cities']>,
    businesses: NonNullable<GetBusinessesQuery['businesses']>,
    table: any, // Necesario para acceder a los filtros de provincia
): ToolbarConfig<any> => ({
    filters: [
        {
            columnId: 'businesses',
            title: 'Empresa',
            options: businesses.map((business) => ({
                value: business.id.toString(),
                label: business.name,
            })),
        },
        {
            columnId: 'city',
            title: 'Ciudad',
            options: cities
                .filter((city) => {
                    const provinceFilter = table
                        .getState()
                        .columnFilters.find(
                            (filter: ColumnFiltersState[number]) =>
                                filter.id === 'province',
                        ) as
                        | {
                              id: string;
                              value: string[];
                          }
                        | undefined;

                    return provinceFilter
                        ? provinceFilter.value.includes(city.province.id.toString())
                        : true;
                })
                .map((city) => ({
                    value: city.id.toString(),
                    label: city.name,
                })),
        },
    ],
});
