import { GetBusinessesQuery, GetClientsQuery } from '@/api/graphql';
import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';

export const getServiceOrdersTableToolbarConfig = (
    businesses: GetBusinessesQuery['businesses'],
    clients: GetClientsQuery['clients'],
): ToolbarConfig<any> => ({
    filters: [
        {
            columnId: 'businessName',
            title: 'Empresa',
            options: businesses.map((business) => ({
                label: business.name,
                value: business.id,
            })),
        },
        {
            columnId: 'clientName',
            title: 'Cliente',
            options: clients.map((client) => ({
                label: client.name,
                value: client.id,
            })),
        },
        {
            columnId: 'status',
            title: 'Estado',
            options: [
                {
                    value: 'Pendiente',
                    label: 'Pendiente',
                },
                {
                    value: 'EnProgreso',
                    label: 'En Progreso',
                },
                {
                    value: 'Finalizado',
                    label: 'Finalizado',
                },
            ],
        },
    ],
});
