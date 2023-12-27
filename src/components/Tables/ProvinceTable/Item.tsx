import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import Modal from '@/components/Modal';
import { TableCell, TableRow } from '@/components/ui/table';
import useAlert from '@/hooks/useAlert';
import useLoading from '@/hooks/useLoading';
import * as apiEndpoints from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { slugify } from '@/lib/utils';
import { type IProvince } from 'backend/models/interfaces';

interface Props {
    province: IProvince;
    deleteProvince: (id: string) => void;
}

export default function Item({ province, deleteProvince }: Props): JSX.Element {
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
            await fetcher.delete(
                {
                    _id: province._id,
                },
                apiEndpoints.techAdmin.provinces,
            );
            deleteProvince(province._id as string);
            triggerAlert({
                type: 'Success',
                message: `La provincia ${province.name} se elimino correctamente`,
            });
        } catch (error) {
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
        <TableRow className="border-b">
            <TableCell>{province.name}</TableCell>
            <TableCell>
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
            </TableCell>
        </TableRow>
    );
}
