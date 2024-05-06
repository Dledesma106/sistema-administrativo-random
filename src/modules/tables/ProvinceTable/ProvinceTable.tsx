import { useState } from 'react';

import Item from './Item';

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type IProvince } from 'backend/models/interfaces';

interface Props {
    provinces: IProvince[];
}

export default function ProvinceTable({ provinces }: Props): JSX.Element {
    const [tableProvinces, setTableProvinces] = useState<IProvince[]>(provinces);
    const deleteProvince = async (id: string): Promise<void> => {
        setTableProvinces(tableProvinces.filter((province) => province._id !== id));
    };

    const handleDelete = (id: string): void => {
        void deleteProvince(id);
    };

    return (
        <Table>
            <TableHeader className="border-b bg-white">
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="w-40 text-center">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableProvinces.map((province, index) => (
                    <Item key={index} province={province} deleteProvince={handleDelete} />
                ))}
            </TableBody>
        </Table>
    );
}
