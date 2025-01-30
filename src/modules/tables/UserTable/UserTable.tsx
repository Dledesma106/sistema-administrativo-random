import { useState } from 'react';

import UserItemActions from './Item';

import { GetUsersQuery } from '@/api/graphql';
import { Badge } from '@/components/ui/Badges/badge';
import {
    Table,
    TableBody,
    TableCell,
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
                    {tableUsers.map((user, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.city?.name}</TableCell>

                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <div className="-ml-1 -mt-1 flex flex-wrap">
                                    {user.roles?.map((rol) => {
                                        return (
                                            <Badge key={rol} className="ml-1 mt-1">
                                                {rol}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </TableCell>
                            <UserItemActions user={user} deleteUser={deleteUser} />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
