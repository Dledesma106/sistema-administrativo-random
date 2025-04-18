import { TaskStatus, TaskType } from '@prisma/client';

import {
    GetBusinessesQuery,
    GetCitiesQuery,
    GetClientsQuery,
    GetTechniciansQuery,
} from '@/api/graphql';
import { ToolbarConfig } from '@/components/ui/data-table/data-table-toolbar';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

export const getTasksTableToolbarConfig = (
    cities: NonNullable<GetCitiesQuery['cities']>,
    clients: NonNullable<GetClientsQuery['clients']>,
    businesses: NonNullable<GetBusinessesQuery['businesses']>,
    techs: NonNullable<GetTechniciansQuery['technicians']>,
): ToolbarConfig<any> => ({
    filters: [
        {
            columnId: 'city',
            title: 'Localidad',
            options: cities.map((city) => ({
                value: city.id.toString(),
                label: city.name,
            })),
        },
        {
            columnId: 'client',
            title: 'Cliente',
            options: clients.map((client) => ({
                value: client.id.toString(),
                label: client.name,
            })),
        },
        {
            columnId: 'business',
            title: 'Empresa',
            options: businesses.map((business) => ({
                value: business.id.toString(),
                label: business.name,
            })),
        },
        {
            columnId: 'assigned',
            title: 'Técnico',
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
            options: Object.values(TaskStatus).map((status) => ({
                value: status,
                label: capitalizeFirstLetter(pascalCaseToSpaces(status)),
            })),
        },
        {
            columnId: 'taskType',
            title: 'Tipo',
            options: Object.values(TaskType).map((type) => ({
                value: type,
                label: capitalizeFirstLetter(pascalCaseToSpaces(type)),
            })),
        },
    ],
    dateRanges: [
        {
            columnId: 'closedAt',
            title: 'Fecha de cierre',
        },
    ],
});
