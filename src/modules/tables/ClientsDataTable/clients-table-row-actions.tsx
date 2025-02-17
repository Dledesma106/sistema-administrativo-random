import { useRouter } from 'next/router';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { GetClientsQuery } from '@/api/graphql';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAlert from '@/context/alertContext/useAlert';
import { useDeleteClient } from '@/hooks/api/client/useDeleteClient';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';

interface Props {
    client: GetClientsQuery['clients'][0];
}

export function ClientsTableRowActions({ client }: Props) {
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const { triggerAlert } = useAlert();
    const deleteMutation = useDeleteClient();

    const handleDelete = () => {
        deleteMutation.mutate(
            { id: client.id },
            {
                onSuccess: () => {
                    triggerAlert({
                        type: 'Success',
                        message: 'Cliente eliminado correctamente',
                    });
                    setModal(false);
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

    return (
        <div className="flex w-full justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-[160px] bg-background text-foreground"
                >
                    <DropdownMenuItem
                        onClick={() => router.push(routesBuilder.clients.edit(client.id))}
                    >
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setModal(true)}>
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Modal
                openModal={modal}
                handleToggleModal={() => setModal(false)}
                action={handleDelete}
                msg="¿Seguro que quiere eliminar este cliente?"
            />
        </div>
    );
}
