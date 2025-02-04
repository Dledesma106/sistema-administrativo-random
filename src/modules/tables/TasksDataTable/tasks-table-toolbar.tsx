import { TaskStatus, TaskType } from '@prisma/client';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import {
    GetBusinessesQuery,
    GetCitiesQuery,
    GetClientsQuery,
    GetTechniciansQuery,
} from '@/api/graphql';
import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { capitalizeFirstLetter, pascalCaseToSpaces } from '@/lib/utils';

type DataTableToolbarProps<TData> = {
    table: Table<TData>;
    cities: NonNullable<GetCitiesQuery['cities']>;
    clients: NonNullable<GetClientsQuery['clients']>;
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
    techs: NonNullable<GetTechniciansQuery['technicians']>;
};

export function TasksDataTableToolbar<TData>({
    table,
    cities,
    clients,
    businesses,
    techs,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center space-x-2">
            <Label className="block">Filtrar por</Label>

            <DataTableFacetedFilter
                column={table.getColumn('client')}
                title="Cliente"
                options={clients.map((client) => ({
                    value: client.id.toString(),
                    label: client.name,
                }))}
            />

            <DataTableFacetedFilter
                column={table.getColumn('city')}
                title="Localidad"
                options={cities.map((city) => ({
                    value: city.id.toString(),
                    label: city.name,
                }))}
            />

            <DataTableFacetedFilter
                column={table.getColumn('business')}
                title="Empresa"
                options={businesses.map((business) => ({
                    value: business.id.toString(),
                    label: business.name,
                }))}
            />

            <DataTableFacetedFilter
                column={table.getColumn('assigned')}
                title="Tecnico"
                options={techs
                    .filter((user, index) => {
                        return techs.findIndex((tech) => tech.id === user.id) === index;
                    })
                    .map((user) => ({
                        value: user.id.toString(),
                        label: user.fullName,
                    }))}
            />

            <DataTableFacetedFilter
                column={table.getColumn('status')}
                title="Estado"
                options={Object.values(TaskStatus).map((status) => ({
                    value: status,
                    label: capitalizeFirstLetter(pascalCaseToSpaces(status)),
                }))}
            />

            <DataTableFacetedFilter
                column={table.getColumn('taskType')}
                title="Tipo"
                options={Object.values(TaskType).map((type) => ({
                    value: type,
                    label: capitalizeFirstLetter(pascalCaseToSpaces(type)),
                }))}
            />

            {isFiltered && (
                <Button
                    variant="ghost"
                    onClick={() => table.resetColumnFilters()}
                    className="h-8 px-2 lg:px-3"
                >
                    Limpiar
                    <Cross2Icon className="ml-2 h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
