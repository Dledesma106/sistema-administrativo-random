import { Table } from '@tanstack/react-table';

import { DataTableSearch } from '@/components/ui/data-table/data-table-search';

interface Props<TData> {
    table: Table<TData>;
    searchTerm: string;
    onSearch: (term: string) => void;
}

export function ProvincesTableToolbar<TData>({ searchTerm, onSearch }: Props<TData>) {
    return (
        <div className="flex items-center space-x-2">
            <DataTableSearch
                searchTerm={searchTerm}
                onSearch={onSearch}
                placeholder="Buscar por nombre..."
            />
        </div>
    );
}
