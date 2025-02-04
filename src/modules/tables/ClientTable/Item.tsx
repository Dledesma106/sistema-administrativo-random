import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';
import { HiMagnifyingGlassPlus } from 'react-icons/hi2';

import { GetClientsQuery } from '@/api/graphql';
import Modal from '@/components/Modal';
import { TableCell, TableRow } from '@/components/ui/table';
import useAlert from '@/context/alertContext/useAlert';
import { useDeleteClient } from '@/hooks/api/client/useDeleteClient';

interface Props {
    client: GetClientsQuery['clients'][0];
    deleteClient: (id: string) => void;
}

export default function Item({ client, deleteClient }: Props): JSX.Element {
    const router = useRouter();
    const [modal, setModal] = useState(false);
    const { triggerAlert } = useAlert();
    const deleteMutation = useDeleteClient();

    const openModal = (): void => setModal(true);
    const closeModal = (): void => setModal(false);

    const handleDelete = async (): Promise<void> => {
        try {
            const result = await deleteMutation.mutateAsync({ id: client.id });
            if (result.deleteClient.success) {
                deleteClient(client.id as string);
                triggerAlert({
                    type: 'Success',
                    message: `El cliente ${client.name} fue eliminado correctamente`,
                });
            } else {
                triggerAlert({
                    type: 'Failure',
                    message:
                        result.deleteClient.message ||
                        `No se pudo eliminar el cliente ${client.name}`,
                });
            }
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo eliminar el cliente ${client.name}, compruebe la conexión a internet`,
            });
        }
        closeModal();
    };

    const handleNavigateEdit = async (): Promise<void> => {
        await router.push(`/tech-admin/clients/${client.id}`);
    };

    const handleNavigateBranches = async (): Promise<void> => {
        await router.push(`/tech-admin/clients/${client.id}/branches`);
    };

    return (
        <TableRow className="border-b">
            <TableCell>{client.name}</TableCell>
            <TableCell className="w-40">
                <div className="flex items-center justify-center gap-2">
                    <button
                        className="rounded-lg p-0.5 hover:bg-gray-200"
                        onClick={handleNavigateBranches}
                    >
                        <HiMagnifyingGlassPlus color="gray" size="15" />
                    </button>
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
                    <Modal
                        openModal={modal}
                        handleToggleModal={closeModal}
                        action={handleDelete}
                        msg="¿Seguro que quiere eliminar este cliente?"
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
