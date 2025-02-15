import { useRouter } from 'next/router';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { GetCitiesQuery } from '@/api/graphql';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAlert from '@/context/alertContext/useAlert';
import { useDeleteCity } from '@/hooks/api/city/useDeleteCity';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';

interface Props {
    city: GetCitiesQuery['cities'][number];
}

export function CitiesTableRowActions({ city }: Props) {
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const { triggerAlert } = useAlert();
    const deleteMutation = useDeleteCity();

    const handleDelete = () => {
        deleteMutation.mutate(
            { id: city.id },
            {
                onSuccess: () => {
                    triggerAlert({
                        type: 'Success',
                        message: 'Localidad eliminada correctamente',
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
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                        onClick={() => router.push(routesBuilder.cities.edit(city.id))}
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
                msg="¿Seguro que quiere eliminar esta localidad?"
            />
        </div>
    );
}
