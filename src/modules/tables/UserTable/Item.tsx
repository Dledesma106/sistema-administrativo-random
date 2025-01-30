import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';
import { CgPassword } from 'react-icons/cg';

import { GetUsersQuery } from '@/api/graphql';
import Modal from '@/components/Modal';
import { TableCell, TableRow } from '@/components/ui/table';
import useAlert from '@/context/alertContext/useAlert';
import { useDeleteUser } from '@/hooks/api/user/useDeleteUser';
import { useSendNewUserRandomPassword } from '@/hooks/api/user/useSendNewUserRandomPassword';
import useLoading from '@/hooks/useLoading';
import { slugify } from '@/lib/utils';

type User = GetUsersQuery['users'][0];

interface Props {
    user: User;
    deleteUser: (id: string) => void;
}

export default function Item({ user, deleteUser }: Props): JSX.Element {
    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();
    const [modal, setModal] = useState(false);
    const { triggerAlert } = useAlert();
    const deleteMutation = useDeleteUser();
    const sendNewRandomPassword = useSendNewUserRandomPassword();

    const openModal = (): void => setModal(true);
    const closeModal = (): void => setModal(false);

    const handleDelete = async (): Promise<void> => {
        try {
            const result = await deleteMutation.mutateAsync({ id: user.id });
            if (result.deleteUser.success) {
                deleteUser(user.id);
                triggerAlert({
                    type: 'Success',
                    message: `El usuario ${user.fullName} fue eliminado correctamente`,
                });
            } else {
                triggerAlert({
                    type: 'Failure',
                    message:
                        result.deleteUser.message ||
                        `No se pudo eliminar el usuario ${user.fullName}`,
                });
            }
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo eliminar el usuario ${user.fullName}, compruebe la conexión a internet`,
            });
        }
        closeModal();
    };

    const handleNavigateEdit = async (): Promise<void> => {
        await router.push(`/tech-admin/users/${slugify(user.fullName)}`);
    };

    async function reGeneratePassword(): Promise<void> {
        try {
            startLoading();
            await sendNewRandomPassword.mutateAsync({
                id: user.id,
            });
            triggerAlert({
                type: 'Success',
                message: `Se generó una nueva contraseña para ${user.fullName} correctamente`,
            });
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
        <TableRow className="border-b">
            <TableCell>{user.firstName}</TableCell>
            <TableCell>{user.lastName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.city?.name}</TableCell>
            <TableCell>{user.roles.join(', ')}</TableCell>
            <TableCell className="w-40">
                <div className="flex items-center justify-center gap-2">
                    <button
                        className="rounded-lg p-0.5 hover:bg-gray-200"
                        onClick={handleNavigateEdit}
                    >
                        <BsFillPencilFill color="gray" size="15" />
                    </button>
                    <button
                        className="rounded-lg p-0.5 hover:bg-gray-200"
                        onClick={openModal}
                        disabled={deleteMutation.isPending}
                    >
                        <BsFillTrashFill color="gray" size="15" />
                    </button>
                    <button
                        className="rounded-lg p-0.5 hover:bg-gray-200"
                        onClick={reGeneratePassword}
                    >
                        <CgPassword color="gray" size="15" />
                    </button>
                    <Modal
                        openModal={modal}
                        handleToggleModal={closeModal}
                        action={handleDelete}
                        msg="¿Seguro que quiere eliminar este usuario?"
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
