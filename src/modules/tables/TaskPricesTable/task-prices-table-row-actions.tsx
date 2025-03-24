import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { TaskPrice } from './columns';

import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
    taskPrice: TaskPrice;
}

export function TaskPricesTableRowActions({ taskPrice }: Props) {
    const [modal, setModal] = useState(false);

    const handleDelete = () => {
        console.log('Eliminar precio de tarea:', taskPrice.id);
        setModal(false);
    };

    return (
        <div className="flex w-full justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 flex p-0">
                        <DotsHorizontalIcon className="size-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <div onClick={() => setModal(true)}>Eliminar</div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Modal
                openModal={modal}
                handleToggleModal={() => setModal(false)}
                action={handleDelete}
                msg="¿Seguro que quiere eliminar este precio?"
            />
        </div>
    );
}
