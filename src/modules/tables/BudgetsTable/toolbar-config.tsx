import { BudgetStatus } from '@prisma/client';

import { GetBusinessesQuery, GetClientsQuery } from '@/api/graphql';
import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

type BudgetsToolbarParams = {
    searchTerm?: string;
    onSearch?: (term: string) => void;
};

export const getBudgetsTableToolbarConfig = (
    businesses: NonNullable<GetBusinessesQuery['businesses']>,
    clients: NonNullable<GetClientsQuery['clients']>,
    params?: BudgetsToolbarParams,
): ToolbarConfig<NonNullable<GetBusinessesQuery['businesses']>[number]> => ({
    search: params && {
        placeholder: 'Buscar por asunto...',
        term: params.searchTerm ?? '',
        onSearch: params.onSearch || (() => {}),
    },
    filters: [
        {
            columnId: 'business',
            title: 'Empresa',
            options: businesses.map((business) => ({
                value: business.id,
                label: business.name,
            })),
        },
        {
            columnId: 'client',
            title: 'Cliente',
            options: clients.map((client) => ({
                value: client.id,
                label: client.name,
            })),
        },
        {
            columnId: 'status',
            title: 'Estado',
            options: Object.values(BudgetStatus).map((status) => ({
                value: status,
                label: capitalizeFirstLetter(pascalCaseToSpaces(status)),
            })),
        },
    ],
});
