import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import { TASKS_LIST_QUERY_KEY } from './queries';

import { TasksQuery } from '@/api/graphql';
import Modal from '@/components/Modal';
import useAlert from '@/context/alertContext/useAlert';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';

interface Props {
    task: TasksQuery['tasks'][0];
}

export default function TechAdminTaskItemActions({ task }: Props): JSX.Element {
    const [modal, setModal] = useState(false);
    const { triggerAlert } = useAlert();
    const router = useRouter();
    const queryClient = useQueryClient();

    function navigateEdit() {
        router.push(`/tech-admin/tasks/${task.id as string}`);
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
                    _id: task.id,
                },
                api.techAdmin.tasks,
            );

            queryClient.setQueryData<TasksQuery>(TASKS_LIST_QUERY_KEY, (oldData) => {
                if (!oldData) {
                    return oldData;
                }

                const newData: TasksQuery = {
                    ...oldData,
                    tasks: oldData.tasks.filter((someTask) => someTask.id !== task.id),
                };

                return newData;
            });

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
            <Modal
                openModal={modal}
                handleToggleModal={closeModal}
                action={handleDelete}
                msg="¿Seguro que quiere eliminar esta tarea?"
            />
        </>
    );
}
