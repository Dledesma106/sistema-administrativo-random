import { roleOptions } from './columns';

import { GetCitiesQuery } from '@/api/graphql';
import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';

export const getUsersTableToolbarConfig = (
    cities: NonNullable<GetCitiesQuery['cities']>,
    searchTerm: string,
    onSearch: (term: string) => void,
): ToolbarConfig<any> => ({
    search: {
        placeholder: 'Buscar por nombre...',
        term: searchTerm,
        onSearch: onSearch,
    },
    filters: [
        {
            columnId: 'cityId',
            title: 'Ciudades',
            options: cities.map((city) => ({
                label: city.name,
                value: city.id,
            })),
        },
        {
            columnId: 'roleFilter',
            title: 'Roles',
            options: roleOptions,
        },
    ],
});
