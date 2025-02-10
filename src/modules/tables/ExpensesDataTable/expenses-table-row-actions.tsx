import { useRouter } from 'next/router';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { GetExpensesQuery } from '@/api/graphql';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteExpense } from '@/hooks/api/expenses/useDeleteExpense';
import { routesBuilder } from '@/lib/routes';

interface Props {
    expense: NonNullable<GetExpensesQuery['expenses']>[number];
}

export function ExpensesTableRowActions({ expense }: Props): JSX.Element {
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const deleteMutation = useDeleteExpense(expense.id);

    const openModal = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setModal(true);
    };

    const closeModal = (e?: React.MouseEvent): void => {
        e?.stopPropagation();
        setModal(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-[160px]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenuItem asChild>
                        <button
                            className="w-full cursor-default"
                            onClick={() =>
                                router.push(
                                    routesBuilder.accounting.expenses.details(expense.id),
                                )
                            }
                        >
                            Detalles
                        </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <button className="w-full cursor-default" onClick={openModal}>
                            Eliminar
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div onClick={(e) => e.stopPropagation()}>
                <Modal
                    openModal={modal}
                    handleToggleModal={closeModal}
                    action={(e) => {
                        e?.stopPropagation();
                        deleteMutation.mutate({
                            id: expense.id,
                            taskId: expense.task?.id ?? '',
                        });
                    }}
                    msg="¿Seguro que quiere eliminar este gasto?"
                />
            </div>
        </>
    );
}
