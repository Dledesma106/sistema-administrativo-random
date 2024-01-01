import { useRouter } from 'next/navigation';

import { Table } from 'flowbite-react';
import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import Modal from '@/components/Modal';
import useAlert from '@/context/alertContext/useAlert';
import useLoading from '@/hooks/useLoading';
import * as apiEndpoints from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { type IProvince, type IBranch } from 'backend/models/interfaces';

interface Props {
    branch: IBranch;
    deleteBranch: (id: string) => void;
}

export default function Item({ branch, deleteBranch }: Props): JSX.Element {
    const [modal, setModal] = useState(false);
    const openModal = (): void => {
        setModal(true);
    };
    const closeModal = (): void => {
        setModal(false);
    };
    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();
    const { triggerAlert } = useAlert();

    const deleteData = async (): Promise<void> => {
        try {
            await fetcher.delete(
                {
                    _id: branch._id,
                },
                apiEndpoints.techAdmin.branches,
            );
            deleteBranch(branch._id as string);
            triggerAlert({
                type: 'Success',
                message: `La sucursal de numero ${branch.number} para el cliente ${branch.client.name} fue eliminada correctamente`,
            });
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo eliminar la sucursal ${branch.number} para el cliente ${branch.client.name}`,
            });
        }
    };

    async function navigateEdit(): Promise<void> {
        startLoading();
        await router.push(
            `/tech-admin/clients/${branch.client.name}/branches/${branch.number}`,
        );
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
            <Table.Cell>{branch.number}</Table.Cell>
            <Table.Cell>{`${branch.city.name}, ${
                (branch.city.provinceId as IProvince).name
            }`}</Table.Cell>
            <Table.Cell>
                {branch.businessesIDs.length > 1
                    ? branch.businessesIDs.map((business) => `${business.name}, `)
                    : `${branch.businessesIDs[0].name}`}
            </Table.Cell>
            <Table.Cell>
                <div className="flex items-center justify-center gap-2">
                    <button
                        className="rounded-lg p-0.5 hover:bg-gray-200"
                        onClick={handleNavigateEdit}
                    >
                        <BsFillPencilFill color="gray" size="15" />
                    </button>
                    <button
                        onClick={openModal}
                        className="rounded-lg p-0.5 hover:bg-gray-200"
                    >
                        <BsFillTrashFill color="gray" size="15" />
                    </button>

                    <Modal
                        openModal={modal}
                        handleToggleModal={closeModal}
                        action={handleDelete}
                        msg="¿Seguro que quiere eliminar esta sucursal?"
                    />
                </div>
            </Table.Cell>
        </Table.Row>
    );
}
