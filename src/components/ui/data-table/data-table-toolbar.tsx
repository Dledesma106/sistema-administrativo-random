import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter';
import { DataTableSearch } from '@/components/ui/data-table/data-table-search';
import { Label } from '@/components/ui/label';
import { DataTableDateRange } from './data-table-date-range';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterConfig {
    columnId: string;
    title: string;
    options: FilterOption[];
}

interface DateRangeConfig {
    columnId: string;
    title: string;
}

export interface ToolbarConfig<TData> {
    search?: {
        placeholder: string;
        term: string;
        onSearch: (term: string) => void;
    };
    filters?: FilterConfig[];
    dateRanges?: DateRangeConfig[];
}

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    config: ToolbarConfig<TData>;
}

export function DataTableToolbar<TData>({ table, config }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const hasSearch = !!config.search;
    const hasFilters = !!config.filters?.length;
    const hasDateRanges = !!config.dateRanges?.length;

    return (
        <div className="flex w-full items-center justify-between">
            {(hasFilters || hasDateRanges) && (
                <div className="flex flex-row items-center gap-2">
                    <Label>Filtrar por</Label>
                    {config.filters?.map((filter) => (
                        <DataTableFacetedFilter
                            key={filter.columnId}
                            column={table.getColumn(filter.columnId)}
                            title={filter.title}
                            options={filter.options}
                        />
                    ))}
                    {config.dateRanges?.map((dateRange) => {
                        const column = table.getColumn(dateRange.columnId);
                        const value =
                            (column?.getFilterValue() as { from?: Date; to?: Date }) ||
                            {};

                        return (
                            <DataTableDateRange
                                key={dateRange.columnId}
                                value={value}
                                onChange={(range) => {
                                    column?.setFilterValue(range);
                                }}
                                title={dateRange.title}
                            />
                        );
                    })}
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
            )}
            {hasSearch && (
                <DataTableSearch
                    searchTerm={config.search?.term ?? ''}
                    onSearch={config.search?.onSearch ?? (() => {})}
                    placeholder={config.search?.placeholder ?? ''}
                />
            )}
        </div>
    );
}
