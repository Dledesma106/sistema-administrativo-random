import { Table } from 'flowbite-react';
import { type ChangeEvent, useState } from 'react';

import Item from './Item';

import Filter from '@/components/Filter';
import {
    type IBranch,
    type IBusiness,
    type ICity,
    type IProvince,
} from 'backend/models/interfaces';

interface Props {
    branches: IBranch[];
    cities: ICity[];
    provinces: IProvince[];
    businesses: IBusiness[];
}

export default function BranchTable({
    branches,
    cities,
    provinces,
    businesses,
}: Props): JSX.Element {
    const [tableBranches, setTableBranches] = useState<IBranch[]>(branches);
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
                    branches.filter(
                        (branch) => (branch.city.provinceId as IProvince).name === value,
                    ),
                );
                break;
            case 'Empresa':
                setTableBranches(
                    branches.filter((branch) =>
                        branch.businessesIDs.some((business) => business.name === value),
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
        const newTable = (prev: IBranch[]): IBranch[] =>
            prev.filter((branch) => branch._id !== id);
        setTableBranches(newTable(branches));
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
            <Table hoverable={true} className="bg-white">
                <Table.Head className="border-b bg-white">
                    <Table.HeadCell>Sucursal</Table.HeadCell>
                    <Table.HeadCell>Localidad</Table.HeadCell>
                    <Table.HeadCell>Empresas contratadas</Table.HeadCell>
                    <Table.HeadCell className="w-40 text-center">Acciones</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                    {tableBranches.map((branch, index) => (
                        <Item key={index} branch={branch} deleteBranch={deleteBranch} />
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}
