import { useRouter } from 'next/router';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { fetchClient } from '@/api/fetch-client';
import {
    DeleteExpenseDocument,
    DeleteExpenseMutation,
    DeleteExpenseMutationVariables,
    ExpensesQuery,
} from '@/api/graphql';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAlert from '@/context/alertContext/useAlert';
import { EXPENSES_LIST_QUERY_KEY } from '@/hooks/api/expenses/useGetExpenses';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';
import { ElementType } from '@/types';

interface Props {
    expense: ElementType<ExpensesQuery['expenses']>;
}

export function ExpensesTableRowActions({ expense }: Props): JSX.Element {
    const [modal, setModal] = useState(false);
    const { triggerAlert } = useAlert();
    const queryClient = useQueryClient();
    const router = useRouter();

    const openModal = (): void => {
        setModal(true);
    };

    const closeModal = (): void => {
        setModal(false);
    };

    const deleteMutation = useMutation<
        DeleteExpenseMutation,
        Error,
        DeleteExpenseMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(DeleteExpenseDocument, {
                id: data.id,
                taskId: data.taskId,
            });
        },
        onSuccess: (data) => {
            if (!data.deleteExpense) {
                return;
            }

            const { expense } = data.deleteExpense;
            if (!expense) {
                throw new Error('Hubo un error al eliminar el gasto');
            }

            queryClient.invalidateQueries({
                queryKey: EXPENSES_LIST_QUERY_KEY,
            });

            triggerAlert({
                type: 'Success',
                message: `El gasto fue eliminado correctamente`,
            });
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: getCleanErrorMessage(error),
            });
        },
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <button
                            className="w-full cursor-default"
                            onClick={() =>
                                router.push(routesBuilder.expenses.details(expense.id))
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

            <Modal
                openModal={modal}
                handleToggleModal={closeModal}
                action={() =>
                    deleteMutation.mutate({
                        id: expense.id,
                        taskId: expense.task?.id ?? '',
                    })
                }
                msg="¿Seguro que quiere eliminar este gasto?"
            />
        </>
    );
}
