import { useRouter } from 'next/router';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CgPassword } from 'react-icons/cg';

import { GetUsersQuery } from '@/api/graphql';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAlert from '@/context/alertContext/useAlert';
import { useDeleteUser } from '@/hooks/api/user/useDeleteUser';
import { useSendNewUserRandomPassword } from '@/hooks/api/user/useSendNewUserRandomPassword';
import useLoading from '@/hooks/useLoading';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';

interface Props {
    user: GetUsersQuery['users'][number];
}

export function UsersTableRowActions({ user }: Props) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const router = useRouter();
    const { triggerAlert } = useAlert();
    const deleteMutation = useDeleteUser();
    const { startLoading, stopLoading } = useLoading();
    const sendNewRandomPassword = useSendNewUserRandomPassword();

    const handleDelete = () => {
        deleteMutation.mutate(
            { id: user.id },
            {
                onSuccess: () => {
                    triggerAlert({
                        type: 'Success',
                        message: 'Usuario eliminado correctamente',
                    });
                    setDeleteModal(false);
                },
                onError: (error) => {
                    triggerAlert({
                        type: 'Failure',
                        message: getCleanErrorMessage(error),
                    });
                },
            },
        );
    };

    async function handleReGeneratePassword(): Promise<void> {
        try {
            startLoading();
            await sendNewRandomPassword.mutateAsync({
                id: user.id,
            });
            triggerAlert({
                type: 'Success',
                message: `Se generó una nueva contraseña para ${user.fullName} correctamente`,
            });
            setPasswordModal(false);
            stopLoading();
        } catch (error) {
            stopLoading();
            triggerAlert({
                type: 'Failure',
                message: `No se pudo generar una nueva contraseña para ${user.fullName}`,
            });
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <DotsHorizontalIcon className="size-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <div
                            onClick={() => {
                                router.push(routesBuilder.users.edit(user.id));
                            }}
                            className="flex items-center gap-2"
                        >
                            <Pencil className="size-4" />
                            Editar
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <div
                            onClick={() => {
                                setDeleteModal(true);
                            }}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="size-4" />
                            Eliminar
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <div
                            onClick={() => {
                                setPasswordModal(true);
                            }}
                            className="flex items-center gap-2"
                        >
                            <CgPassword className="size-4" />
                            Regenerar contraseña
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Modal
                openModal={deleteModal}
                handleToggleModal={() => setDeleteModal(false)}
                action={handleDelete}
                msg="¿Seguro que quiere eliminar este usuario?"
            />

            <Modal
                openModal={passwordModal}
                handleToggleModal={() => setPasswordModal(false)}
                action={handleReGeneratePassword}
                msg={`¿Seguro que quiere regenerar la contraseña para ${user.fullName}?`}
            />
        </>
    );
}
