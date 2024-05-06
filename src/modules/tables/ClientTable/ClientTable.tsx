import { useState } from 'react';

import Item from './Item';

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ClientsPageProps } from '@/pages/tech-admin/clients';

export default function ClientTable({ clients }: ClientsPageProps): JSX.Element {
    const [tableClients, setTableClients] = useState(clients);

    const deleteClient = (id: string): void => {
        setTableClients(tableClients.filter((client) => client.id !== id));
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
