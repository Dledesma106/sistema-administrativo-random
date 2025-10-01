import Link from 'next/link';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { GetClientBranchesQuery, GetClientQuery } from '@/api/graphql';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAlert from '@/context/alertContext/useAlert';
import { useDeleteBranch } from '@/hooks/api/branch/useDeleteBranch';
import { CLIENT_BRANCHES_QUERY_KEY } from '@/hooks/api/branch/useGetClientBranches';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';

interface Props {
    branch: GetClientBranchesQuery['clientBranches'][0];
    client: GetClientQuery['client'];
}

export function RowActions({ branch, client }: Props): JSX.Element {
    const [modal, setModal] = useState(false);
    const { triggerAlert } = useAlert();
    const queryClient = useQueryClient();

    const { mutateAsync: deleteBranch } = useDeleteBranch();

    const openModal = (): void => {
        setModal(true);
    };

    const closeModal = (): void => {
        setModal(false);
    };

    const handleDelete = async () => {
        try {
            const result = await deleteBranch({ id: branch.id });

            if (!result.deleteBranch?.success) {
                throw new Error(
                    result.deleteBranch?.message || 'Error al eliminar la sucursal',
                );
            }

            queryClient.invalidateQueries({
                queryKey: [CLIENT_BRANCHES_QUERY_KEY],
            });

            triggerAlert({
                type: 'Success',
                message: 'La sucursal fue eliminada correctamente',
            });
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: getCleanErrorMessage(error as Error),
            });
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex size-8 p-0">
                        <DotsHorizontalIcon className="size-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <Link href={routesBuilder.branches.edit(client.id, branch.id)}>
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
                action={handleDelete}
                msg="¿Seguro que quiere eliminar esta sucursal?"
            />
        </>
    );
}
