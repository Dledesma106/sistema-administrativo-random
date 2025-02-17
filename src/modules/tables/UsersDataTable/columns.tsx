import { Role } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';

import { UsersTableRowActions } from './users-table-row-actions';

import { GetUsersQuery } from '@/api/graphql';
import { UserRoleBadge } from '@/components/ui/Badges/UserRoleBadge';

type User = GetUsersQuery['users'][number];

const columnHelper = createColumnHelper<User>();

export const useUsersTableColumns = () => [
    columnHelper.accessor('fullName', {
        header: 'Nombre',
    }),
    columnHelper.accessor('city.name', {
        header: 'Ciudad',
    }),
    columnHelper.accessor('email', {
        header: 'Email',
    }),
    columnHelper.accessor('roles', {
        header: 'Roles',
        cell: (info) => (
            <div className="flex flex-wrap gap-1">
                {info.getValue().map((role) => (
                    <UserRoleBadge key={role} role={role} />
                ))}
            </div>
        ),
    }),
    columnHelper.accessor('city.id', {
        id: 'cityId',
        enableHiding: true,
    }),
    columnHelper.accessor('roles', {
        id: 'roleFilter',
        enableHiding: true,
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => <UsersTableRowActions user={props.row.original} />,
    }),
];

export const roleOptions = Object.values(Role).map((role) => ({
    label: role,
    value: role,
}));
