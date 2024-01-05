import { useState } from 'react';

import UserItemActions from './Item';

import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type IUser } from 'backend/models/interfaces';

interface Props {
    users: IUser[];
}
export default function UserTable({ users }: Props): JSX.Element {
    const [tableUsers, setTableUsers] = useState<IUser[]>(users);

    const deleteUser = (id: string): void => {
        const newTable = (prev: IUser[]): IUser[] =>
            prev.filter((user) => user._id !== id);
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
