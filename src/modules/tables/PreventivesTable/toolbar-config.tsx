import { PreventiveFrequency, PreventiveStatus } from '@prisma/client';

import {
    GetBusinessesQuery,
    GetCitiesQuery,
    GetClientsQuery,
    GetTechniciansQuery,
} from '@/api/graphql';
import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

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
        {
            columnId: 'frequency',
            title: 'Frecuencia',
            options: Object.values(PreventiveFrequency).map((frequency) => ({
                value: frequency,
                label: frequency,
            })),
        },
        {
            columnId: 'months',
            title: 'Meses',
            options: [
                {
                    value: 'Enero',
                    label: 'Enero',
                },
                {
                    value: 'Febrero',
                    label: 'Febrero',
                },
                {
                    value: 'Marzo',
                    label: 'Marzo',
                },
                {
                    value: 'Abril',
                    label: 'Abril',
                },
                {
                    value: 'Mayo',
                    label: 'Mayo',
                },
                {
                    value: 'Junio',
                    label: 'Junio',
                },
                {
                    value: 'Julio',
                    label: 'Julio',
                },
                {
                    value: 'Agosto',
                    label: 'Agosto',
                },
                {
                    value: 'Octubre',
                    label: 'Octubre',
                },
                {
                    value: 'Noviembre',
                    label: 'Noviembre',
                },
                {
                    value: 'Diciembre',
                    label: 'Diciembre',
                },
            ],
        },
        {
            columnId: 'status',
            title: 'Estado',
            options: Object.values(PreventiveStatus).map((status) => ({
                value: status,
                label: capitalizeFirstLetter(pascalCaseToSpaces(status)),
            })),
        },
    ],
});
