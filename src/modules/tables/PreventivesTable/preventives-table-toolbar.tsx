import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useGetBusinesses } from '@/hooks/api/business/useGetBusinesses';
import { useGetClients } from '@/hooks/api/client/useGetClients';
import { useGetProvinces } from '@/hooks/api/province/useGetProvinces';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';

type DataTableToolbarProps<TData> = {
    table: Table<TData>;
    clients: NonNullable<ReturnType<typeof useGetClients>['data']>['clients'];
    provinces: NonNullable<ReturnType<typeof useGetProvinces>['data']>['provinces'];
    businesses: NonNullable<ReturnType<typeof useGetBusinesses>['data']>['businesses'];
    technicians: NonNullable<ReturnType<typeof useGetTechnicians>['data']>['technicians'];
};

export function PreventivesTableToolbar<TData>({
    table,
    clients,
    provinces,
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
                column={table.getColumn('provinceId')}
                title="Provincia"
                options={provinces.map((province) => ({
                    value: province.id.toString(),
                    label: province.name,
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
