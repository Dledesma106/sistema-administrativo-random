import { useRouter } from 'next/router';

import { Table } from 'flowbite-react';
import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import { type IBusiness } from 'backend/models/interfaces';
import Modal from 'frontend/components/Modal';
import useAlert from 'frontend/hooks/useAlert';
import useLoading from 'frontend/hooks/useLoading';
import * as apiEndpoints from 'lib/apiEndpoints';
import fetcher from 'lib/fetcher';
import { slugify } from 'lib/utils';

interface props {
    business: IBusiness;
    deleteBusiness: (id: string) => void;
}

export default function Item({ business, deleteBusiness }: props): JSX.Element {
    const router = useRouter();
    const { startLoading, stopLoading } = useLoading();
    const [modal, setModal] = useState(false);
    const { triggerAlert } = useAlert();
    const openModal = (): void => {
        setModal(true);
    };
    const closeModal = (): void => {
        setModal(false);
    };

    const deleteData = async (): Promise<void> => {
        try {
            await fetcher.delete(
                { _id: business._id },
                apiEndpoints.techAdmin.businesses,
            );
            deleteBusiness(business._id as string);
            triggerAlert({
                type: 'Success',
                message: `La empresa ${business.name} fue eliminada correctamente`,
            });
        } catch (error) {
            console.log(error);
            triggerAlert({
                type: 'Failure',
                message: `No se pudo eliminar la empresa ${business.name}, compruebe la conexión a internet`,
            });
        }
    };

    async function navigateEdit(): Promise<void> {
        startLoading();
        await router.push(`/tech-admin/businesses/${slugify(business.name)}`);
        stopLoading();
    }

    const handleDelete = (): void => {
        void deleteData();
    };

    const handleNavigateEdit = (): void => {
        void navigateEdit();
    };

    return (
        <Table.Row className="border-b">
            <Table.Cell>{business.name}</Table.Cell>
            <Table.Cell className="w-40">
                <div className="flex items-center justify-center gap-2">
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
                        msg="¿Seguro que quiere eliminar esta empresa?"
                    />
                </div>
            </Table.Cell>
        </Table.Row>
    );
}
