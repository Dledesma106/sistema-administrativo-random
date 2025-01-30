import { useState } from 'react';

import Item from './Item';

import { GetBusinessesQuery } from '@/api/graphql';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Props = {
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
};

export default function BusinessTable({ businesses }: Props): JSX.Element {
    const [tableBusinesses, setTableBusinesses] = useState(businesses);

    const deleteBusiness = (id: string): void => {
        const newTable = (prev: Props['businesses']) =>
            prev.filter((business) => business.id !== id);
        setTableBusinesses(newTable(tableBusinesses));
    };

    return (
        <div className="mb-6">
            <Table>
                <TableHeader className="border-b bg-white">
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="w-40 text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableBusinesses.map((business, index) => (
                        <Item
                            key={index}
                            business={business}
                            deleteBusiness={deleteBusiness}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
