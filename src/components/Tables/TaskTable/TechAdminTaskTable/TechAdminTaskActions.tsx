import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import Modal from '@/components/Modal';
import { TableCell } from '@/components/ui/table';
import useAlert from '@/hooks/useAlert';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { type ITask } from 'backend/models/interfaces';

interface Props {
    task: ITask;
    deleteTask: (id: string) => void;
}
export default function TechAdminTaskActions({ task, deleteTask }: Props): JSX.Element {
    const [modal, setModal] = useState(false);
    const { triggerAlert } = useAlert();
    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();

    async function navigateEdit(): Promise<void> {
        startLoading();
        await router.push(`/tech-admin/tasks/${task._id as string}`);
        stopLoading();
    }

    const openModal = (): void => {
        setModal(true);
    };
    const closeModal = (): void => {
        setModal(false);
    };

    const deleteData = async (): Promise<void> => {
        try {
            await fetcher.delete(
                {
                    _id: task._id,
                },
                api.techAdmin.tasks,
            );
            deleteTask(task._id as string);
            triggerAlert({
                type: 'Success',
                message: `La tarea de ${task.business.name} en la sucursal ${task.branch.number} de ${task.branch.client.name} fue eliminada correctamente`,
            });
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo eliminar la tarea de ${task.business.name} para la sucursal ${task.branch.number} de ${task.branch.client.name}`,
            });
        }
    };

    const handleNavigateEdit = (): void => {
        void navigateEdit();
    };

    const handleDelete = (): void => {
        void deleteData();
    };

    return (
        <>
            <TableCell>
                <div className="flex items-center justify-evenly">
                    <button
                        className="rounded-lg p-0.5 hover:bg-gray-200"
                        onClick={handleNavigateEdit}
                    >
                        <BsFillPencilFill color="gray" size="15" />
                    </button>
                    <button
                        onClick={openModal}
                        className="rounded-lg p-0.5 hover:bg-gray-200"
                    >
                        <BsFillTrashFill color="gray" size="15" />
                    </button>
                </div>
            </TableCell>
            <Modal
                openModal={modal}
                handleToggleModal={closeModal}
                action={handleDelete}
                msg="¿Seguro que quiere eliminar esta tarea?"
            />
        </>
    );
}
