import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { GetBusinessesQuery, GetClientsQuery } from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter';
import { Label } from '@/components/ui/label';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    businesses: GetBusinessesQuery['businesses'];
    clients: GetClientsQuery['clients'];
}

export function BillingProfilesDataTableToolbar<TData>({
    table,
    businesses,
    clients,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-start gap-2">
            <Label>Filtrar por</Label>
            <DataTableFacetedFilter
                column={table.getColumn('businessName')}
                title="Empresa"
                options={businesses.map((business) => ({
                    label: business.name,
                    value: business.id,
                }))}
            />
            <DataTableFacetedFilter
                column={table.getColumn('clientName')}
                title="Cliente"
                options={clients.map((client) => ({
                    label: client.name,
                    value: client.id,
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
