import { useRouter } from 'next/navigation';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Bill } from './columns';

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
    bill: Bill;
}

export function BillingTableRowActions({ bill }: Props) {
    const [modal, setModal] = useState(false);
    const router = useRouter();

    const handleDelete = () => {
        console.log('Eliminar factura:', bill.id);
        setModal(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                    routesBuilder.accounting.billing.edit(bill.id),
                                );
                            }}
                        >
                            Editar
                        </div>
                    </DropdownMenuItem>
                    {bill.status === 'Borrador' && (
                        <DropdownMenuItem asChild>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setModal(true);
                                }}
                            >
                                Eliminar
                            </div>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <Modal
                openModal={modal}
                handleToggleModal={() => setModal(false)}
                action={handleDelete}
                msg={`¿Seguro que quiere eliminar la factura de ${bill.businessName}?`}
            />
        </>
    );
}
