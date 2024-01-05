import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

import Modal from '@/components/Modal';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import useAlert from '@/context/alertContext/useAlert';
import useLoading from '@/hooks/useLoading';
import * as api from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { dmyDateString } from '@/lib/utils';
import { type IPreventive, type IUser } from 'backend/models/interfaces';
import { type Month } from 'backend/models/types';

export default function Item({
    preventive,
    deletePreventive,
}: {
    preventive: IPreventive;
    deletePreventive: (id: string) => void;
}): JSX.Element {
    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();
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
                    _id: preventive._id,
                },
                api.techAdmin.preventives,
            );
            deletePreventive(preventive._id as string);
            triggerAlert({
                type: 'Success',
                message: `El preventivo de ${preventive.business.name} para la sucursal ${preventive.branch.number} del cliente ${preventive.branch.client.name} fue eliminado correctamente`,
            });
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: `No se pudo eliminar el preventivo de ${preventive.business.name} para la sucursal ${preventive.branch.number} del cliente ${preventive.branch.client.name}, compruebe su conexion`,
            });
        }
    };

    function imposedMonths(months: Month[]): string[] | Month {
        return months.length > 1 ? months.map((month) => `${month}, `) : months[0];
    }

    function selectedTechs(techs: IUser[]): string | string[] | undefined {
        if (techs.length === 0) {
            return undefined;
        }

        return techs.length > 1
            ? techs.map((tech) => `${tech.fullName as string}, `)
            : techs[0].fullName;
    }

    async function navigateEdit(): Promise<void> {
        startLoading();
        await router.push(`/tech-admin/preventives/${preventive._id as string}`);
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
            <TableCell>{preventive.business.name}</TableCell>
            <TableCell>{`${preventive.branch.number}, ${preventive.branch.client.name}, ${preventive.branch.city.name}`}</TableCell>
            <TableCell>{selectedTechs(preventive.assignedIDs)}</TableCell>
            <TableCell>
                {preventive.frequency !== undefined
                    ? `Cada ${preventive.frequency} meses`
                    : ''}
            </TableCell>
            <TableCell>
                {preventive.months ? imposedMonths(preventive.months) : ''}
            </TableCell>
            <TableCell>{preventive.observations}</TableCell>
            <TableCell>
                {preventive.lastDoneAt
                    ? dmyDateString(new Date(preventive.lastDoneAt))
                    : ''}
            </TableCell>
            <TableCell>
                <Badge variant="secondary">{preventive.status}</Badge>
            </TableCell>
            <TableCell>
                {preventive.batteryChangedAt
                    ? dmyDateString(new Date(preventive.batteryChangedAt))
                    : ''}
            </TableCell>
            <TableCell>
                <div className="flex items-center justify-evenly">
                    <button
                        className="rounded-lg p-0.5 hover:bg-gray-200 "
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
                </div>
                <Modal
                    openModal={modal}
                    handleToggleModal={closeModal}
                    action={handleDelete}
                    msg="¿Seguro que quiere eliminar este preventivo?"
                />
            </TableCell>
        </TableRow>
    );
}
