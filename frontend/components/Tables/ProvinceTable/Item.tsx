import { useRouter } from 'next/router';

import { Table } from 'flowbite-react';
import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import { type IProvince } from 'backend/models/interfaces';
import Modal from 'frontend/components/Modal';
import useAlert from 'frontend/hooks/useAlert';
import useLoading from 'frontend/hooks/useLoading';
import * as apiEndpoints from 'lib/apiEndpoints';
import fetcher from 'lib/fetcher';
import { slugify } from 'lib/utils';

interface props {
    province: IProvince;
    deleteProvince: (id: string) => void;
}

export default function Item({ province, deleteProvince }: props): JSX.Element {
    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();
    const { triggerAlert } = useAlert();
    const [toggleModal, setToggleModal] = useState(false);
    function openModal(): void {
        setToggleModal(true);
    }
    function closeModal(): void {
        setToggleModal(false);
    }

    const deleteData = async (): Promise<void> => {
        try {
            await fetcher.delete({ _id: province._id }, apiEndpoints.techAdmin.provinces);
            deleteProvince(province._id as string);
            triggerAlert({
                type: 'Success',
                message: `La provincia ${province.name} se elimino correctamente`,
            });
        } catch (error) {
            console.log(error);
            triggerAlert({
                type: 'Failure',
                message: `No se pudo eliminar la provincia ${province.name}`,
            });
        }
    };

    const handleDelete = (): void => {
        void deleteData();
    };

    async function navigateEdit(): Promise<void> {
        startLoading();
        await router.push(`/tech-admin/provinces/${slugify(province.name)}`);
        stopLoading();
    }

    const handleNavigateEdit = (): void => {
        void navigateEdit();
    };

    return (
        <Table.Row className="border-b">
            <Table.Cell>{province.name}</Table.Cell>
            <Table.Cell>
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
                        openModal={toggleModal}
                        handleToggleModal={closeModal}
                        action={handleDelete}
                        msg="¿Seguro que quiere eliminar esta provincia?"
                    />
                </div>
            </Table.Cell>
        </Table.Row>
    );
}
