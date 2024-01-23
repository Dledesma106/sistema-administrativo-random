import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';
import { HiMagnifyingGlassPlus } from 'react-icons/hi2';

import Modal from '@/components/Modal';
import { TableCell, TableRow } from '@/components/ui/table';
import useAlert from '@/context/alertContext/useAlert';
import useLoading from '@/hooks/useLoading';
import * as apiEndpoints from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { slugify } from '@/lib/utils';
import { ClientsPageProps } from '@/pages/tech-admin/clients';

interface Props {
    client: ClientsPageProps['clients'][0];
    deleteClient: (id: string) => void;
}

export default function Item({ client, deleteClient }: Props): JSX.Element {
    const { startLoading, stopLoading } = useLoading();
    const [modal, setModal] = useState(false);
    const { triggerAlert } = useAlert();
    const openModal = (): void => {
        setModal(true);
    };
    const closeModal = (): void => {
        setModal(false);
    };

    const router = useRouter();

    async function navigateClient(): Promise<void> {
        startLoading();
        await router.push(`/tech-admin/clients/${slugify(client.name)}/branches`);
        stopLoading();
    }

    const handleNavigateClient = (): void => {
        void navigateClient();
    };

    async function navigateEdit(): Promise<void> {
        startLoading();
        await router.push(`/tech-admin/clients/${slugify(client.name)}/edit`);
        stopLoading();
    }

    const handleNavigateEdit = (): void => {
        void navigateEdit();
    };

    const deleteData = async (): Promise<void> => {
        try {
            await fetcher.delete(
                {
                    _id: client.id,
                },
                apiEndpoints.techAdmin.clients,
            );
            deleteClient(client.id as string);
            triggerAlert({
                type: 'Success',
                message: `Se elimino el cliente ${client.name}`,
            });
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo eliminar el cliente ${client.name}`,
            });
        }
    };

    const handleDelete = (): void => {
        void deleteData();
    };

    return (
        <TableRow className="border-b">
            <TableCell>{client.name}</TableCell>
            <TableCell>
                <div className="flex items-center justify-center gap-2">
                    <button
                        className="rounded-lg p-0.5 hover:bg-gray-200"
                        onClick={handleNavigateClient}
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
