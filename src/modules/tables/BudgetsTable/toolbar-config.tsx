import { BudgetStatus } from '@prisma/client';

import { GetBusinessesQuery } from '@/api/graphql';
import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

export const getBudgetsTableToolbarConfig = (
    businesses: NonNullable<GetBusinessesQuery['businesses']>,
): ToolbarConfig<NonNullable<GetBusinessesQuery['businesses']>[number]> => ({
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
            columnId: 'status',
            title: 'Estado',
            options: Object.values(BudgetStatus).map((status) => ({
                value: status,
                label: capitalizeFirstLetter(pascalCaseToSpaces(status)),
            })),
        },
    ],
});
