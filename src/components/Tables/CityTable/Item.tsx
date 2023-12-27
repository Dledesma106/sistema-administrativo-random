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
import { type IProvince, type ICity } from 'backend/models/interfaces';

interface Props {
    city: ICity;
    deleteCity: (id: string) => void;
}

export default function Item({ city, deleteCity }: Props): JSX.Element {
    const router = useRouter();
    const [modal, setModal] = useState(false);
    const openModal = (): void => {
        setModal(true);
    };
    const closeModal = (): void => {
        setModal(false);
    };
    const { startLoading, stopLoading } = useLoading();
    const { triggerAlert } = useAlert();

    const deleteData = async (): Promise<void> => {
        try {
            await fetcher.delete(
                {
                    _id: city._id,
                },
                apiEndpoints.techAdmin.cities,
            );
            deleteCity(city._id as string);
            triggerAlert({
                type: 'Success',
                message: `La empresa ${city.name} fue eliminada correctamente`,
            });
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo eliminar la empresa ${city.name}, compruebe la conexión a internet`,
            });
        }
    };

    async function navigateEdit(): Promise<void> {
        startLoading();
        await router.push(`/tech-admin/cities/${slugify(city.name)}`);
        stopLoading();
    }

    const handleNavigateEdit = (): void => {
        void navigateEdit();
    };

    const handleDelete = (): void => {
        void deleteData();
    };

    return (
        <TableRow className="border-b">
            <TableCell>{city.name}</TableCell>
            <TableCell>{(city.province as IProvince).name}</TableCell>
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
                        openModal={modal}
                        handleToggleModal={closeModal}
                        action={handleDelete}
                        msg="¿Seguro que quiere eliminar esta ciudad?"
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
