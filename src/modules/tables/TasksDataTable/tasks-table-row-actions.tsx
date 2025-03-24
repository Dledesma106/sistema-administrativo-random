import { useRouter } from 'next/router';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

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
import { TASKS_QUERY_KEY } from '@/hooks/api/tasks/useGetTasks';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';

interface Props {
    task: TasksQuery['tasks'][0];
}

export function TasksTableRowActions({ task }: Props): JSX.Element {
    const [modal, setModal] = useState(false);
    const { triggerAlert } = useAlert();
    const router = useRouter();
    const queryClient = useQueryClient();

    const openModal = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setModal(true);
    };

    const closeModal = (e?: React.MouseEvent): void => {
        e?.stopPropagation();
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

            queryClient.invalidateQueries({
                queryKey: TASKS_QUERY_KEY,
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
                    <Button variant="ghost" className="size-8 flex p-0">
                        <DotsHorizontalIcon className="size-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    {task.status === 'Pendiente' && (
                        <DropdownMenuItem asChild>
                            <div
                                onClick={() =>
                                    router.push(routesBuilder.tasks.edit(task.id))
                                }
                            >
                                Editar
                            </div>
                        </DropdownMenuItem>
                    )}
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
