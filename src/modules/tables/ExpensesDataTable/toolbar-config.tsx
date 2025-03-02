import {
    ExpenseStatus,
    ExpenseType,
    GetTechniciansQuery,
    ExpensePaySource,
} from '@/api/graphql';
import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

export const getExpensesTableToolbarConfig = (
    techs: NonNullable<GetTechniciansQuery['technicians']>,
): ToolbarConfig<any> => ({
    filters: [
        {
            columnId: 'registeredBy',
            title: 'Tecnico',
            options: techs
                .filter(
                    (user, index) =>
                        techs.findIndex((tech) => tech.id === user.id) === index,
                )
                .map((user) => ({
                    value: user.id.toString(),
                    label: user.fullName,
                })),
        },
        {
            columnId: 'status',
            title: 'Estado',
            options: Object.values(ExpenseStatus).map((value) => ({
                label: capitalizeFirstLetter(pascalCaseToSpaces(value)),
                value,
            })),
        },
        {
            columnId: 'expenseType',
            title: 'Tipo',
            options: Object.values(ExpenseType).map((value) => ({
                label: capitalizeFirstLetter(pascalCaseToSpaces(value)),
                value,
            })),
        },
        {
            columnId: 'paySource',
            title: 'Fuente de pago',
            options: Object.values(ExpensePaySource).map((value) => ({
                label: capitalizeFirstLetter(pascalCaseToSpaces(value)),
                value,
            })),
        },
    ],
    dateRanges: [
        {
            columnId: 'expenseDate',
            title: 'Fecha de gasto',
        },
    ],
});
