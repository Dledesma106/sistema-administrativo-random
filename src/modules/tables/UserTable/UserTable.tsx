import { useState } from 'react';

import UserItemActions from './Item';

import { GetUsersQuery } from '@/api/graphql';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Props {
    users: GetUsersQuery['users'];
}
export default function UserTable({ users }: Props): JSX.Element {
    const [tableUsers, setTableUsers] = useState<GetUsersQuery['users']>(users);

    const deleteUser = (id: string): void => {
        const newTable = (prev: GetUsersQuery['users']): GetUsersQuery['users'] =>
            prev.filter((user) => user.id !== id);
        setTableUsers(newTable(users));
    };

    return (
        <div className="rounded-none shadow-none">
            <Table>
                <TableHeader className="border-b bg-white">
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Ciudad</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead className="w-40 text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableUsers.map((user) => (
                        <UserItemActions
                            user={user}
                            deleteUser={deleteUser}
                            key={user.id}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
