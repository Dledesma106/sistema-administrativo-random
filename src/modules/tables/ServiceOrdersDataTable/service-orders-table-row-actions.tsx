import { useRouter } from 'next/navigation';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { ServiceOrder } from './columns';

import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { routesBuilder } from '@/lib/routes';

interface Props {
    serviceOrder: ServiceOrder;
}

export function ServiceOrdersTableRowActions({ serviceOrder }: Props) {
    const [modal, setModal] = useState(false);
    const router = useRouter();

    const handleDelete = () => {
        console.log('Eliminar orden:', serviceOrder.id);
        setModal(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex size-8 p-0">
                        <DotsHorizontalIcon className="size-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <div
                            onClick={() =>
                                router.push(
                                    routesBuilder.serviceOrders.edit(serviceOrder.id),
                                )
                            }
                        >
                            Editar
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <div onClick={() => setModal(true)}>Eliminar</div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Modal
                openModal={modal}
                handleToggleModal={() => setModal(false)}
                action={handleDelete}
                msg={`¿Seguro que quiere eliminar la orden de servicio #${serviceOrder.orderNumber}?`}
            />
        </>
    );
}
