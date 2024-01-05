import { useState } from 'react';

import Item from './Item';

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type IClient } from 'backend/models/interfaces';

interface Props {
    clients: IClient[];
}
export default function ClientTable({ clients }: Props): JSX.Element {
    const [tableClients, setTableClients] = useState<IClient[]>(clients);

    const deleteClient = (id: string): void => {
        setTableClients(tableClients.filter((client) => client._id !== id));
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
                    {tableClients.map((client, index) => (
                        <Item key={index} client={client} deleteClient={deleteClient} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
