import {
    GetBusinessesQuery,
    GetCitiesQuery,
    GetClientsQuery,
    GetTechniciansQuery,
} from '@/api/graphql';
import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';

export const getPreventivesTableToolbarConfig = (
    businesses: NonNullable<GetBusinessesQuery['businesses']>,
    cities: NonNullable<GetCitiesQuery['cities']>,
    technicians: NonNullable<GetTechniciansQuery['technicians']>,
    clients: NonNullable<GetClientsQuery['clients']>,
): ToolbarConfig<any> => ({
    filters: [
        {
            columnId: 'business.name',
            title: 'Empresa',
            options: businesses.map((business) => ({
                value: business.id.toString(),
                label: business.name,
            })),
        },
        {
            columnId: 'city',
            title: 'Localidad',
            options: cities.map((city) => ({
                value: city.id.toString(),
                label: city.name,
            })),
        },
        {
            columnId: 'assigned',
            title: 'Técnico',
            options: technicians.map((technician) => ({
                value: technician.id.toString(),
                label: technician.fullName,
            })),
        },
        {
            columnId: 'branch.client.id',
            title: 'Cliente',
            options: clients.map((client) => ({
                value: client.id.toString(),
                label: client.name,
            })),
        },
    ],
});
