import Link from 'next/link';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { fetchClient } from '@/api/fetch-client';
import {
    DeletePreventiveDocument,
    DeletePreventiveMutation,
    DeletePreventiveMutationVariables,
    GetPreventivesQuery,
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
import { PREVENTIVES_QUERY_KEY } from '@/hooks/api/preventive/useGetPreventives';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';

interface Props {
    preventive: GetPreventivesQuery['preventives'][0];
}

export function PreventivesTableRowActions({ preventive }: Props): JSX.Element {
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
        DeletePreventiveMutation,
        Error,
        DeletePreventiveMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(DeletePreventiveDocument, {
                id: data.id,
            });
        },
        onSuccess: (data) => {
            if (!data.deletePreventive) {
                return;
            }

            const { preventive } = data.deletePreventive;
            if (!preventive) {
                throw new Error('Hubo un error al eliminar la tarea');
            }

            queryClient.invalidateQueries({
                queryKey: [PREVENTIVES_QUERY_KEY],
            });
            queryClient.refetchQueries({
                queryKey: [PREVENTIVES_QUERY_KEY],
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
                        <Link href={routesBuilder.preventives.edit(preventive.id)}>
                            Editar
                        </Link>
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
                action={() => deleteMutation.mutate({ id: preventive.id })}
                msg="¿Seguro que quiere eliminar esta tarea?"
            />
        </>
    );
}
