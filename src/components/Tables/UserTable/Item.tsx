import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';
import { CgPassword } from 'react-icons/cg';

import Modal from '@/components/Modal';
import { TableCell } from '@/components/ui/table';
import useAlert from '@/hooks/useAlert';
import useLoading from '@/hooks/useLoading';
import * as apiEndpoints from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { type IUser } from 'backend/models/interfaces';

interface Props {
    user: IUser;
    deleteUser: (id: string) => void;
}

export default function UserItemActions({ user, deleteUser }: Props): JSX.Element {
    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [newPasswordModal, setNewPasswordModal] = useState<boolean>(false);
    const { triggerAlert } = useAlert();

    const openDeleteModal = (): void => {
        setDeleteModal(true);
    };

    const closeDeleteModal = (): void => {
        setDeleteModal(false);
    };

    const openNewPasswordModal = (): void => {
        setNewPasswordModal(true);
    };

    const closeNewPasswordModal = (): void => {
        setNewPasswordModal(false);
    };

    const deleteData = async (): Promise<void> => {
        try {
            await fetcher.delete(
                {
                    _id: user._id,
                },
                apiEndpoints.techAdmin.users,
            );
            deleteUser(user._id as string);
            triggerAlert({
                type: 'Success',
                message: `El usuario ${user.firstName} ${user.lastName} fue eliminado correctamente`,
            });
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo eliminar el usuario ${user.firstName} ${user.lastName}`,
            });
        }
    };

    async function navigateEdit(): Promise<void> {
        startLoading();
        await router.push(`/tech-admin/users/${user._id as string}`);
        stopLoading();
    }

    async function reGeneratePassword(): Promise<void> {
        try {
            startLoading();
            await fetcher.put(
                {
                    _id: user._id,
                },
                (apiEndpoints.techAdmin.users as string) + 'new-password',
            );
            triggerAlert({
                type: 'Success',
                message: `Se generó una nueva contraseña para ${
                    user.fullName as string
                } correctamente`,
            });
            stopLoading();
        } catch (error) {
            stopLoading();
            triggerAlert({
                type: 'Failure',
                message: `No se pudo generar una nueva contraseña para ${
                    user.fullName as string
                }`,
            });
        }
    }

    const handleDelete = (): void => {
        void deleteData();
    };

    const handleNavigate = (): void => {
        void navigateEdit();
    };

    const handleRegeneratePassword = (): void => {
        void reGeneratePassword();
    };

    return (
        <TableCell>
            <div className="flex items-center justify-center gap-2">
                <button
                    className="rounded-lg p-0.5 hover:bg-gray-200"
                    onClick={handleNavigate}
                >
                    <BsFillPencilFill color="gray" size="15" />
                </button>
                <button
                    className="rounded-lg p-0.5 hover:bg-gray-200"
                    onClick={openDeleteModal}
                >
                    <BsFillTrashFill color="gray" size="15" />
                </button>
                <button
                    className="rounded-lg p-0.5 hover:bg-gray-200"
                    onClick={openNewPasswordModal}
                >
                    <CgPassword color="gray" size="15" />
                </button>
                <Modal
                    openModal={deleteModal}
                    handleToggleModal={closeDeleteModal}
                    action={handleDelete}
                    msg="¿Seguro que quiere eliminar este usuario?"
                />
                <Modal
                    openModal={newPasswordModal}
                    handleToggleModal={closeNewPasswordModal}
                    action={handleRegeneratePassword}
                    msg="¿Seguro que quiere generar una nueva contraseña para este usuario?"
                />
            </div>
        </TableCell>
    );
}
