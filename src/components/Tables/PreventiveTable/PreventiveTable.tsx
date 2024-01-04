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
import {
    type IBusiness,
    type ICity,
    type IClient,
    type IPreventive,
    type IProvince,
    type IUser,
} from 'backend/models/interfaces';

interface IPreventiveProps {
    preventives: IPreventive[];
    cities: ICity[];
    provinces: IProvince[];
    techs: IUser[];
    businesses: IBusiness[];
    clients: IClient[];
}

export default function PreventiveTable({
    preventives,
    cities,
    provinces,
    techs,
    businesses,
    clients,
}: IPreventiveProps): JSX.Element {
    const [preventivesTable, setPreventivesTable] = useState<IPreventive[]>(preventives);
    const [type, setType] = useState<string>('');
    const [entities, setEntities] = useState<any[]>([] as any[]);
    const filterTypes = ['Localidad', 'Provincia', 'Tecnico', 'Empresa', 'Cliente'];
    function selectEntity(e: ChangeEvent<HTMLSelectElement>): void {
        const { value } = e.target;

        switch (type) {
            case 'Localidad':
                // const city = cities.find(city=>city.name === value)
                setPreventivesTable(
                    preventives.filter(
                        (preventive) => preventive.branch.city.name === value,
                    ),
                );
                break;
            case 'Provincia':
                setPreventivesTable(
                    preventives.filter(
                        (preventive) =>
                            (preventive.branch.city.provinceId as IProvince).name ===
                            value,
                    ),
                );
                break;
            case 'Tecnico':
                setPreventivesTable(
                    preventives.filter((preventive) =>
                        preventive.assignedIDs.some((tech) => tech.fullName === value),
                    ),
                );
                break;
            case 'Empresa':
                setPreventivesTable(
                    preventives.filter(
                        (preventive) => preventive.business.name === value,
                    ),
                );
                break;
            case 'Cliente':
                setPreventivesTable(() =>
                    preventives.filter(
                        (preventive) => preventive.branch.client.name === value,
                    ),
                );
                break;
            default:
                setPreventivesTable(preventives);
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
            case 'Tecnico':
                setEntities(techs);
                break;
            case 'Empresa':
                setEntities(businesses);
                break;
            case 'Cliente':
                setEntities(clients);
                break;
            default:
                break;
        }
    }

    function clearFilter(): void {
        setType('');
        setEntities([] as any[]);
        setPreventivesTable(preventives);
    }

    const deletePreventive = async (id: string): Promise<void> => {
        setPreventivesTable(
            preventivesTable.filter((preventive) => preventive._id !== id),
        );
    };

    const handleDelete = (id: string): void => {
        void deletePreventive(id);
    };

    return (
        <>
            <Filter
                types={filterTypes}
                entities={entities}
                selectType={selectType}
                selectEntity={selectEntity}
                clearFilter={clearFilter}
            />
            <Table>
                <TableHeader className="border-b bg-white">
                    <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Sucursal</TableHead>
                        <TableHead>Tecnico Asignado</TableHead>
                        <TableHead>Frecuencia</TableHead>
                        <TableHead>Meses impuestos</TableHead>
                        <TableHead>Observaciones</TableHead>
                        <TableHead>Ultima vez</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha bateria</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {preventivesTable.map((preventive, index) => (
                        <Item
                            key={index}
                            preventive={preventive}
                            deletePreventive={handleDelete}
                        />
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
