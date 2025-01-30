import { User, Role } from '@prisma/client';

import { builder } from '../../builder';

export const RolePothosRef = builder.enumType('Role', {
    values: Object.fromEntries(
        Object.entries(Role).map(([name, value]) => [name, { value }]),
    ),
});

export const UserPothosRef = builder.prismaObject('User', {
    fields: (t) => ({
        id: t.exposeID('id'),
        email: t.exposeString('email'),
        firstName: t.exposeString('firstName'),
        lastName: t.exposeString('lastName'),
        fullName: t.exposeString('fullName'),
        city: t.relation('city', {
            nullable: true,
        }),
        roles: t.field({
            type: [RolePothosRef],
            resolve: (root: User) => {
                return root.roles as Role[];
            },
        }),
    }),
});

export const UserInputPothosRef = builder.inputType('UserInput', {
    fields: (t) => ({
        email: t.string({ required: true }),
        firstName: t.string({ required: true }),
        lastName: t.string({ required: true }),
        roles: t.field({
            type: [RolePothosRef],
            required: true,
        }),
        city: t.string({ required: true }),
    }),
});

export const UserCrudPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string | null;
        user?: User | null;
    }>('UserCrudPothosRef')
    .implement({
        fields: (t) => ({
            success: t.boolean({
                resolve: (result) => result.success,
            }),
            user: t.field({
                type: UserPothosRef,
                nullable: true,
                resolve: (result) => result.user,
            }),
            message: t.string({
                nullable: true,
                resolve: (result) => result.message,
            }),
        }),
    });
