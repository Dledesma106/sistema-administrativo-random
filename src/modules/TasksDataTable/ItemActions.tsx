import Link from 'next/link';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import { TASKS_LIST_QUERY_KEY } from './queries';

import { fetchClient } from '@/api/fetch-client';
import {
    DeleteTaskDocument,
    DeleteTaskMutation,
    DeleteTaskMutationVariables,
    TasksQuery,
} from '@/api/graphql';
import Modal from '@/components/Modal';
import useAlert from '@/context/alertContext/useAlert';
import { getCleanErrorMessage } from '@/lib/utils';

interface Props {
    task: TasksQuery['tasks'][0];
}

export default function TechAdminTaskItemActions({ task }: Props): JSX.Element {
    const [modal, setModal] = useState(false);
    const { triggerAlert } = useAlert();
    const queryClient = useQueryClient();

    const openModal = (): void => {
        setModal(true);
    };

    const closeModal = (): void => {
        setModal(false);
    };

    const deleteMutation = useMutation<
        DeleteTaskMutation,
        Error,
        DeleteTaskMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(DeleteTaskDocument, {
                id: data.id,
            });
        },
        onSuccess: (data) => {
            if (!data.deleteTask) {
                return;
            }

            const { task } = data.deleteTask;
            if (!task) {
                throw new Error('Hubo un error al eliminar la tarea');
            }

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
                message: `La tarea fue eliminada correctamente`,
            });
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: getCleanErrorMessage(error),
            });
        },
    });

    return (
        <>
            <div className="flex items-center justify-evenly">
                <Link
                    className="rounded-lg p-0.5 hover:bg-gray-200"
                    href={`/tech-admin/tasks/${task.id}`}
                >
                    <BsFillPencilFill color="gray" size="15" />
                </Link>

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
                action={() => deleteMutation.mutate({ id: task.id })}
                msg="¿Seguro que quiere eliminar esta tarea?"
            />
        </>
    );
}
