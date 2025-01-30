import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import { GetProvincesQuery } from '@/api/graphql';
import Modal from '@/components/Modal';
import { TableCell, TableRow } from '@/components/ui/table';
import useAlert from '@/context/alertContext/useAlert';
import { useDeleteProvince } from '@/hooks/api/province/useDeleteProvince';
import useLoading from '@/hooks/useLoading';
import { routesBuilder } from '@/lib/routes';

interface Props {
    province: NonNullable<GetProvincesQuery>['provinces'][number];
}

export default function Item({ province }: Props): JSX.Element {
    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();
    const { triggerAlert } = useAlert();
    const [toggleModal, setToggleModal] = useState(false);
    const deleteProvinceMutation = useDeleteProvince();

    function openModal(): void {
        setToggleModal(true);
    }
    function closeModal(): void {
        setToggleModal(false);
    }

    const handleDelete = async (): Promise<void> => {
        try {
            const result = await deleteProvinceMutation.mutateAsync({ id: province.id });
            if (result.deleteProvince.success) {
                triggerAlert({
                    type: 'Success',
                    message: `La provincia ${province.name} se eliminó correctamente`,
                });
                closeModal();
            } else {
                triggerAlert({
                    type: 'Failure',
                    message:
                        result.deleteProvince.message ||
                        `No se pudo eliminar la provincia ${province.name}`,
                });
            }
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo eliminar la provincia ${province.name}`,
            });
        }
    };

    async function navigateEdit(): Promise<void> {
        startLoading();
        await router.push(routesBuilder.provinces.edit(province.id));
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
