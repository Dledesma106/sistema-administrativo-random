import { BudgetStatus } from '@/components/ui/Badges/BudgetStatusBadge';
import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

export const getBudgetsTableToolbarConfig = (
    businesses: {
        id: string;
        name: string;
    }[],
    searchTerm: string,
    onSearch: (term: string) => void,
): ToolbarConfig<any> => ({
    search: {
        placeholder: 'Buscar por asunto...',
        term: searchTerm,
        onSearch,
    },
    filters: [
        {
            columnId: 'company',
            title: 'Empresa',
            options: businesses.map((business) => ({
                label: business.name,
                value: business.name,
            })),
        },
        {
            columnId: 'status',
            title: 'Estado',
            options: Object.values(BudgetStatus).map((value) => ({
                label: capitalizeFirstLetter(pascalCaseToSpaces(value)),
                value,
            })),
        },
    ],
});
