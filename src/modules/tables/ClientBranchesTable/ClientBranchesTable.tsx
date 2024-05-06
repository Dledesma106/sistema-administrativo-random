/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ChangeEvent, useState } from 'react';

import Item from './Item';

import Filter from '@/components/Filter';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ValidClientViewProps } from '@/pages/tech-admin/clients/[clientId]/branches';

export type BranchTableProps = ValidClientViewProps;

export default function BranchTable({
    branches,
    cities,
    provinces,
    businesses,
}: BranchTableProps): JSX.Element {
    const [tableBranches, setTableBranches] = useState(branches);

    const [type, setType] = useState<string>('');
    const [entities, setEntities] = useState<any[]>([] as any[]);
    const filterTypes = ['Localidad', 'Provincia', 'Empresa'];

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

    function selectType(e: ChangeEvent<HTMLSelectElement>): void {
        const { value } = e.target;

        setType(value);
        switch (value) {
            case 'Localidad':
                setEntities(cities);
                break;
            case 'Provincia':
                setEntities(provinces);
                break;
            case 'Empresa':
                setEntities(businesses);
                break;
            default:
                break;
        }
    }

    function clearFilter(): void {
        setType('');
        setEntities([] as any[]);
        setTableBranches(branches);
    }

    const deleteBranch = (id: string): void => {
        setTableBranches((prev) => {
            return prev.filter((branch) => branch.id !== id);
        });
    };

    return (
        <div className="rounded-none">
            <Filter
                types={filterTypes}
                entities={entities}
                selectType={selectType}
                selectEntity={selectEntity}
                clearFilter={clearFilter}
            />

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
