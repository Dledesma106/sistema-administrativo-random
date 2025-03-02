import { GetBusinessesQuery } from '@/api/graphql';
import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';

export const getBillingTableToolbarConfig = (
    businesses: NonNullable<GetBusinessesQuery['businesses']>,
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
            columnId: 'status',
            title: 'Estado',
            options: [
                {
                    label: 'Borrador',
                    value: 'Borrador',
                },
                {
                    label: 'Pendiente',
                    value: 'Pendiente',
                },
                {
                    label: 'Pagado',
                    value: 'Pagado',
                },
            ],
        },
    ],
});
