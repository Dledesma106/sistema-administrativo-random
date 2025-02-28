import { useRouter } from 'next/router';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { ExpenseStatus, GetExpensesQuery } from '@/api/graphql';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteExpense } from '@/hooks/api/expenses/useDeleteExpense';
import { useUpdateExpenseStatus } from '@/hooks/api/expenses/useUpdateExpenseStatus';
import { routesBuilder } from '@/lib/routes';

interface Props {
    expense: NonNullable<GetExpensesQuery['expenses']>[number];
}

export function ExpensesTableRowActions({ expense }: Props): JSX.Element {
    const [deleteModal, setDeleteModal] = useState(false);
    const [statusModal, setStatusModal] = useState<{
        open: boolean;
        status?: ExpenseStatus;
    }>({ open: false });
    const router = useRouter();
    const deleteMutation = useDeleteExpense(expense.id);
    const updateStatusMutation = useUpdateExpenseStatus();

    const openDeleteModal = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setDeleteModal(true);
    };

    const closeDeleteModal = (e?: React.MouseEvent): void => {
        e?.stopPropagation();
        setDeleteModal(false);
    };

    const openStatusModal =
        (status: ExpenseStatus) =>
        (e: React.MouseEvent): void => {
            e.stopPropagation();
            setStatusModal({
                open: true,
                status: status,
            });
        };

    const closeStatusModal = (e?: React.MouseEvent): void => {
        e?.stopPropagation();
        setStatusModal({ open: false });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-8 w-8 p-0">
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

                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <button
                                className="w-full cursor-default"
                                onClick={openStatusModal(ExpenseStatus.Aprobado)}
                            >
                                Aprobar
                            </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <button
                                className="w-full cursor-default"
                                onClick={openStatusModal(ExpenseStatus.Rechazado)}
                            >
                                Rechazar
                            </button>
                        </DropdownMenuItem>
                    </>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <button
                            className="w-full cursor-default"
                            onClick={openDeleteModal}
                        >
                            Eliminar
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div onClick={(e) => e.stopPropagation()}>
                <Modal
                    openModal={deleteModal}
                    handleToggleModal={closeDeleteModal}
                    action={(e) => {
                        e?.stopPropagation();
                        deleteMutation.mutate({
                            id: expense.id,
                            taskId: expense.task?.id ?? '',
                        });
                    }}
                    msg="¿Seguro que quiere eliminar este gasto?"
                />
                <Modal
                    openModal={statusModal.open}
                    handleToggleModal={closeStatusModal}
                    action={(e) => {
                        e?.stopPropagation();
                        if (statusModal.status) {
                            updateStatusMutation.mutate({
                                expenseId: expense.id,
                                status: statusModal.status,
                            });
                        }
                        closeStatusModal();
                    }}
                    msg={`¿Seguro que quiere ${
                        statusModal.status === ExpenseStatus.Aprobado
                            ? 'aprobar'
                            : 'rechazar'
                    } este gasto?`}
                />
            </div>
        </>
    );
}
