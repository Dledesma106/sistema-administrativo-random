import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { ExpenseStatus, ExpenseType } from '@/api/graphql';
import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { pascalCaseToSpaces } from '@/lib/utils';
import { ExpensesPageProps } from '@/pages/expenses';

type DataTableToolbarProps<TData> = {
    table: Table<TData>;
} & ExpensesPageProps;

export function ExpensesDataTableToolbar<TData>({
    table,
    techs,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center space-x-2">
            <Label className="block">Filtrar por</Label>

            <DataTableFacetedFilter
                column={table.getColumn('registeredBy')}
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
                column={table.getColumn('expenseStatus')}
                title="Estado"
                options={Object.values(ExpenseStatus).map((value) => ({
                    label: pascalCaseToSpaces(value),
                    value,
                }))}
            />

            <DataTableFacetedFilter
                column={table.getColumn('expenseType')}
                title="Tipo"
                options={Object.values(ExpenseType).map((value) => ({
                    label: pascalCaseToSpaces(value),
                    value,
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
