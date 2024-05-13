/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ChangeEvent, useState, useEffect } from 'react';

import Item from './Item';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ValidClientViewProps } from '@/pages/tech-admin/clients/[clientId]/branches';
import { TasksDataTableToolbar } from '@/modules/TasksDataTable/TableToolbar';
import { ColumnFiltersState, SortingState, getCoreRowModel, getFacetedRowModel, getFilteredRowModel,getFacetedUniqueValues as globalGetFacetedUniqueValues, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { BranchesQuery } from '@/api/graphql';
import { useBranchesListQuery } from '@/modules/BranchesDataTable/queries';
import { useBranchesTableColumns } from '@/modules/BranchesDataTable/columns';

export type BranchTableProps = ValidClientViewProps;

export default function BranchTable({
    branches,
    cities,
    provinces,
    businesses,
}: BranchTableProps): JSX.Element {
    const [tableBranches, setTableBranches] = useState(branches);

    const [type, setType] = useState<string>('');

    type TableItem = BranchesQuery['branches'][0];

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const branchesQuery = useBranchesListQuery({
        business: null,
        city: null,
        client: null,
        location: null,
      
    });

    const [branches, setBranches] = useState(branchesQuery.data?.branches);

    const columns = useBranchesTableColumns();

    useEffect(() => {
        setBranches(branchesQuery.data?.tasks);
    }, [branchesQuery.data?.branches]);

    const table = useReactTable<TableItem>({
        data: branches || [],
        columns: columns ,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: (table, columnId) => {
            if (columnId === 'assigned') {
                return () => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const uniqueValuesMap = new Map<any, number>();
                    const rows = table.getCoreRowModel().rows;

                    rows.forEach((row) => {
                        const assigned: TableItem['assigned'] = row.getValue(columnId);

                        for (const user of assigned) {
                            const valueInMap = uniqueValuesMap.get(user.id);

                            if (typeof valueInMap !== 'undefined') {
                                uniqueValuesMap.set(user.id, valueInMap + 1);
                            } else {
                                uniqueValuesMap.set(user.id, 1);
                            }
                        }
                    });

                    return uniqueValuesMap;
                };
            }

            return globalGetFacetedUniqueValues<TableItem>()(table, columnId);
        },
        state: {
            columnVisibility: {
                branch: false,
                business: false,
                client: false,
            },
            sorting,
            columnFilters,
        },
    });


    function selectEntity(e: ChangeEvent<HTMLSelectElement>): void {
        const { value } = e.target;

        switch (type) {
            case 'Localidad':
                // const city = cities.find(city=>city.name === value)
                setTableBranches(branches.filter((branch) => branch.city.name === value));
                break;
            case 'Provincia':
                setTableBranches(
                    branches.filter((branch) => branch.city.province.name === value),
                );
                break;
            case 'Empresa':
                setTableBranches(
                    branches.filter((branch) =>
                        branch.businesses.some((business) => business.name === value),
                    ),
                );
                break;
            default:
                setTableBranches(branches);
                break;
        }
    }

    

    const deleteBranch = (id: string): void => {
        setTableBranches((prev) => {
            return prev.filter((branch) => branch.id !== id);
        });
    };

    return (
        <div className="rounded-none">
           <TasksDataTableToolbar table={table} {...props} />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Sucursal</TableHead>
                        <TableHead>Localidad</TableHead>
                        <TableHead>Empresas contratadas</TableHead>
                        <TableHead className="w-40 text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {tableBranches.map((branch) => (
                        <Item
                            key={branch.id}
                            branch={branch}
                            deleteBranch={deleteBranch}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
