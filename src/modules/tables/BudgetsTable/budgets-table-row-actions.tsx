import { useRouter } from 'next/router';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

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
    budget: {
        id: string;
        company: string;
        status: string;
    };
}

export function BudgetsTableRowActions({ budget }: Props) {
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const handleDelete = () => {
        console.log('Eliminar presupuesto:', budget.id);
        setModal(false);
    };

    return (
        <>
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
                    <DropdownMenuItem asChild>
                        <div
                            onClick={() =>
                                router.push(
                                    routesBuilder.accounting.budgets.edit(budget.id),
                                )
                            }
                        >
                            Editar
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Modal
                openModal={modal}
                handleToggleModal={() => setModal(false)}
                action={handleDelete}
                msg={`¿Seguro que quiere eliminar el presupuesto de ${budget.company}?`}
            />
        </>
    );
}
