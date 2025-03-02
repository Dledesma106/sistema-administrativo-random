import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';

export const getBusinessesTableToolbarConfig = (
    searchTerm: string,
    onSearch: (term: string) => void,
): ToolbarConfig<any> => ({
    search: {
        placeholder: 'Buscar por nombre...',
        term: searchTerm,
        onSearch: onSearch,
    },
});
