import Link from 'next/link';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { TASKS_LIST_QUERY_KEY } from './queries';

import { fetchClient } from '@/api/fetch-client';
import {
    DeleteTaskDocument,
    DeleteTaskMutation,
    DeleteTaskMutationVariables,
    TasksQuery,
} from '@/api/graphql';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <Link href={`/tech-admin/tasks/${task.id}/edit`}>Editar</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <button className="w-full cursor-default" onClick={openModal}>
                            Eliminar
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Modal
                openModal={modal}
                handleToggleModal={closeModal}
                action={() => deleteMutation.mutate({ id: task.id })}
                msg="¿Seguro que quiere eliminar esta tarea?"
            />
        </>
    );
}
