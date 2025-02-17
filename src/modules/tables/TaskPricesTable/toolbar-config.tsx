import { TaskType } from '@prisma/client';

import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

export const getTaskPricesTableToolbarConfig = (
    businesses: {
        id: string;
        name: string;
    }[],
): ToolbarConfig<any> => ({
    filters: [
        {
            columnId: 'businessName',
            title: 'Empresa',
            options: businesses.map((business) => ({
                label: business.name,
                value: business.name,
            })),
        },
        {
            columnId: 'taskType',
            title: 'Tipo de tarea',
            options: Object.values(TaskType).map((value) => ({
                label: capitalizeFirstLetter(pascalCaseToSpaces(value)),
                value,
            })),
        },
    ],
});
