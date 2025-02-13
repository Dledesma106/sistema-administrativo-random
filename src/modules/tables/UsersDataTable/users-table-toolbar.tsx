import { Table } from '@tanstack/react-table';

import { roleOptions } from './columns';

import { GetCitiesQuery } from '@/api/graphql';
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter';
import { DataTableSearch } from '@/components/ui/data-table/data-table-search';
import { Label } from '@/components/ui/label';

interface Props<TData> {
    table: Table<TData>;
    searchTerm: string;
    onSearch: (term: string) => void;
    cities: NonNullable<GetCitiesQuery['cities']>;
}

export function UsersTableToolbar<TData>({
    table,
    searchTerm,
    onSearch,
    cities,
}: Props<TData>) {
    const cityOptions = cities.map((city) => ({
        label: city.name,
        value: city.id,
    }));

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col gap-2">
                <DataTableSearch
                    searchTerm={searchTerm}
                    onSearch={onSearch}
                    placeholder="Buscar por nombre..."
                />
                <div className="flex flex-row items-center gap-2">
                    <Label>Filtrar por</Label>
                    <DataTableFacetedFilter
                        column={table.getColumn('cityId')}
                        title="Ciudades"
                        options={cityOptions}
                    />
                    <DataTableFacetedFilter
                        column={table.getColumn('roleFilter')}
                        title="Roles"
                        options={roleOptions}
                    />
                </div>
            </div>
        </div>
    );
}
