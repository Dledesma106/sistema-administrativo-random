import { useRouter } from 'next/router';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { GetProvincesQuery } from '@/api/graphql';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAlert from '@/context/alertContext/useAlert';
import { useDeleteProvince } from '@/hooks/api/province/useDeleteProvince';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';

interface Props {
    province: GetProvincesQuery['provinces'][number];
}

export function ProvincesTableRowActions({ province }: Props) {
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const { triggerAlert } = useAlert();
    const deleteMutation = useDeleteProvince();

    const handleDelete = () => {
        deleteMutation.mutate(
            { id: province.id },
            {
                onSuccess: () => {
                    triggerAlert({
                        type: 'Success',
                        message: 'Provincia eliminada correctamente',
                    });
                    setModal(false);
                },
                onError: (error) => {
                    triggerAlert({
                        type: 'Failure',
                        message: getCleanErrorMessage(error),
                    });
                },
            },
        );
    };

    return (
        <div className="flex w-full justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" className="size-8 p-0">
                        <DotsHorizontalIcon className="size-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                        onClick={() =>
                            router.push(routesBuilder.provinces.edit(province.id))
                        }
                    >
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setModal(true)}>
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Modal
                openModal={modal}
                handleToggleModal={() => setModal(false)}
                action={handleDelete}
                msg="¿Seguro que quiere eliminar esta provincia?"
            />
        </div>
    );
}
