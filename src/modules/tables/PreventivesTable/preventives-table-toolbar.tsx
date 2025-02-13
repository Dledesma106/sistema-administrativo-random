import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import {
    GetBusinessesQuery,
    GetTechniciansQuery,
    GetCitiesQuery,
    GetClientsQuery,
} from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter';
import { Label } from '@/components/ui/label';

type DataTableToolbarProps<TData> = {
    table: Table<TData>;
    clients: NonNullable<GetClientsQuery['clients']>;
    cities: NonNullable<GetCitiesQuery['cities']>;
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
    technicians: NonNullable<GetTechniciansQuery['technicians']>;
};

export function PreventivesTableToolbar<TData>({
    table,
    clients,
    cities,
    businesses,
    technicians,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center space-x-2">
            <Label className="block">Filtrar por</Label>
            <DataTableFacetedFilter
                column={table.getColumn('business.name')}
                title="Empresa"
                options={businesses.map((business) => ({
                    value: business.id.toString(),
                    label: business.name,
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
                column={table.getColumn('assigned')}
                title="Técnico"
                options={technicians.map((technician) => ({
                    value: technician.id.toString(),
                    label: technician.fullName,
                }))}
            />

            <DataTableFacetedFilter
                column={table.getColumn('branch.client.id')}
                title="Cliente"
                options={clients.map((client) => ({
                    value: client.id.toString(),
                    label: client.name,
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
