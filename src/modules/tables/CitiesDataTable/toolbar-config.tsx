import { GetProvincesQuery } from '@/api/graphql';
import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';

export const getCitiesTableToolbarConfig = (
    searchTerm: string,
    onSearch: (term: string) => void,
    provinces: NonNullable<GetProvincesQuery['provinces']>,
): ToolbarConfig<any> => ({
    search: {
        placeholder: 'Buscar por nombre...',
        term: searchTerm,
        onSearch: onSearch,
    },
    filters: [
        {
            columnId: 'provinceId',
            title: 'Provincias',
            options: provinces.map((province) => ({
                label: province.name,
                value: province.id,
            })),
        },
    ],
});
