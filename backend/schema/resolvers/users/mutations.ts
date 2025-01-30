import { UserCrudPothosRef, UserInputPothosRef } from './refs';

import Mailer from 'lib/nodemailer';
import { prisma } from 'lib/prisma';

import { builder } from '../../builder';

export const UserMutations = builder.mutationFields((t) => ({
    createUser: t.field({
        type: UserCrudPothosRef,
        args: {
            input: t.arg({
                type: UserInputPothosRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, args) => {
            try {
                const { email, firstName, lastName, roles, city } = args.input;

                const userExists = await prisma.user.findUnique({
                    where: { email },
                });

                let user = null;
                const randomPassword = Math.random().toString(36).slice(-8);

                if (userExists && userExists.deleted) {
                    user = await prisma.user.update({
                        where: { id: userExists.id },
                        data: {
                            deleted: false,
                            firstName,
                            lastName,
                            fullName: `${firstName} ${lastName}`,
                            roles: { set: roles },
                            password: randomPassword,
                            city: { connect: { id: city } },
                        },
                    });
                } else if (userExists) {
                    return {
                        success: false,
                        user: null,
                        message: 'El usuario ya existe',
                    };
                } else {
                    user = await prisma.user.create({
                        data: {
                            email,
                            password: randomPassword,
                            firstName,
                            lastName,
                            fullName: `${firstName} ${lastName}`,
                            roles: { set: roles },
                            city: { connect: { id: city } },
                        },
                    });
                }

                Mailer.sendNewUserPassword({
                    email,
                    fullName: user.fullName,
                    password: randomPassword,
                });

                return {
                    success: true,
                    user,
                    message: null,
                };
            } catch (e) {
                return {
                    success: false,
                    user: null,
                    message: (e as Error).message,
                };
            }
        },
    }),
    updateUser: t.field({
        type: UserCrudPothosRef,
        args: {
            id: t.arg.string({ required: true }),
            input: t.arg({
                type: UserInputPothosRef,
                required: true,
            }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, args) => {
            try {
                const { id } = args;
                const { email, firstName, lastName, roles, city } = args.input;

                const userExists = await prisma.user.findUniqueUndeleted({
                    where: { id },
                });
                if (!userExists) {
                    return {
                        success: false,
                        user: null,
                        message: 'El usuario no existe',
                    };
                }

                const user = await prisma.user.update({
                    where: { id },
                    data: {
                        email,
                        firstName,
                        lastName,
                        fullName: `${firstName} ${lastName}`,
                        roles: { set: roles },
                        city: { connect: { id: city } },
                    },
                });

                return {
                    success: true,
                    user,
                    message: null,
                };
            } catch (e) {
                return {
                    success: false,
                    user: null,
                    message: (e as Error).message,
                };
            }
        },
    }),
    deleteUser: t.field({
        type: UserCrudPothosRef,
        args: {
            id: t.arg.string({ required: true }),
        },
        authz: {
            rules: ['IsAuthenticated', 'IsAdministrativoTecnico'],
        },
        resolve: async (_parent, { id }) => {
            try {
                const userExists = await prisma.user.findUniqueUndeleted({
                    where: { id },
                });

                if (!userExists) {
                    return {
                        success: false,
                        message: 'El usuario no existe',
                    };
                }

                const user = await prisma.user.update({
                    where: { id },
                    data: {
                        deleted: true,
                        deletedAt: new Date(),
                    },
                });

                return {
                    success: true,
                    user,
                    message: 'Usuario eliminado exitosamente',
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error al eliminar el usuario',
                };
            }
        },
    }),
}));
