import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import { GetBusinessesQuery } from '@/api/graphql';
import Modal from '@/components/Modal';
import { TableCell, TableRow } from '@/components/ui/table';
import useAlert from '@/context/alertContext/useAlert';
import { useDeleteBusiness } from '@/hooks/api/business/useDeleteBusiness';
import { routesBuilder } from '@/lib/routes';

type Props = {
    business: NonNullable<GetBusinessesQuery['businesses']>[0];
    deleteBusiness: (id: string) => void;
};

export default function Item({ business, deleteBusiness }: Props): JSX.Element {
    const router = useRouter();
    const [modal, setModal] = useState(false);
    const { triggerAlert } = useAlert();
    const deleteMutation = useDeleteBusiness();

    const openModal = (): void => setModal(true);
    const closeModal = (): void => setModal(false);

    const handleDelete = async (): Promise<void> => {
        try {
            const result = await deleteMutation.mutateAsync({ id: business.id });
            if (result.deleteBusiness.success) {
                deleteBusiness(business.id);
                triggerAlert({
                    type: 'Success',
                    message: `La empresa ${business.name} fue eliminada correctamente`,
                });
            } else {
                triggerAlert({
                    type: 'Failure',
                    message:
                        result.deleteBusiness.message ||
                        `No se pudo eliminar la empresa ${business.name}`,
                });
            }
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo eliminar la empresa ${business.name}, compruebe la conexión a internet`,
            });
        }
        closeModal();
    };

    const handleNavigateEdit = async (): Promise<void> => {
        await router.push(routesBuilder.businesses.edit(business.id));
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
                        disabled={deleteMutation.isPending}
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
