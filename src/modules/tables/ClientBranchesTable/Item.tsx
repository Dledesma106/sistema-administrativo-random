import Link from 'next/link';

import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import { BranchTableProps } from './ClientBranchesTable';

import Modal from '@/components/Modal';
import { TableCell, TableRow } from '@/components/ui/table';
import useAlert from '@/context/alertContext/useAlert';
import * as apiEndpoints from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';

interface Props {
    branch: BranchTableProps['branches'][0];
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
    const { triggerAlert } = useAlert();

    const deleteData = async (): Promise<void> => {
        try {
            await fetcher.delete(
                {
                    _id: branch.id,
                },
                apiEndpoints.techAdmin.branches,
            );
            deleteBranch(branch.id);
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

    const handleDelete = (): void => {
        void deleteData();
    };

    return (
        <TableRow className="border-b">
            <TableCell>{branch.number}</TableCell>
            <TableCell>{`${branch.city.name}, ${branch.city.province.name}`}</TableCell>
            <TableCell>
                {branch.businesses.length > 1
                    ? branch.businesses.map((business) => `${business.name}, `)
                    : `${branch.businesses[0].name}`}
            </TableCell>
            <TableCell>
                <div className="flex items-center justify-center gap-2">
                    <Link
                        className="rounded-lg p-0.5 hover:bg-gray-200"
                        href={`/tech-admin/clients/${branch.client.id}/branches/${branch.number}`}
                    >
                        <BsFillPencilFill color="gray" size="15" />
                    </Link>
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
            </TableCell>
        </TableRow>
    );
}
