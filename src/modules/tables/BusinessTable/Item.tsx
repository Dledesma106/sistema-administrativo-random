import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import Modal from '@/components/Modal';
import { TableCell, TableRow } from '@/components/ui/table';
import useAlert from '@/context/alertContext/useAlert';
import useLoading from '@/hooks/useLoading';
import * as apiEndpoints from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { slugify } from '@/lib/utils';
import { BusinessesPageProps } from '@/pages/tech-admin/businesses';

interface Props {
    business: BusinessesPageProps['businesses'][0];
    deleteBusiness: (id: string) => void;
}

export default function Item({ business, deleteBusiness }: Props): JSX.Element {
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
                {
                    _id: business.id,
                },
                apiEndpoints.techAdmin.businesses,
            );
            deleteBusiness(business.id);
            triggerAlert({
                type: 'Success',
                message: `La empresa ${business.name} fue eliminada correctamente`,
            });
        } catch (error) {
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
        <TableRow className="border-b">
            <TableCell>{business.name}</TableCell>
            <TableCell className="w-40">
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
            </TableCell>
        </TableRow>
    );
}
