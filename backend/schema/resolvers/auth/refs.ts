import { User } from '@prisma/client';

import { builder } from '../../builder';
import { UserPothosRef } from '../users/refs';

export const AuthResultRef = builder
    .objectRef<{
        success: boolean;
        message?: string;
        user?: User;
    }>('AuthResult')
    .implement({
        fields: (t) => ({
            success: t.exposeBoolean('success'),
            message: t.exposeString('message', { nullable: true }),
            user: t.field({
                type: UserPothosRef,
                nullable: true,
                resolve: (parent) => parent.user,
            }),
        }),
    });

export const LoginUserPothosRef = builder
    .objectRef<{
        success: boolean;
        message?: string | null;
        user?: User | null;
        accessToken?: string;
        expiresAt?: Date;
    }>('LoginUserResult')
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
            accessToken: t.string({
                nullable: true,
                resolve: (result) => result.accessToken,
            }),
            expiresAt: t.field({
                type: 'DateTime',
                nullable: true,
                resolve: (result) => result.expiresAt,
            }),
        }),
    });

export const ChangePasswordInputType = builder.inputType('ChangePasswordInput', {
    fields: (t) => ({
        currentPassword: t.string({ required: true }),
        newPassword: t.string({ required: true }),
    }),
});
